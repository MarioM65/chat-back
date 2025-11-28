
import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nome_usuario?: string;

  @IsString()
  @IsOptional()
  foto_perfil?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  senha?: string;
}

export class UpdateUserStatusDto extends PartialType(UpdateUserDto) {
  @IsString()
  status?: string;
}
