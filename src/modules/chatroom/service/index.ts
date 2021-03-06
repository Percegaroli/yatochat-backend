import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserService } from 'src/modules/user/service';
import { ChatroomResumeDTO } from '../DTO/ChatroomResumeDTO';
import { ChatroomDetailsDTO } from '../DTO/ChatroomDetailsDTO';
import { NewChatroomDTO } from '../DTO/NewChatroomDTO';
import { ChatroomDocument, Chatroom } from '../schema/Chatroom';
import MessageData from 'src/modules/chatSocket/interfaces/MessageData';
import { Roles } from '../enum/Roles';
import { UserDocument } from 'src/modules/user/schema';
import { ChatMember } from '../schema/ChatMember';
import { GroupMemberDTO } from '../DTO/GroupMemberDTO';
import { InviteUserDTO } from '../DTO/InviteUserDTO';
import { ChatroomInvitationResponseDTO } from '../DTO/ChatroomInvitationResponseDTO';
import { PhotoUploadProvider } from 'src/modules/photoUpload/providers/PhotoUploadProvider';
import { ChangeChatroomPhotoDTO } from '../DTO/ChangeChatroomPhotoDTO';
import { NewChatroomResponseDTO } from '../DTO/NewChatroomResponseDTO';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectModel(Chatroom.name) private chatroomModel: Model<ChatroomDocument>,
    private readonly userService: UserService,
    private readonly photoUploadProvider: PhotoUploadProvider,
  ) {}

  async getPublicChatRooms() {
    const chatrooms = await this.chatroomModel
      .find({ isPrivate: false })
      .exec();
    return chatrooms.map((chatroom) => this.createChatroomResumeDTO(chatroom));
  }

  findChatroomById(id: string) {
    this.checkForValidObjectId(id);
    return this.chatroomModel.findById(id).exec();
  }

  async getChatroomDetails(id: string) {
    const chatroom = await this.findChatroomById(id);
    return this.createChatroomDetailsDTO(chatroom);
  }

  async inviteUser(inviteUserDTO: InviteUserDTO) {
    const { groupId, invitedById, userInvitedEmail } = inviteUserDTO;
    const [invitedBy, userInvited, group] = await Promise.all([
      this.userService.getUserById(invitedById),
      this.userService.getUserByEmail(userInvitedEmail),
      this.findChatroomById(groupId),
    ]);
    userInvited.groupInvitations.push({
      groupId: group._id,
      invitationDate: new Date(),
      userId: invitedBy._id,
    });
    userInvited.save();
  }

  async updateGroupPhoto(
    id: string,
    file: Express.Multer.File,
  ): Promise<ChangeChatroomPhotoDTO> {
    const chatroom = await this.findChatroomById(id);
    const response = await this.photoUploadProvider.uploadGroupPhoto(
      file,
      chatroom.photoUrl,
    );
    chatroom.photoUrl = response.secure_url;
    chatroom.save();
    return {
      photoUrl: response.secure_url,
    };
  }

  async createNewChatroom(
    newChatroomDTO: NewChatroomDTO,
  ): Promise<NewChatroomResponseDTO> {
    const creator = this.userService.getUserById(newChatroomDTO.owner_id);
    const today = new Date();
    const newChatroom = new this.chatroomModel(newChatroomDTO);
    newChatroom.createdAt = today;
    const user = await creator;
    newChatroom.members.push(this.createChatMember(user, Roles.OWNER));
    this.userService.addChatroom(newChatroom, user);
    await newChatroom.save();
    return { id: newChatroom._id };
  }

  async joinChatroom(
    chatroomInvitationResponseDTO: ChatroomInvitationResponseDTO,
  ) {
    const { userId, groupId } = chatroomInvitationResponseDTO;
    const [user, chatroom] = await Promise.all([
      this.userService.getUserById(userId),
      this.findChatroomById(groupId),
    ]);
    this.userService.joinChatroom(user, chatroom);
    chatroom.members.push(this.createChatMember(user, Roles.MEMBER));
    await chatroom.save();
  }

  async rejectInvitation(
    chatroomInvitationResponseDTO: ChatroomInvitationResponseDTO,
  ) {
    const { userId, groupId, invitedBy } = chatroomInvitationResponseDTO;
    const user = await this.userService.getUserById(userId);
    user.groupInvitations = user.groupInvitations.filter((invitation) => {
      return !(
        invitation.userId.toString() === invitedBy &&
        invitation.groupId.toString() === groupId
      );
    });
    await user.save();
  }

  async saveNewMessage(messageData: MessageData) {
    const { room_id, message, user_id } = messageData;
    this.checkForValidObjectId(room_id);
    const chatroom = await this.findChatroomById(room_id);
    chatroom.messages.push({
      date: new Date(),
      message,
      user_id: user_id,
    });
    chatroom.save();
  }

  private createChatMember = (user: UserDocument, role: Roles): ChatMember => ({
    user: user._id,
    role,
    joinedAt: new Date(),
  });

  private createChatroomResumeDTO(
    chatroom: ChatroomDocument,
  ): ChatroomResumeDTO {
    const { isPrivate, name, members, _id, photoUrl } = chatroom;
    return {
      isPrivate,
      members: members.length,
      name,
      id: _id,
      photoUrl,
    };
  }

  async createChatroomDetailsDTO(
    chatroom: ChatroomDocument,
  ): Promise<ChatroomDetailsDTO> {
    await chatroom
      .populate({ path: 'members.user', model: 'User' })
      .execPopulate();
    const { members, name, createdAt, messages, _id, photoUrl } = chatroom;
    return {
      id: _id,
      members: members.map((member) => this.createMemberDTO(member)),
      name,
      createdAt,
      messages,
      photoUrl,
    };
  }

  checkForValidObjectId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException({
        code: HttpStatus.BAD_REQUEST,
        description: 'Illegal identifier',
      });
    }
  }

  createMemberDTO(member: ChatMember): GroupMemberDTO {
    const { user, role, joinedAt } = member;
    return {
      user: this.userService.createUserResume(user as UserDocument),
      role,
      joinedAt,
    };
  }
}
