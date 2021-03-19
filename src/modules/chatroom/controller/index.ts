import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ChatroomService } from '../service';
import { NewChatroomDTO } from '../DTO/NewChatroomDTO';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { InviteUserDTO } from '../DTO/InviteUserDTO';
import { JoinChatroomDTO } from '../DTO/JoinChatroomDTO';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@UseGuards(JwtGuard)
@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Get('/public')
  getPublicChatRooms() {
    return this.chatroomService.getPublicChatRooms();
  }

  @Get(':id')
  getChatroomDetails(@Param('id') id: string) {
    return this.chatroomService.getChatroomDetails(id);
  }

  @Post()
  async createNewChatroom(@Body() newChatroomDTO: NewChatroomDTO) {
    await this.chatroomService.createNewChatroom(newChatroomDTO);
  }

  @Post('/invite')
  inviteUser(@Body() inviteUserDTO: InviteUserDTO) {
    return this.chatroomService.inviteUser(inviteUserDTO);
  }

  @Post('/join')
  joinChatroom(@Body() joinChatroomDTO: JoinChatroomDTO) {
    return this.chatroomService.joinChatroom(joinChatroomDTO);
  }

  @Post(':id/photo')
  @UseInterceptors(FileInterceptor('picture', { storage: memoryStorage() }))
  uploadGroupPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.chatroomService.updateGroupPhoto(id, file);
  }
}
