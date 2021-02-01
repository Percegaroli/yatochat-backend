import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';
import { NewUserDTO } from '../DTO/NewUserDTO';
import { User, UserDocument } from '../schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  getUser(): string {
    return 'Hello World!';
  }

  async createNewUser(newUserDTO: NewUserDTO) {
    const newUser = new this.userModel(newUserDTO);
    newUser.password = await this.hashPassword(newUser.password);
    newUser.save();
  }

  private hashPassword(password: string) {
    return hash(password, 10);
  }
}
