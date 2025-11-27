import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UnauthorizedException } from '@nestjs/common'; // Import UnauthorizedException
import { Server, Socket } from 'socket.io';
import { MensagensService } from '../services/mensagens/mensagens.service';
import { CreateMensagemDto } from 'src/controllers/mensagens/mensagens.dto';
import { JwtService } from '@nestjs/jwt'; // Import JwtService

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

  constructor(
    private readonly mensagensService: MensagensService,
    private readonly jwtService: JwtService, // Inject JwtService
  ) {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    // Check if client is authenticated and authorized to join this room
    // For now, assuming client is already authenticated at connection
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
      // Get authenticated user ID from client context
      // Assuming userId is stored in client.data after successful connection authentication
      const userId = client.data.userId;
      if (!userId) {
        throw new UnauthorizedException('Client not authenticated for chat message.');
      }

      // O gateway não lida com uploads de arquivo, então passamos `undefined` para anexos
      const savedMessage = await this.mensagensService.createMensagemComAnexos(
        payload,
        [], // No file uploads via WebSocket directly
        userId, // Pass the authenticated userId
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
      client.emit('error', error instanceof UnauthorizedException ? error.message : 'Could not send message');
    }
  }

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    const token = client.handshake.auth.token;

    if (!token) {
      this.logger.error('Client disconnected: No authentication token provided.');
      return client.disconnect(true);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: process.env.jwtSecret });
      client.data.userId = payload.sub; // Store userId in client.data
      this.logger.log(`Client ${client.id} authenticated as user ${payload.sub}`);
    } catch (error) {
      this.logger.error(`Client ${client.id} authentication failed: ${error.message}`);
      return client.disconnect(true);
    }
  }
}
