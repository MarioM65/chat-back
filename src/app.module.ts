import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersBloqueadosController } from './controllers/users_bloqueados/users_bloqueados.controller';
import { ParticipanteConversaController } from './controllers/participantes_conversas/participantes_conversas.controller';
import { ConversaController } from './controllers/conversas/conversas.controller';
import { NotificacaoController } from './controllers/notificacoes/notificacoes.controller';
import { LeituraMensagemController } from './controllers/leituras_mensagens/leituras_mensagens.controller';
import { UserBloqueadoService } from './services/user_bloqueado/user_bloqueado.service';
import { ParticipanteConversaService } from './services/participante_conversa/participante_conversa.service';
import { ConversaService } from './services/conversa/conversa.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { LeituraMensagemService } from './services/leitura_mensagem/leitura_mensagem.service';
import { NotificacaoService } from './services/notificacao/notificacao.service';
import { AnexosService } from './services/anexos/anexos.service';
import { MensagensService } from './services/mensagens/mensagens.service';
import { MensagensController } from './controllers/mensagens/mensagens.controller';
import { AnexosController } from './controllers/anexos/anexos.controller';

@Module({
  imports: [AuthModule, PrismaModule,UserModule],
  controllers: [ UsersController, UsersBloqueadosController, ConversaController, ParticipanteConversaController, NotificacaoController, LeituraMensagemController, MensagensController, AnexosController ],
  providers: [UserBloqueadoService, ConversaService, ParticipanteConversaService, LeituraMensagemService, NotificacaoService, AnexosService, MensagensService],
})
export class AppModule {}
