import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { MensagensService } from '../services/mensagens/mensagens.service';
import { CreateMensagemDto } from 'src/controllers/mensagens/mensagens.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');

  constructor(private readonly mensagensService: MensagensService) {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    this.logger.log(`Client ${client.id} left room: ${room}`);
  }

  @SubscribeMessage('chatMessage')
  async handleMessage(
    client: Socket,
    payload: CreateMensagemDto,
  ): Promise<void> {
    try {
      // O gateway não lida com uploads de arquivo, então passamos `undefined` para anexos
      const savedMessage = await this.mensagensService.createMensagemComAnexos(
        payload,
        undefined,
      );

      if (payload.id_conversa) {
        // Emite a mensagem para a sala específica da conversa
        this.server
          .to(payload.id_conversa.toString())
          .emit('chatMessage', savedMessage);
      } else {
        // Fallback: se não houver id_conversa, transmite para todos (exceto o remetente)
        client.broadcast.emit('chatMessage', savedMessage);
      }
    } catch (error) {
      this.logger.error('Failed to save or broadcast message', error);
      // Opcional: emitir um evento de erro de volta para o cliente
      client.emit('error', 'Could not send message');
    }
  }

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
