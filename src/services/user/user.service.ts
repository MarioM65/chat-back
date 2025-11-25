import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUser, UpdateUser } from 'src/interfaces/user';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { hashPassword } from 'src/helpers/hash';

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
        const user = await this.prisma.usuario.findUnique({
            where: { id, deletado_em: null },
            include: {
                usuariosBloqueados: true,
            },
        });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }
    async createUser(data: CreateUser) {
        const existingUser = await this.prisma.usuario.findFirst({ where: { email: data.email } });
        if (existingUser) {
            throw new HttpException('User with this email already exists', HttpStatus.CONFLICT);
        }
        if (data.senha) {
            data.senha = await hashPassword(data.senha);
        }
        return this.prisma.usuario.create({
            data,
            include: {
                usuariosBloqueados: true,
            },
        });
    }
    async updateUser(id: number, data: UpdateUser) {
        const user = await this.prisma.usuario.findUnique({ where: { id } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        if (data.email && data.email !== user.email) {
            const existingUser = await this.prisma.usuario.findFirst({ where: { email: data.email } });
            if (existingUser) {
                throw new HttpException('User with this email already exists', HttpStatus.CONFLICT);
            }
        }
        if (data.senha) {
            data.senha = await hashPassword(data.senha);
        }
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
        const user = await this.prisma.usuario.findUnique({ where: { id } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return this.prisma.usuario.update({
            where: { id },
            data: { deletado_em: null },
        });
    }
    async deleteUser(id: number) {
        const user = await this.prisma.usuario.findUnique({ where: { id } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return this.prisma.usuario.update({
            where: { id },
            data: { deletado_em: new Date() },
        });
    }
    async purgeUser(id: number) {
        const user = await this.prisma.usuario.findUnique({ where: { id } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
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
