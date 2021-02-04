import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { hash } from 'bcrypt';
import { NewUserDTO } from '../DTO/NewUserDTO';
import { User, UserDocument } from '../schema';
import { UserResumeDTO } from '../DTO/UserResumeDTO';
import { JwtManipulationProvider } from '../../auth/provider';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtManipulationProvider: JwtManipulationProvider,
  ) {}

  createUserAndLogin = async (newUserDTO: NewUserDTO) => {
    const newUser = await this.createNewUser(newUserDTO);
    return this.jwtManipulationProvider.createJwt({ id: newUser._id });
  };

  async createNewUser(newUserDTO: NewUserDTO) {
    const newUser = new this.userModel(newUserDTO);
    newUser.password = await this.hashPassword(newUser.password);
    return newUser.save();
  }

  private hashPassword(password: string) {
    return hash(password, 10);
  }

  getUserByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async getUserResume(id: string) {
    this.checkForValidObjectId(id);
    const userDocument = this.userModel.findById(id);
    return this.createUserResume(await userDocument);
  }

  checkForValidObjectId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException({
        code: HttpStatus.BAD_REQUEST,
        description: 'Illegal identifier',
      });
    }
  }

  public createUserResume(userDocument: User): UserResumeDTO {
    const { email, name, lastName } = userDocument;
    return {
      email,
      lastName,
      name,
    };
  }
}
