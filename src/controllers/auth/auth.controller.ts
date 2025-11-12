import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Public } from 'src/midlewares/public';
import { AuthService } from 'src/services/auth/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Public()
    @Post('login')
    @HttpCode(200)
    async login(@Body() body: { email: string; senha: string }) {
        return this.authService.login(body.email, body.senha);
    }
}
