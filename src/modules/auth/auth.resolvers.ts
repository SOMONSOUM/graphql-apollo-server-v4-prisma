import {
  loginHandler,
  logoutHandler,
  registerUserHandler,
  verifyTokenHandler,
} from '~/modules/auth/auth.handlers';

export const authResolvers = {
  Mutation: {
    registerUser: registerUserHandler,
    loginUser: loginHandler,
    verifyToken: verifyTokenHandler,
    logout: logoutHandler,
  },
};
