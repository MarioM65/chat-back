import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Usuario } from 'generated/prisma';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UserService } from 'src/services/user/user.service';
import { RegisterDto } from '../auth/auth.dto';
import { UpdateUserDto } from './users.dto';
import { User } from 'src/common/decorators/user.decorator'; // Import User decorator

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) {}
    @Get()
    async getUsers() : Promise<Usuario[]> {
        return this.userService.getAllUsers();
    }
 @Post()
  @UseInterceptors(
    FileInterceptor('foto_perfil', {
      storage: diskStorage({
        destination: './uploads/fotos_perfil', 
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
  )
  async createUser(
    @Body() data: RegisterDto,
    @UploadedFile() foto_perfil?: Express.Multer.File,
  ): Promise<Usuario> {
    if (foto_perfil) {
      // Salva o path relativo da imagem
      data.foto_perfil = join('uploads/fotos_perfil', foto_perfil.filename);
    }

    return this.userService.createUser(data);
  }
    @Get(':id')
    async getUserById(
        @Param('id') id: string
    ) : Promise<Usuario|null> {
        return this.userService.getUserById(Number(id));
    }
    @Put() // Removed ':id' from path
    @UseInterceptors(
      FileInterceptor('foto_perfil', {
        storage: diskStorage({
          destination: './uploads/fotos_perfil', 
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const fileExt = extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
          },
        }),
      }),
    )
    async updateUser(
        @Body() data: UpdateUserDto,
        @UploadedFile() foto_perfil?: Express.Multer.File,
        @User() user: { sub: number }, // Added User decorator
    ) : Promise<Usuario> {
        if (foto_perfil) {
            data.foto_perfil = join('uploads/fotos_perfil', foto_perfil.filename);
        }
        return this.userService.updateUser(user.sub, data); // Passed user.sub
    }
    @Delete(':id')
    async deleteUser(
        @Param('id') id: string
    ) : Promise<Usuario> {
        return this.userService.deleteUser(Number(id));
    }
    @Delete('purge/:id')
    async purgeUser(
        @Param('id') id: string
    ) : Promise<Usuario> {
        return this.userService.purgeUser(Number(id));
    }
    @Get('trashed/all')
    async getTrashedUsers() : Promise<Usuario[]> {
        return this.userService.trashedUsers();
    }
    @Put('restore/:id')
    async restoreUser(
        @Param('id') id: string
    ) : Promise<Usuario> {
        return this.userService.restoreUser(Number(id));
    }
}