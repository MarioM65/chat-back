
  export class CreateUser {
    nome_usuario: string;
    foto_perfil?: string;
    telefone?: string;
    email: string;
    status: string;
    senha: string;
}
export class UpdateUser {
    nome_usuario?: string;
    foto_perfil?: string;
    telefone?: string;
    email?: string;
    status?: string;
    senha?: string;
    atualizado_em?: Date;
    deletado_em?: Date;
}