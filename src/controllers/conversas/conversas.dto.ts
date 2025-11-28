
import { IsString, IsOptional, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoParticipante } from 'generated/prisma'; // Assuming this path is correct

class ParticipantDto {
  @IsNumber()
  id_usuario: number;

  @IsOptional()
  @IsString() // TipoParticipante is an enum, which are strings in JS
  papel?: TipoParticipante;
}

export class CreateConversaDto {
  @IsString()
  tipo_conversa: string;

  @IsString()
  @IsOptional()
  nome_conversa: string;

  @IsOptional()
  @IsArray()
  @IsNumber({},{each:true})
  id_usuarios?: number[];

  @IsString()
  @IsOptional()
  foto_conversa?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantDto)
  participantes?: ParticipantDto[];
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
