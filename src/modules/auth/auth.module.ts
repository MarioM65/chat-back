import { Global, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/services/auth/auth.service';
import { AuthController } from 'src/controllers/auth/auth.controller';
import { UserService } from 'src/services/user/user.service';
import { AuthMiddleware } from 'src/midlewares/auth';

@Global()
@Module({
    imports: [
        UserModule,
        JwtModule.register({
            global: true,
            secret: process.env.jwtSecret || 'defaultSecret',
            signOptions: { expiresIn: '1h' },
        })
    ],
    providers: [AuthService,
        {
            provide: 'APP_GUARD',
            useClass: AuthMiddleware,
        }
    ],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
