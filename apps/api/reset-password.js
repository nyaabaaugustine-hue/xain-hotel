const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('Generated hash:', hash);
  
  // Verify the hash works before saving
  const valid = await bcrypt.compare(password, hash);
  console.log('Hash verification:', valid);
  
  const user = await prisma.user.update({
    where: { email: 'admin@xainhotel.com' },
    data: { password: hash },
  });

  console.log('✅ Password updated for:', user.email);
  
  // Double check by reading back
  const saved = await prisma.user.findUnique({ where: { email: 'admin@xainhotel.com' } });
  const check = await bcrypt.compare(password, saved.password);
  console.log('Final verification:', check);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
