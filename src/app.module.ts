import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersBloqueadosController } from './controllers/users_bloqueados/users_bloqueados.controller';
import { ParticipanteConversaController } from './controllers/participantes_conversas/participantes_conversas.controller';
import { ConversaController } from './controllers/conversas/conversas.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { PrismaService } from './services/prisma/prisma.service';
import { UserService } from './services/user/user.service';
import { UserBloqueadoService } from './services/user_bloqueado/user_bloqueado.service';
import { ParticipanteConversaService } from './services/participante_conversa/participante_conversa.service';
import { ConversaService } from './services/conversa/conversa.service';
import { AuthService } from './services/auth/auth.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [AuthModule, PrismaModule,UserModule],
  controllers: [ UsersController, UsersBloqueadosController, ConversaController, ParticipanteConversaController ],
  providers: [UserBloqueadoService, ConversaService, ParticipanteConversaService],
})
export class AppModule {}
