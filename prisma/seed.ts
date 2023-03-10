import { PrismaClient } from '@prisma/client';
import bycript from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.create({
    data: {
      email: 'sok.dara@godital.com',
      name: 'Sok Dara',
      password: bycript.hashSync('Godital@168', 10),
      phoneNumber: '099965943',
      avatar:
        'https://www.pngarts.com/files/10/Default-Profile-Picture-Transparent-Images.png',
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
