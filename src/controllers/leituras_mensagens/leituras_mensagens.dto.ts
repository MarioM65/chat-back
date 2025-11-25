
import { IsInt, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLeituraMensagemDto {
  @IsInt()
  id_mensagem: number;

  @IsDate()
  @Type(() => Date)
  data_hora_leitura: Date;
}

export class UpdateLeituraMensagemDto {
  @IsInt()
  @IsOptional()
  id_mensagem?: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  data_hora_leitura?: Date;
}
