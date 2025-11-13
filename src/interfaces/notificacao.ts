export class CreateNotificacao {
  id_usuario: number;
  id_mensagem: number;
  tipo_notificacao: string;
  data_hora_criacao: Date;
  status: string;
}

export class UpdateNotificacao {
  id_usuario?: number;
  id_mensagem?: number;
  tipo_notificacao?: string;
  data_hora_criacao?: Date;
  st