import { protect } from '~/middleware/protect';
import { pubsub } from '~/lib/pubsub';
import {
  inviteUserHandler,
  meHandler,
  updateUserHandler,
  userHandler,
} from './user.handlers';

export const userResolvers = {
  Query: {
    me: protect(meHandler),
    user: protect(userHandler),
  },

  Mutation: {
    updateUser: updateUserHandler,
    userInvite: inviteUserHandler,
  },

  Subscription: {
    userInvite: {
      subscribe: () => pubsub.asyncIterator(['USER_INVITE']),
    },
  },
};
