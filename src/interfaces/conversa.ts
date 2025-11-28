import { TipoParticipante } from 'generated/prisma';

export class CreateConversa {
  id_usuarios?: number[]
  tipo_conversa: string;
  nome_conversa: string;
  foto_conversa?: string;
  participantes?: {
    id_usuario: number;
    papel?: TipoParticipante;
  }[];
}

export class UpdateConversa {
  tipo_conversa?: string;
  nome_conversa?: string;
  foto_conversa?: string;
}