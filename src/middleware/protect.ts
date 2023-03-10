import { UNAUTHENTICATED, UNAUTHORIZED } from '~/errors';
import { ERROR_MESSAGES } from '~/errors/errorMessages';
import { Args, Context, Info, Parent, ResolverHandler } from '~/types';

type ResolverMiddleware = (next: ResolverHandler<any>) => any;

export const protect: ResolverMiddleware = (next) => {
  return (parent: Parent, args: Args<{}>, context: Context, info: Info) => {
    if (!context.user) {
      throw new UNAUTHENTICATED(ERROR_MESSAGES.UNAUTHENTICATED);
    }
    const authHeader = context.req.headers.authorization;
    if (!authHeader) {
      throw new UNAUTHENTICATED(ERROR_MESSAGES.UNAUTHENTICATED);
    }
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      throw new UNAUTHENTICATED(ERROR_MESSAGES.UNAUTHENTICATED);
    }

    if (context.user.token !== token) {
      throw new UNAUTHORIZED(ERROR_MESSAGES.UNAUTHORIZED);
    }
    return next(parent, args, context, info);
  };
};
