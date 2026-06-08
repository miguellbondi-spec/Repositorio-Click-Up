import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/chat' })
export class ChatGateway {
  @WebSocketServer() server: Server;
  constructor(private chat: ChatService) {}

  @SubscribeMessage('joinChannel')
  handleJoin(@MessageBody() data: { channelId: string }, @ConnectedSocket() client: Socket) {
    client.join(data.channelId);
    return { event: 'joined', data: data.channelId };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: { channelId: string; authorId: string; content: string }) {
    const message = await this.chat.sendMessage(data.channelId, data.authorId, data.content);
    this.server.to(data.channelId).emit('newMessage', message);
    return message;
  }

  @SubscribeMessage('leaveChannel')
  handleLeave(@MessageBody() data: { channelId: string }, @ConnectedSocket() client: Socket) {
    client.leave(data.channelId);
  }
}
