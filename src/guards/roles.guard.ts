import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TipoParticipante } from 'generated/prisma';
import { ParticipanteConversaService } from 'src/services/participante_conversa/participante_conversa.service';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private participanteConversaService: ParticipanteConversaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<TipoParticipante[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    let conversaId: number;

    // Extract conversaId from params, body, or query
    if (request.params.id_conversa) {
      conversaId = Number(request.params.id_conversa);
    } else if (request.body.id_conversa) {
      conversaId = request.body.id_conversa;
    } else if (request.params.id) { // fallback for generic id
        conversaId = Number(request.params.id)
    }
    else {
      // If no id_conversa is found, deny access
      return false;
    }
    
    const participante = await this.participanteConversaService.findParticipant(user.sub, conversaId);

    if (!participante) {
      return false;
    }

    return requiredRoles.some((role) => participante.tipo_participante === role);
  }
}
