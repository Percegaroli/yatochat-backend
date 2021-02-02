import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
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

  @SubscribeMessage(EventEnum.NEW_MESSAGE)
  async sendMessage(
    @MessageBody() messageData: MessageData,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<MessageData>> {
    const { message, room } = messageData;
    client.to(room).emit(EventEnum.NEW_MESSAGE, message);
    await this.chatroomService.saveNewMessage(messageData);
    return {
      event: EventEnum.NEW_MESSAGE,
      data: messageData,
    };
  }
}
