const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function purgeOldMockData() {
  // Delete all stays that were created by the old mock AI config (we can just wipe them all and let Booking.com repopulate cleanly)
  // To protect the original 5 hardcoded premium ones, we can just delete everything that doesn't have those IDs.
  const seeds = ['safari-lodge-nimule', 'luxury-apt-juba', 'river-hotel-juba', 'zanzibar-beach-villa', 'kigali-serenity-suites', 'serengeti-safari-camp'];
  
  const result = await prisma.stay.deleteMany({
    where: {
      id: {
        notIn: seeds
      }
    }
  });
  
  console.log(`Deleted ${result.count} old mock AI hotels. Your database is now clean!`);
}

purgeOldMockData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
