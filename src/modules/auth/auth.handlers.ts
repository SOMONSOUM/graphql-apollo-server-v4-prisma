import { User } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { ZodError } from 'zod';
import { UNAUTHENTICATED } from '~/errors';
import { ERROR_MESSAGES } from '~/errors/errorMessages';
import { ResolverHandler, Args, OK } from '~/types';
import { UserService } from '~/modules/users/user.service';
import { decodeToken, verifyToken } from '~/utils/tokens';
import {
  UserLoginPayload,
  UserLoginSchema,
  UserPayload,
  UserSchema,
} from '~/modules/auth/auth.schema';
import { comparePassword, hashPassword } from '~/utils/passwordHash';
import { createToken } from '~/utils/tokens';
import { formatZodError } from '~/utils/formatZodError';

export const registerUserHandler: ResolverHandler<Promise<OK>> = async (
  _: any,
  args: Args<UserPayload>,
  { prisma },
) => {
  try {
    await UserSchema.parseAsync(args.input);
    args.input.password = await hashPassword(args.input.password);

    await UserService.createUser(prisma, args.input);
    return { ok: true };
  } catch (error: any) {
    if (error instanceof PrismaClientValidationError) {
      throw new Error(error as any);
    }
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('User already exists');
      }
    }
    if (error instanceof ZodError) {
      let message = formatZodError(error);
      throw new Error(message);
    }
    throw error;
  }
};

export const loginHandler: ResolverHandler<Promise<User>> = async (
  _,
  args: Args<UserLoginPayload>,
  cxt,
) => {
  try {
    await UserLoginSchema.parseAsync(args.input);
    const user = await UserService.getUserByPhone(
      cxt.prisma,
      args.input.phoneNumber,
    );

    if (await comparePassword(args.input.password, user.password)) {
      const token = await createToken(user.id);
      user.lastLogin = new Date();
      user.token = token;
      await UserService.updateUserToken(cxt.prisma, user.id, user);
      cxt.user = user;
      return { ...user, token };
    }
    throw new UNAUTHENTICATED(ERROR_MESSAGES.UNAUTHENTICATED);
  } catch (error: any) {
    if (error instanceof ZodError) {
      let message = formatZodError(error);
      throw new Error(message);
    }
    if (error instanceof PrismaClientValidationError) {
      throw new Error(error as any);
    }
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new UNAUTHENTICATED(ERROR_MESSAGES.UNAUTHENTICATED);
      }
    }
    if (error.message === 'No User found') {
      throw new UNAUTHENTICATED(ERROR_MESSAGES.UNAUTHENTICATED);
    }

    throw error;
  }
};

export const verifyTokenHandler: ResolverHandler<Promise<User>> = async (
  __,
  _args,
  { req, prisma },
) => {
  const authHeader = req.headers.authorization;
  const inputToken = _args.input.token;

  try {
    if (!inputToken && !authHeader) {
      throw new UNAUTHENTICATED(ERROR_MESSAGES.UNAUTHENTICATED);
    }
    const token = authHeader?.split(' ')[1];
    if (!token && !inputToken) {
      throw new UNAUTHENTICATED(ERROR_MESSAGES.UNAUTHENTICATED);
    }
    const { uid } = await verifyToken(token || inputToken);
    const user = await UserService.getUserById(prisma, uid);
    return user;
  } catch (error: any) {
    throw new UNAUTHENTICATED(error.message);
  }
};

export const logoutHandler: ResolverHandler<Promise<OK>> = async (
  __,
  _,
  ctx,
) => {
  try {
    const authHeader = ctx.req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const { uid } = decodeToken(token);
        const user = await UserService.getUserById(ctx.prisma, uid);
        user.token = null;
        await UserService.updateUserToken(ctx.prisma, user.id, user);
      }
    }
    ctx.user = null;
    return { ok: true };
  } catch (error) {
    return { ok: false };
  }
};
