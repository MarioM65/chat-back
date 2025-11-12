import { Module } from '@nestjs/common';
import { UsersController } from 'src/controllers/users/users.controller';
import { UserService } from 'src/services/user/user.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    providers: [UserService],
    controllers: [UsersController],
    exports: [UserService],
})
export class UserModule {}
