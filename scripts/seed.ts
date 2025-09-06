
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tables = [
    { name: 'Table 1', seat: 4, status: false },
    { name: 'Table 2', seat: 2, status: false },
    { name: 'Table 3', seat: 6, status: false },
    { name: 'Table 4', seat: 8, status: false },
    { name: 'VIP Table', seat: 10, status: false },
  ];

  for (const data of tables) {
    await prisma.table.create({ data });
  }

  console.log('✅ Seeded tables successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
