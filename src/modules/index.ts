import { Module } from '@nestjs/common';
import { ChatModule } from './chatSocket';
import { ChatroomModule } from './chatroom';
import { UserModule } from './user';
import { AuthModule } from './auth';

@Module({
  imports: [ChatModule, ChatroomModule, UserModule, AuthModule],
  exports: [ChatModule, ChatroomModule, UserModule, AuthModule],
})
export class Modules {}
