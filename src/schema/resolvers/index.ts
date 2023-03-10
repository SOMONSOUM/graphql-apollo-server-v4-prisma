import { userResolvers } from '~/modules/users/user.resolvers';
import { authResolvers } from '~/modules/auth/auth.resolvers';

export const resolvers = [userResolvers, authResolvers];
