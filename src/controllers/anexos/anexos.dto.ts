
import { IsInt, IsString, IsOptional, IsDate } from 'class-validator';

export class CreateAnexoDto {
  @IsInt()
  id_mensagem: number;

  @IsString()
  nome_arquivo: string;

  @IsString()
  caminho_arquivo: string;

  @IsString()
  tipo: string;

  @IsInt()
  tamanho: number;
}

export class UpdateAnexoDto {
  @IsString()
  @IsOptional()
  nome_arquivo?: string;

  @IsString()
  @IsOptional()
  caminho_arquivo?: string;

  @IsString()
  @IsOptional()
  tipo?: string;

  @IsInt()
  @IsOptional()
  tamanho?: number;

  @IsDate()
  @IsOptional()
  atualizado_em?: Date;
}
