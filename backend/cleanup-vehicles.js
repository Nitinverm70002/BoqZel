require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clean() {
  await prisma.vehicle.deleteMany();
  console.log('Vehicles cleared');
}
clean();
