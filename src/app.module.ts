import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersBloqueadosController } from './controllers/users_bloqueados/users_bloqueados.controller';
import { ParticipanteConversaController } from './controllers/participantes_conversas/participantes_conversas.controller';
import { ConversaController } from './controllers/conversas/conversas.controller';
import { NotificacaoController } from './controllers/notificacoes/notificacoes.controller';
import { LeituraMensagemController } from './controllers/leituras_mensagens/leituras_mensagens.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { PrismaService } from './services/prisma/prisma.service';
import { UserService } from './services/user/user.service';
import { UserBloqueadoService } from './services/user_bloqueado/user_bloqueado.service';
import { ParticipanteConversaService } from './services/participante_conversa/participante_conversa.service';
import { ConversaService } from './services/conversa/conversa.service';
import { AuthModule } from './modules/auth/auth.module';
import { MensagensController } from './controllers/mensagens/mensagens.controller';
import { MensagensService } from './services/mensagens/mensagens.service';
import { AnexosController } from './controllers/anexos/anexos.controller';
import { AnexosService } from './services/anexos/anexos.service';
import { NotificacaoService } from './services/notificacao/notificacao.service';
import { LeituraMensagemService } from './services/leitura_mensagem/leitura_mensagem.service';
@Module({
  imports: [AuthModule],
  controllers: [ UsersController, UsersBloqueadosController, AuthController, ConversaController, ParticipanteConversaController, MensagensController, AnexosController, NotificacaoController, LeituraMensagemController ],
  providers: [PrismaService, UserService, UserBloqueadoService, ConversaService, ParticipanteConversaService, AnexosService, MensagensService, NotificacaoService, LeituraMensagemService],
})
export class AppModule {}
