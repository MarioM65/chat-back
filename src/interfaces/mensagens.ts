export class CreateMensagem {
    id_remetente: number;                 
    conteudo?: string;                    
    tipo: string; 
    id_conversa?: number;                 
    respondendo_a?: number;
    iv?: string;               
}

export class UpdateMensagem {
    conteudo?: string;
    tipo?: String;
    lida?: boolean;
    respondendo_a?: number;
    atualizado_em?: Date;
    iv: string;
}

