import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersBloqueadosController } from './controllers/users_bloqueados/users_bloqueados.controller';
import { ParticipanteConversaController } from './controllers/participantes_conversas/participantes_conversas.controller';
import { ConversaController } from './controllers/conversas/conversas.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { PrismaService } from './services/prisma/prisma.service';
import { UserService } from './services/user/user.service';
import { UserBloqueadoService } from './services/user_bloqueado/user_bloqueado.service';
import { UserModule } from './modules/user/user.module';
import { UserBloqueadoModule } from './modules/user_bloqueado/user_bloqueado.module';
import { ConversaService } from './services/conversa/conversa.service';
import { ParticipanteConversaService } from './services/participante_conversa/participante_conversa.service';

@Module({
  imports: [],
  controllers: [ UsersController, UsersBloqueadosController, AuthController,ParticipanteConversaController, ConversaController],
  providers: [PrismaService, UserService, UserBloqueadoService, ConversaService, ParticipanteConversaService],
})
export class AppModule {}
