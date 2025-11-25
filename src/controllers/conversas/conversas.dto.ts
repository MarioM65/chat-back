
import { IsString, IsOptional } from 'class-validator';

export class CreateConversaDto {

  @IsString()

  tipo_conversa: string;



  @IsString()

  @IsOptional()

  nome_conversa: string;

   @IsOptional()

  id_usuarios?: number[];



  @IsString()

  @IsOptional()

  foto_conversa?: string;

}

export class UpdateConversaDto {
  @IsString()
  @IsOptional()
  tipo_conversa?: string;

  @IsString()
  @IsOptional()
  nome_conversa?: string;

  @IsString()
  @IsOptional()
  foto_conversa?: string;
}
