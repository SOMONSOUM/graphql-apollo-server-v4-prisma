import { User } from '@prisma/client';
import { Args, ID, OK, ResolverHandler } from '~/types';
import { UserService } from '~/modules/users/user.service';
import { pubsub } from '~/lib/pubsub';

export const meHandler: ResolverHandler<Promise<User | null>> = async (
  __,
  _,
  ctx,
) => {
  return ctx.user;
};

export const userHandler: ResolverHandler<Promise<User | null>> = async (
  _,
  args: Args<{}, ID>,
  { prisma },
) => {
  const user = await UserService.getUserById(prisma, args?.id as ID);
  return user;
};

export const updateUserHandler: ResolverHandler<Promise<OK>> = async (
  _: any,
  args: Partial<Args<User, ID>>,
  { prisma },
) => {
  try {
    await UserService.updateUser(prisma, args.id!, args.input!);
    return { ok: true };
  } catch (error) {
    throw error;
  }
};

export const inviteUserHandler: ResolverHandler<Promise<OK>> = async (
  _: any,
  args: Partial<Args<User, ID>>,
) => {
  try {
    console.log(args);
    pubsub.publish('USER_INVITE', { userInvite: args.input });
    return { ok: true };
  } catch (error) {
    throw error;
  }
};
