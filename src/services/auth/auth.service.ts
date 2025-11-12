import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { comparePassword } from 'src/helpers/hash';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor( private userService:UserService, private jwtService:JwtService) {}
    async login(email: string, senha: string) {
        const user = await this.userService.getUserByEmail(email);
        if(!user) {
            throw new UnauthorizedException('Esse email nao esta cadastrado');
        }
        const isMatch= await comparePassword(senha, user.senha);
        if(!isMatch) {
            throw new UnauthorizedException('Senha incorreta');
        }
        const payload = { sub: user.id, email: user.email , name: user.nome_usuario};
        return {
            access_token: await this.jwtService.signAsync(payload),
            user,
        };
    }
}
