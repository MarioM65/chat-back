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
    async createUserBloqueado(data: CreateUserBloqueadoDto) {
        return this.prisma.usuarioBloqueado.create({
            data,
        });
    }
    async updateUserBloqueado(id: number, data: UpdateUserBloqueadoDto) {
        const userBloqueado = await this.prisma.usuarioBloqueado.findUnique({
            where: { id },
        });
        if (!userBloqueado) {
            throw new HttpException('UserBloqueado not found', HttpStatus.NOT_FOUND);
        }
        return this.prisma.usuarioBloqueado.update({
            where: { id },
            data,
        });
    }
    async deleteUserBloqueado(id: number) {
        const userBloqueado = await this.prisma.usuarioBloqueado.findUnique({
            where: { id },
        });
        if (!userBloqueado) {
            throw new HttpException('UserBloqueado not found', HttpStatus.NOT_FOUND);
        }
        return this.prisma.usuarioBloqueado.delete({
            where: { id },
        });
    }

    async blockUser(id_usuario: number, id_usuario_bloqueado: number) {
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

    async unblockUser(id_usuario: number, id_usuario_bloqueado: number) {
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