import { Module } from '@nestjs/common';
import { ChatModule } from './chatSocket';
import { ChatroomModule } from './chatroom';
import { UserModule } from './user';

@Module({
  imports: [ChatModule, ChatroomModule, UserModule],
  exports: [ChatModule, ChatroomModule, UserModule],
})
export class Modules {}
