import '@fastify/jwt';
import type { AuthenticatedUser } from '@talent-lab/contracts';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: AuthenticatedUser;
    user: AuthenticatedUser;
  }
}
