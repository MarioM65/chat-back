import { Injectable } from '@nestjs/common';
import { CreateUser, UpdateUser } from 'src/interfaces/user';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class UserService {
        constructor(private prisma: PrismaService) {}
    async getAllUsers() {
        //mandat tambem a relation usuariosBloqueados
        return this.prisma.usuario.findMany({
            where: { deletado_em: null },
            include: {
                usuariosBloqueados: true,
            },
        });
    }
    async getUserById(id: number) {
        //que nao forma deletados
        return this.prisma.usuario.findUnique({
            where: { id, deletado_em: null },
            include: {
                usuariosBloqueados: true,
            },
        });
    }
    async createUser(data: CreateUser) {
        return this.prisma.usuario.create({
            data,
            include: {
                usuariosBloqueados: true,
            },
        });
    }
    async updateUser(id: number, data: UpdateUser) {
        return this.prisma.usuario.update({
            where: { id },
            data,
              include: {
                usuariosBloqueados: true,
            },
        });
    }
    async trashedUsers() {
        return this.prisma.usuario.findMany({
            where: { deletado_em: { not: null } },
        });
    }
    async restoreUser(id: number) {
        return this.prisma.usuario.update({
            where: { id },
            data: { deletado_em: null },
        });
    }
    async deleteUser(id: number) {
        return this.prisma.usuario.update({
            where: { id },
            data: { deletado_em: new Date() },
        });
    }
    async purgeUser(id: number) {
        return this.prisma.usuario.delete({
            where: { id },

        });
    }
    async getUserByEmail(email: string) {
        return this.prisma.usuario.findFirst({
            where: { email },
        });
    }
    
}
