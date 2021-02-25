import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Message } from '../interfaces/Message';
import { ChatMemberSchema, ChatMember } from './ChatMember';

export type ChatroomDocument = Chatroom & Document;

@Schema()
export class Chatroom {
  @Prop()
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  isPrivate: boolean;

  @Prop({
    required: true,
    immutable: true,
  })
  createdAt: Date;

  @Prop({ required: false })
  photo: string;

  @Prop()
  members: Array<ChatMember>;

  @Prop()
  messages: Array<Message>;
}

export const ChatroomSchema = SchemaFactory.createForClass(Chatroom);
