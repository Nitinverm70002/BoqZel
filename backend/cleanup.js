const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

const verifiedUnsplashIds = [
  "1566073771259-6a8506099945", 
  "1522708323590-d24dbb6b0267", 
  "1493246507139-91e8fad9978e", 
  "1510798831971-661eb04b3739", 
  "1563911302283-d2bc129e7570"  
];

async function fixBrokenImages() {
  const stays = await prisma.stay.findMany();
  
  for (const stay of stays) {
    if (stay.image.includes('loremflickr.com')) { 
      const randomImageId = verifiedUnsplashIds[Math.floor(Math.random() * verifiedUnsplashIds.length)];
      const newImage = `https://images.unsplash.com/photo-${randomImageId}?w=800&fit=crop`;
      
      await prisma.stay.update({
        where: { id: stay.id },
        data: { image: newImage }
      });
      console.log(`Updated cat statue image for ${stay.name}`);
    }
  }
  console.log("Cleanup complete!");
}

fixBrokenImages()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
