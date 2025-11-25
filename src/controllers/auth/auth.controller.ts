import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Public } from 'src/midlewares/public';
import { AuthService } from 'src/services/auth/auth.service';
import { LoginDto, RegisterDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Public()
    @Post('login')
    @HttpCode(200)
    async login(@Body() body: LoginDto) {
        return this.authService.login(body.email, body.senha);
    }
    @Public()
    @Post('register')
    @HttpCode(200)
    async register(@Body() data:RegisterDto){
        return this.authService.register(data);
    }
}
