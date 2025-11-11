import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersBloqueadosController } from './controllers/users_bloqueados/users_bloqueados.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { PrismaService } from './services/prisma/prisma.service';
import { UserService } from './services/user/user.service';
import { UserBloqueadoService } from './services/user_bloqueado/user_bloqueado.service';

@Module({
  imports: [],
  controllers: [ UsersController, UsersBloqueadosController, AuthController],
  providers: [PrismaService, UserService, UserBloqueadoService],
})
export class AppModule {}
