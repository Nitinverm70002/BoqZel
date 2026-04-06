const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const v = await prisma.vehicle.findMany({ select: { name: true, image: true }});
  console.log(v);
}
run();
