import {
  Injectable,
  BadRequestException,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { hash } from 'bcrypt';
import { NewUserDTO } from '../DTO/NewUserDTO';
import { User, UserDocument } from '../schema';
import { UserResumeDTO } from '../DTO/UserResumeDTO';
import {
  ChatroomDocument,
  Chatroom,
} from 'src/modules/chatroom/schema/Chatroom';
import { AuthService } from 'src/modules/auth/service';
import { UserDetailedDTO } from '../DTO/UserDetailedDTO';
import { ChatroomService } from 'src/modules/chatroom/service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => ChatroomService))
    private readonly chatroomService: ChatroomService,
  ) {}

  createUserAndLogin = async (newUserDTO: NewUserDTO) => {
    const newUser = await this.createNewUser(newUserDTO);
    return this.authService.createLoginResponseDTO(newUser);
  };

  async createNewUser(newUserDTO: NewUserDTO) {
    const newUser = new this.userModel(newUserDTO);
    newUser.password = await this.hashPassword(newUser.password);
    return newUser.save();
  }

  addChatroom(chatroom: ChatroomDocument, user: UserDocument) {
    user.chatrooms.push(chatroom);
    user.save();
  }

  getUserById(id: string) {
    this.checkForValidObjectId(id);
    return this.userModel.findById(id).exec();
  }

  async getLoggedUserDetails(id: string) {
    this.checkForValidObjectId(id);
    const user = await this.getUserById(id);
    return this.createUserDetailedDTO(user);
  }

  getUserByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email: email }).exec();
  }

  joinChatroom(user: UserDocument, chatroom: ChatroomDocument) {
    user.chatrooms.push(chatroom);
    const chatroomId = chatroom._id.toString();
    user.groupInvitations = user.groupInvitations.filter(
      (invitation) => invitation.groupId.toString() !== chatroomId,
    );
    user.save();
  }

  checkForValidObjectId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException({
        code: HttpStatus.BAD_REQUEST,
        description: 'Illegal identifier',
      });
    }
  }

  private hashPassword(password: string) {
    return hash(password, 10);
  }

  async createUserDetailedDTO(
    userDocument: UserDocument,
  ): Promise<UserDetailedDTO> {
    await userDocument
      .populate({ path: 'chatrooms', model: Chatroom.name })
      .execPopulate();
    const {
      chatrooms,
      email,
      lastName,
      name,
      _id,
      groupInvitations,
    } = userDocument;
    const chatroomDetailsPromise = chatrooms.map((chatroom: ChatroomDocument) =>
      this.chatroomService.createChatroomDetailsDTO(chatroom),
    );
    const chatroomDetailsDTO = await Promise.all(chatroomDetailsPromise);
    return {
      email,
      id: _id,
      name,
      lastName,
      chatrooms: chatroomDetailsDTO,
      groupInvitations,
    };
  }

  createUserResume(userDocument: UserDocument): UserResumeDTO {
    const { email, name, lastName, _id } = userDocument;
    return {
      id: _id,
      email,
      lastName,
      name,
    };
  }
}
