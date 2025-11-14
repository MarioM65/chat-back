export class CreateAnexo {
    id_mensagem: number;                 
    nome_arquivo: string;
    caminho_arquivo: string;
    tipo: string;
    tamanho: number;                   
}

export class UpdateAnexo {
    nome_arquivo?: string;
    caminho_arquivo?: string;
    tipo?: string;
    tamanho?: number;
    atualizado_em?: Date;
}

