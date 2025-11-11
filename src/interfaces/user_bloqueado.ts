export class CreateUserBloqueado {
    id: number;
    id_usuario: number;
    id_usuario_bloqueado: number;
    criado_em: Date;
}
export class UpdateUserBloqueado {
    id_usuario?: number;
    id_usuario_bloqueado?: number;
    atualizado_em?: Date;
}