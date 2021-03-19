import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import MessageData from './interfaces/MessageData';
import { EventEnum } from './enum/Events';
import { ChatroomService } from '../chatroom/service';

@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly chatroomService: ChatroomService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage(EventEnum.JOIN_ROOM)
  joinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room);
  }

  @SubscribeMessage(EventEnum.CLIENT_SEND_NEW_MESSAGE)
  async sendMessage(
    @MessageBody() messageData: MessageData,
    @ConnectedSocket() client: Socket,
  ) {
    const { message, room_id } = messageData;
    client.to(room_id).emit(EventEnum.CLIENT_RECEIVE_NEW_MESSAGE, message);
    await this.chatroomService.saveNewMessage(messageData);
  }
}
