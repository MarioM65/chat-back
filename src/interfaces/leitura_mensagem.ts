export class CreateLeituraMensagem {
  id_mensagem: number;
  id_usuario: number;
  data_hora_leitura: Date;
}

export class UpdateLeituraMensagem {
  id_mensagem?: number;
  id_usuario?: number;
  data_hora_leitura?: Date;
}
