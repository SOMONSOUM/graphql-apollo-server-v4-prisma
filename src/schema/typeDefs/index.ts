import { authTypeDefs } from '~/modules/auth/auth.types';
import { userTypeDefs } from '~/modules/users/user.types';

const rootTypeDefs = `#graphql
  type Ok {
    ok: Boolean
  }
`;

export const typeDefs = [rootTypeDefs, userTypeDefs, authTypeDefs];
