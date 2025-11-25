
import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateParticipanteConversaDto {
  @IsInt()
  id_conversa: number;

  @IsInt()
  id_usuario: number;

  @IsString()
  tipo_participante: string;
}

export class UpdateParticipanteConversaDto {
  @IsInt()
  @IsOptional()
  id_conversa?: number;

  @IsInt()
  @IsOptional()
  id_usuario?: number;

  @IsString()
  @IsOptional()
  tipo_participante?: string;
}
