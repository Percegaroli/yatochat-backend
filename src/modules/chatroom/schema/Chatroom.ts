import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { User } from 'src/modules/user/schema';
import { Message } from '../interfaces/Message';

export type ChatroomDocument = Chatroom & Document;

@Schema()
export class Chatroom {
  @Prop()
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  isPrivate: boolean;

  @Prop({
    required: true,
    immutable: true,
  })
  createdAt: Date;

  @Prop({
    type: [
      {
        type: mongooseSchema.Types.ObjectId,
        ref: User.name,
      },
    ],
  })
  members: Array<User>;

  @Prop()
  messages: Array<Message>;
}

export const ChatroomSchema = SchemaFactory.createForClass(Chatroom);
