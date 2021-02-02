import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserService } from 'src/modules/user/service';
import { ChatroomResumeDTO } from '../DTO/ChatroomResumeDTO';
import { ChatroomDetailsDTO } from '../DTO/ChatroomDetailsDTO';
import { NewChatroomDTO } from '../DTO/NewChatroomDTO';
import { ChatroomDocument, Chatroom } from '../schema/Chatroom';
import MessageData from 'src/modules/chatSocket/interfaces/MessageData';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectModel(Chatroom.name) private chatroomModel: Model<ChatroomDocument>,
    private readonly userService: UserService,
  ) {}

  async getPublicChatRooms() {
    const chatrooms = await this.chatroomModel
      .find({ isPrivate: false })
      .exec();
    return chatrooms.map((chatroom) => this.createChatroomResumeDTO(chatroom));
  }

  async getChatroomDetails(id: string) {
    this.checkForValidObjectId(id);
    const chatroom = await this.chatroomModel.findById(id).exec();
    await chatroom.populate('members').execPopulate();
    return this.createChatroomDetailsDTO(chatroom);
  }

  async createNewChatroom(newChatroomDTO: NewChatroomDTO) {
    const creator = this.userService.getUserByEmail(newChatroomDTO.owner_email);
    const today = new Date();
    const newChatroom = new this.chatroomModel(newChatroomDTO);
    newChatroom.createdAt = today;
    newChatroom.members.push(await creator);
    return newChatroom.save();
  }

  async saveNewMessage(messageData: MessageData) {
    const { room, message, sender } = messageData;
    this.checkForValidObjectId(room);
    const chatroom = await this.chatroomModel.findById(room);
    chatroom.messages.push({
      date: new Date(),
      message,
      owner_id: sender,
    });
    chatroom.save();
  }

  checkForValidObjectId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException({
        code: HttpStatus.BAD_REQUEST,
        description: 'Illegal identifier',
      });
    }
  }

  private createChatroomResumeDTO(
    chatroom: ChatroomDocument,
  ): ChatroomResumeDTO {
    const { isPrivate, name, members, _id } = chatroom;
    return {
      isPrivate,
      members: members.length,
      name,
      id: _id,
    };
  }

  private createChatroomDetailsDTO(
    chatroom: ChatroomDocument,
  ): ChatroomDetailsDTO {
    const { members, name, createdAt, messages } = chatroom;
    return {
      members: members.map((member) =>
        this.userService.createUserResume(member),
      ),
      name,
      createdAt,
    };
  }
}
