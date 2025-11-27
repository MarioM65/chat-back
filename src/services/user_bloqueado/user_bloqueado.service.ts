import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserBloqueadoDto, UpdateUserBloqueadoDto } from 'src/controllers/users_bloqueados/users_bloqueados.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserBloqueadoService {
constructor(private prisma: PrismaService) {}
 async getAllUserBloqueados() {
        return this.prisma.usuarioBloqueado.findMany();
    }
    async getUserBloqueadoById(id: number) {
        const userBloqueado = await this.prisma.usuarioBloqueado.findUnique({
            where: { id },
        });
        if (!userBloqueado) {
            throw new HttpException('UserBloqueado not found', HttpStatus.NOT_FOUND);
        }
        return userBloqueado;
    }
    async getUserBloqueadosByUserId(id_usuario: number) {
        return this.prisma.usuarioBloqueado.findMany({
            where: { id_usuario },
        });
    }
    async getUserBloqueadosByBlockedUserId(id_usuario_bloqueado: number) {
        return this.prisma.usuarioBloqueado.findMany({
            where: { id_usuario_bloqueado },
        });
    }
    async createUserBloqueado(id_usuario: number, id_usuario_bloqueado: number, requestingUserId: number) { // Added requestingUserId
        if (id_usuario !== requestingUserId) {
            throw new HttpException('You can only create blocks on your own behalf.', HttpStatus.FORBIDDEN);
        }
        // Check if the block already exists
        const existingBlock = await this.prisma.usuarioBloqueado.findUnique({
            where: {
                id_usuario_id_usuario_bloqueado: {
                    id_usuario,
                    id_usuario_bloqueado,
                },
            },
        });

        if (existingBlock) {
            throw new HttpException('User already blocked', HttpStatus.CONFLICT);
        }

        return this.prisma.usuarioBloqueado.create({
            data: {
                id_usuario,
                id_usuario_bloqueado,
            },
        });
    }
    async updateUserBloqueado(id: number, data: UpdateUserBloqueadoDto, requestingUserId: number) { // Changed signature
        const userBloqueado = await this.prisma.usuarioBloqueado.findUnique({
            where: { id },
        });
        if (!userBloqueado) {
            throw new HttpException('UserBloqueado not found', HttpStatus.NOT_FOUND);
        }
        if (userBloqueado.id_usuario !== requestingUserId) {
            throw new HttpException('You do not have permission to update this block.', HttpStatus.FORBIDDEN);
        }
        // Ensure id_usuario is not changed if present in data
        if (data.id_usuario_bloqueado !== undefined && userBloqueado.id_usuario_bloqueado === data.id_usuario_bloqueado) {
             throw new HttpException('Cannot update to the same blocked user ID.', HttpStatus.BAD_REQUEST);
        }
        return this.prisma.usuarioBloqueado.update({
            where: { id },
            data: {
                id_usuario_bloqueado: data.id_usuario_bloqueado,
                // id_usuario should not be updated via this endpoint by a non-admin
            },
        });
    }
    
    async deleteUserBloqueado(id: number, requestingUserId: number) { // Changed signature
        const userBloqueado = await this.prisma.usuarioBloqueado.findUnique({
            where: { id },
        });
        if (!userBloqueado) {
            throw new HttpException('UserBloqueado not found', HttpStatus.NOT_FOUND);
        }
        if (userBloqueado.id_usuario !== requestingUserId) {
            throw new HttpException('You do not have permission to delete this block.', HttpStatus.FORBIDDEN);
        }
        return this.prisma.usuarioBloqueado.delete({
            where: { id },
        });
    }

    async blockUser(id_usuario: number, id_usuario_bloqueado: number, requestingUserId: number) { // Added requestingUserId
        if (id_usuario !== requestingUserId) {
            throw new HttpException('You can only block users on your own behalf.', HttpStatus.FORBIDDEN);
        }
        // Check if the block already exists
        const existingBlock = await this.prisma.usuarioBloqueado.findUnique({
            where: {
                id_usuario_id_usuario_bloqueado: {
                    id_usuario,
                    id_usuario_bloqueado,
                },
            },
        });

        if (existingBlock) {
            throw new HttpException('User already blocked', HttpStatus.CONFLICT);
        }

        return this.prisma.usuarioBloqueado.create({
            data: {
                id_usuario,
                id_usuario_bloqueado,
            },
        });
    }

    async unblockUser(id_usuario: number, id_usuario_bloqueado: number, requestingUserId: number) { // Added requestingUserId
        if (id_usuario !== requestingUserId) {
            throw new HttpException('You can only unblock users on your own behalf.', HttpStatus.FORBIDDEN);
        }
        const userBloqueado = await this.prisma.usuarioBloqueado.findUnique({
            where: {
                id_usuario_id_usuario_bloqueado: {
                    id_usuario,
                    id_usuario_bloqueado,
                },
            },
        });

        if (!userBloqueado) {
            throw new HttpException('User block not found', HttpStatus.NOT_FOUND);
        }

        return this.prisma.usuarioBloqueado.delete({
            where: {
                id_usuario_id_usuario_bloqueado: {
                    id_usuario,
                    id_usuario_bloqueado,
                },
            },
        });
    }
}