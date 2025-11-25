
import { IsInt, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateMensagemDto {
  @IsString()
  @IsOptional()
  conteudo?: string;

  @IsString()
  tipo: string;

  @IsInt()
  id_conversa: number;

  @IsInt()
  @IsOptional()
  respondendo_a?: number;
}

export class UpdateMensagemDto {
  @IsString()
  @IsOptional()
  conteudo?: string;

  @IsString()
  @IsOptional()
  tipo?: string;

  @IsBoolean()
  @IsOptional()
  lida?: boolean;

  @IsInt()
  @IsOptional()
  respondendo_a?: number;

  @IsString()
  @IsOptional()
  iv?: string;
}
