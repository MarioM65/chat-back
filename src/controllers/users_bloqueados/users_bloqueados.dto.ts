
import { IsInt, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserBloqueadoDto {
  @IsInt()
  id_usuario_bloqueado: number;
}

export class UpdateUserBloqueadoDto {
  @IsInt()
  @IsOptional()
  id_usuario_bloqueado?: number;
}
