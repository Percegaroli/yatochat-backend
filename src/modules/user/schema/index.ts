import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Chatroom } from '../../chatroom/schema/Chatroom';
import GroupInvitation from '../interface/Invitation';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop({ minlength: 3, required: true })
  name: string;

  @Prop({ minlength: 5, required: true })
  lastName: string;

  @Prop({ required: true, minlength: 8, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        name: Chatroom.name,
      },
    ],
  })
  chatrooms: Array<Chatroom>;

  @Prop({ required: false })
  groupInvitations: Array<GroupInvitation>;
}

export const UserSchema = SchemaFactory.createForClass(User);
