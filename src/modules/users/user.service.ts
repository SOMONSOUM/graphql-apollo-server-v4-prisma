import { PrismaClient, User } from '@prisma/client';
import { UserPayload } from '~/modules/auth/auth.schema';

export class UserService {
  static async createUser(
    prisma: PrismaClient,
    user: UserPayload,
  ): Promise<User> {
    const newUser = await prisma.user.create({
      data: {
        ...user,
      } as User,
    });
    return newUser;
  }

  static async updateUser(prisma: PrismaClient, id: number, user: User) {
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
      },
    });
    return updatedUser;
  }

  static async updateUserToken(prisma: PrismaClient, id: number, user: User) {
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        token: user.token,
        lastLogin: user.lastLogin,
      },
    });
    return updatedUser;
  }

  static async getUserByPhone(prisma: PrismaClient, phoneNumber: string) {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        phoneNumber,
      },
    });
    return user;
  }

  static async getUserById(prisma: PrismaClient, id: number): Promise<User> {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        token: true,
        avatar: true,
        lastLogin: true,
        dateJoined: true,
      },
    });
    return user as any;
  }

  static async getUsers(prisma: PrismaClient): Promise<User[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        email: true,
        avatar: true,
        lastLogin: true,
      },
    });
    return users as any;
  }
}
