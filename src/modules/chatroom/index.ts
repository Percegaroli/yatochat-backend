import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatroom, ChatroomSchema } from './schema/Chatroom';
import { ChatroomController } from './controller';
import { ChatroomService } from './service';
import { UserModule } from '../user';
import { AuthModule } from '../auth';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chatroom.name, schema: ChatroomSchema },
    ]),
    UserModule,
    AuthModule,
  ],
  controllers: [ChatroomController],
  providers: [ChatroomService],
  exports: [ChatroomService],
})
export class ChatroomModule {}
