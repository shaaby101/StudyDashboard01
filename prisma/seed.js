const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('studesh123', 10);

  const demoUsers = [
    {
      name: 'Arjun Mehta',
      email: 'student@demo.edu',
      passwordHash,
      role: 'STUDENT',
    },
    {
      name: 'Dr. Priya Sharma',
      email: 'faculty@demo.edu',
      passwordHash,
      role: 'FACULTY',
    },
    {
      name: 'Prof. Rajesh Kumar',
      email: 'admin@demo.edu',
      passwordHash,
      role: 'ADMIN',
    },
    {
      name: 'Ananya Mehta',
      email: 'parent@demo.edu',
      passwordHash,
      role: 'PARENT',
    },
  ];

  console.log('Seeding demo users...');

  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log('Seeding complete! You can now login with studesh123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
