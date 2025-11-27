export class CreateLeituraMensagem {
  id_mensagem: number;
  data_hora_leitura: Date;
}

export class UpdateLeituraMensagem {
  id_mensagem?: number;
  data_hora_leitura?: Date;
}
