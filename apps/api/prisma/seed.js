const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@xainhotel.com' },
    update: {},
    create: {
      fullname: 'Admin User',
      email: 'admin@xainhotel.com',
      password,
      isAdmin: 1,
      userLevel: 1,
      status: 1,
    },
  });

  console.log('✅ Admin user created:', user.email);
  console.log('   Password: admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
