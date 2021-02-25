import { Types } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../user/schema';
import { Roles } from '../enum/Roles';

export class ChatMember {
  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
  })
  user: User;

  @Prop()
  role: Roles;

  @Prop()
  joinedAt: Date;
}

export const ChatMemberSchema = SchemaFactory.createForClass(ChatMember);
