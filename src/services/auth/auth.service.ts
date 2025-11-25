import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { comparePassword } from 'src/helpers/hash';
import { JwtService } from '@nestjs/jwt';
import { CreateUser } from 'src/interfaces/user';

@Injectable()
export class AuthService {
    constructor( private userService:UserService, private jwtService:JwtService) {}
    async login(email: string, senha: string) {
        const user = await this.userService.getUserByEmail(email);
        if(!user) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        const isMatch= await comparePassword(senha, user.senha);
        if(!isMatch) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        const payload = { sub: user.id, email: user.email , name: user.nome_usuario};
        return {
            access_token: await this.jwtService.signAsync(payload),
            user,
        };
    }
    async register(data:CreateUser){
        const user= await this.userService.createUser(data)
        const payload= {sub:user.id, email:user.email, name:user.nome_usuario
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user
        };
    }
}
