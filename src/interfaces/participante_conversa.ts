export class CreateParticipanteConversa {
  id_conversa: number;
  id_usuario: number;
  tipo_participante: string;
}

export class UpdateParticipanteConversa {
  id_conversa?: number;
  id_usuario?: number;
  tipo_participante?: string;
}