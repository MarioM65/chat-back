import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersBloqueadosController } from './controllers/users_bloqueados/users_bloqueados.controller';
import { AuthController } from './controllers/auth/auth.controller';

@Module({
  imports: [],
  controllers: [ UsersController, UsersBloqueadosController, AuthController],
  providers: [],
})
export class AppModule {}
