export class CreateConversa {
  id_usuarios?: number[]
  tipo_conversa: string;
  nome_conversa: string;
  foto_conversa?: string;
}

export class UpdateConversa {
  tipo_conversa?: string;
  nome_conversa?: string;
  foto_conversa?: string;
}