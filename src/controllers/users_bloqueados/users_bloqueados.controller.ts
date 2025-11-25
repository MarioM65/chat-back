import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsuarioBloqueado } from 'generated/prisma';
import { UserBloqueadoService } from 'src/services/user_bloqueado/user_bloqueado.service';
import { CreateUserBloqueadoDto, UpdateUserBloqueadoDto } from './users_bloqueados.dto';

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
        @Param('id') id: string
    ) : Promise<UsuarioBloqueado|null> {
        return this.userBloqueadoService.getUserBloqueadoById(Number(id));
    }
    @Get('user/:id_usuario')
    async getUserBloqueadosByUserId(
        @Param('id_usuario') id_usuario: string
    ) : Promise<UsuarioBloqueado[]> {
        return this.userBloqueadoService.getUserBloqueadosByUserId(Number(id_usuario));
    }
    @Get('blocked-user/:id_usuario_bloqueado')
    async getUserBloqueadosByBlockedUserId(
        @Param('id_usuario_bloqueado') id_usuario_bloqueado: string
    ) : Promise<UsuarioBloqueado[]> {
        return this.userBloqueadoService.getUserBloqueadosByBlockedUserId(Number(id_usuario_bloqueado));
    }
    @Post()
    async createUserBloqueado(
        @Body() data: CreateUserBloqueadoDto
    ) : Promise<UsuarioBloqueado> {
        return this.userBloqueadoService.createUserBloqueado(data);
    }
    @Put(':id')
    async updateUserBloqueado(
        @Param('id') id: string,
        @Body( ) data: UpdateUserBloqueadoDto
    ) : Promise<UsuarioBloqueado> {
        return this.userBloqueadoService.updateUserBloqueado(Number(id), data);
    }

    @Post('block')
    async blockUser(
        @Body() data: CreateUserBloqueadoDto
    ) : Promise<UsuarioBloqueado> {
        return this.userBloqueadoService.blockUser(data.id_usuario, data.id_usuario_bloqueado);
    }

    @Delete('unblock')
    async unblockUser(
        @Body() data: CreateUserBloqueadoDto
    ) : Promise<UsuarioBloqueado> {
        return this.userBloqueadoService.unblockUser(data.id_usuario, data.id_usuario_bloqueado);
    }
}