import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserBloqueado, UpdateUserBloqueado } from 'src/interfaces/user_bloqueado';

@Injectable()
export class UserBloqueadoService {
constructor(private prisma: PrismaService) {}
 async getAllUserBloqueados() {
        return this.prisma.usuarioBloqueado.findMany();
    }
    async getUserBloqueadoById(id: number) {
        return this.prisma.usuarioBloqueado.findUnique({
            where: { id },
        });
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
    async createUserBloqueado(data: CreateUserBloqueado) {
        return this.prisma.usuarioBloqueado.create({
            data,
        });
    }
    async updateUserBloqueado(id: number, data: UpdateUserBloqueado) {
        return this.prisma.usuarioBloqueado.update({
            where: { id },
            data,
        });
    }
    async deleteUserBloqueado(id: number) {
        return this.prisma.usuarioBloqueado.delete({
            where: { id },
        });
    }
}