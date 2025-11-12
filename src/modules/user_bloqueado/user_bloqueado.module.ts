import { Module } from '@nestjs/common';
import { UsersBloqueadosController } from 'src/controllers/users_bloqueados/users_bloqueados.controller';
import { UserBloqueadoService } from 'src/services/user_bloqueado/user_bloqueado.service';

@Module({
    providers: [UserBloqueadoService],
    controllers: [UsersBloqueadosController],
})
export class UserBloqueadoModule {}
