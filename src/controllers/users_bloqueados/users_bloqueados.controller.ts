import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsuarioBloqueado } from 'generated/prisma';
import { UserBloqueadoService } from 'src/services/user_bloqueado/user_bloqueado.service';
import { CreateUserBloqueadoDto, UpdateUserBloqueadoDto } from './users_bloqueados.dto';
import { User } from 'src/common/decorators/user.decorator'; // Import User decorator

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
        @Body() data: CreateUserBloqueadoDto,
        @User() user: { sub: number }, // Inject authenticated user ID
    ) : Promise<UsuarioBloqueado> {
        // Here, id_usuario is inferred from the authenticated user
        return this.userBloqueadoService.createUserBloqueado(user.sub, data.id_usuario_bloqueado, user.sub); // Pass user.sub as requestingUserId
    }
    @Put(':id')
    async updateUserBloqueado(
        @Param('id') id: string,
        @Body( ) data: UpdateUserBloqueadoDto,
        @User() user: { sub: number }, // For authorization check in service
    ) : Promise<UsuarioBloqueado> {
        return this.userBloqueadoService.updateUserBloqueado(Number(id), data, user.sub); // Pass user.sub as requestingUserId
    }

    @Post('block')
    async blockUser(
        @Body() data: CreateUserBloqueadoDto, // data now only contains id_usuario_bloqueado
        @User() user: { sub: number }, // Inject authenticated user ID
    ) : Promise<UsuarioBloqueado> {
        return this.userBloqueadoService.blockUser(user.sub, data.id_usuario_bloqueado, user.sub); // Pass user.sub as requestingUserId
    }

    @Delete('unblock')
    async unblockUser(
        @Body() data: CreateUserBloqueadoDto, // data now only contains id_usuario_bloqueado
        @User() user: { sub: number }, // Inject authenticated user ID
    ) : Promise<UsuarioBloqueado> {
        return this.userBloqueadoService.unblockUser(user.sub, data.id_usuario_bloqueado, user.sub); // Pass user.sub as requestingUserId
    }
    // Changed DELETE /users-bloqueados/:id to take requesting user ID
    @Delete(':id')
    async deleteUserBloqueado(
        @Param('id') id: string,
        @User() user: { sub: number }, // For authorization check in service
    ) : Promise<UsuarioBloqueado> {
        return this.userBloqueadoService.deleteUserBloqueado(Number(id), user.sub); // Pass user.sub as requestingUserId
    }
}