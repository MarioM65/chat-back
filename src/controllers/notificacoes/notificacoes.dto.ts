
import { IsInt, IsString, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNotificacaoDto {
  @IsInt()
  id_mensagem: number;

  @IsString()
  tipo_notificacao: string;

  @IsDate()
  @Type(() => Date)
  data_hora_criacao: Date;

  @IsString()
  status: string;
}

export class UpdateNotificacaoDto {
  @IsInt()
  @IsOptional()
  id_mensagem?: number;

  @IsString()
  @IsOptional()
  tipo_notificacao?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  data_hora_criacao?: Date;

  @IsString()
  @IsOptional()
  status?: string;
}
