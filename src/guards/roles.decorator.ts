import { SetMetadata } from '@nestjs/common';
import { TipoParticipante } from 'generated/prisma';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: TipoParticipante[]) => SetMetadata(ROLES_KEY, roles);
