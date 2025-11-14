import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsuarioBloqueado } from 'generated/prisma';
import { CreateUserBloqueado, UpdateUserBloqueado } from '../../interfaces/user_bloqueado';
import { UserBloqueadoService } from 'src/services/user_bloqueado/user_bloqueado.service';

@Controller('users-bloqueados')
export class UsersBloqueadosController {
    constructor(private readonly userBloqueadoService: UserBloqueadoService) {
        
    }


    @Get()
    async getUsersBloqueados() : Promise<UsuarioBloqueado[]> {
        return this.userBloqueadoService.getAllUserBloqueados();
    }
    @Get(':id')
    async getUserBloqueadoById(
        @Param('id') id: number
    ) : Promise<UsuarioBloqueado|null> {
        return this.userBloqueadoService.getUserBloqueadoById(Number(id));
    }
    @Get('user/:id_usuario')
    async getUserBloqueadosByUserId(
        @Param('id_usuario') id_usuario: number
    ) : Promise<UsuarioBloqueado[]> {
        return this.userBloqueadoService.getUserBloqueadosByUserId(Number(id_usuario));
    }
    @Get('blocked-user/:id_usuario_bloqueado')
    async getUserBloqueadosByBlockedUserId(
        @Param('id_usuario_bloqueado') id_usuario_bloqueado: number
    ) : Promise<UsuarioBloqueado[]> {
        return this.userBloqueadoService.getUserBloqueadosByBlockedUserId(Number(id_usuario_bloqueado));
    }
    @Post()
    async createUserBloqueado(
        @Body() data: CreateUserBloqueado
    ) : Promise<UsuarioBloqueado> {
        return this.userBloqueadoService.createUserBloqueado(data);
    }
    @Put(':id')
    async updateUserBloqueado(
        @Param('id') id: number,
        @Body( ) data: UpdateUserBloqueado
    ) : Promise<UsuarioBloqueado> {
        return this.userBloqueadoService.updateUserBloqueado(Number(id), {});
    }
}