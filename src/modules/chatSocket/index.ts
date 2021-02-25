import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway';
import { ChatroomModule } from '../chatroom';

@Module({
  imports: [ChatroomModule],
  providers: [ChatGateway],
})
export class ChatModule {}
