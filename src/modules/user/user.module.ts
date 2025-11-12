import { Module } from '@nestjs/common';
import { UsersController } from 'src/controllers/users/users.controller';
import { UserService } from 'src/services/user/user.service';

@Module({
    providers: [UserService],
    controllers: [UsersController],
    exports: [UserService],
})
export class UserModule {}
