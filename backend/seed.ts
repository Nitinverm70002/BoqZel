import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

const stays = [
  {
    id: 'luxury-apt-juba',
    name: 'Equatoria Luxury Suites',
    type: 'apartment',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    rating: 4.8,
    reviewCount: 234,
    pricePerNight: 120,
    currency: 'USD',
    location: 'Juba, South Sudan',
    amenities: ['WiFi', 'Pool', 'Kitchen', 'AC', 'Parking', 'Security'],
    verified: true,
    description: 'Experience modern luxury in the heart of Juba. These high-end suites offer breathtaking city views, contemporary design, and top-tier amenities for the discerning traveler.',
  },
  {
    id: 'safari-lodge-nimule',
    name: 'Boma Horizon Safari Lodge',
    type: 'resort',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=600&fit=crop',
    rating: 4.9,
    reviewCount: 189,
    pricePerNight: 250,
    currency: 'USD',
    location: 'Nimule, South Sudan',
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Game Drives', 'Spa', 'Safari Bar'],
    verified: true,
    description: 'Nestled on the edge of Nimule National Park, our lodge provides an immersive safari experience. Wake up to the sounds of nature and enjoy guided wildlife tours daily.',
  },
  {
    id: 'river-hotel-juba',
    name: 'The Grand Nile Palace',
    type: 'hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    rating: 4.7,
    reviewCount: 312,
    pricePerNight: 165,
    currency: 'USD',
    location: 'Juba, South Sudan',
    amenities: ['WiFi', 'Restaurant', 'AC', 'River View', 'Bar', 'Gym', 'Conference Rooms'],
    verified: true,
    description: 'An iconic landmark in Juba, The Grand Nile Palace combines colonial elegance with modern luxury. Enjoy dining with spectacular views of the White Nile.',
  },
  {
    id: 'zanzibar-beach-villa',
    name: 'Azure Breeze Villa Resort',
    type: 'villa',
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop',
    rating: 4.9,
    reviewCount: 567,
    pricePerNight: 450,
    currency: 'USD',
    location: 'Matemwe, Zanzibar',
    amenities: ['WiFi', 'Private Beach', 'Infinity Pool', 'Private Chef', 'Spa', 'Butler Service'],
    verified: true,
    description: 'A secluded sanctuary on Zanzibar’s pristine north-east coast. This luxury villa offers ultimate privacy, direct beach access, and personalized service.',
  },
  {
    id: 'kigali-serenity-suites',
    name: 'Kigali Serenity Suites',
    type: 'apartment',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    rating: 4.9,
    reviewCount: 124,
    pricePerNight: 180,
    currency: 'USD',
    location: 'Kigali, Rwanda',
    amenities: ['WiFi', 'Tech Gym', 'Smart Home', 'AC', 'Kitchenette', 'Secured Parking'],
    verified: true,
    description: 'Chic, high-tech apartments designed for business travelers and digital nomads. Located in Kigali’s most vibrant neighborhood.',
  },
  {
    id: 'serengeti-safari-camp',
    name: 'Mara Sky Luxury Camp',
    type: 'resort',
    image: 'https://images.unsplash.com/photo-1533619239233-6280475a633a?w=800&h=600&fit=crop',
    rating: 5.0,
    reviewCount: 88,
    pricePerNight: 550,
    currency: 'USD',
    location: 'Serengeti, Tanzania',
    amenities: ['Private Safari', 'Stargazing Deck', 'All-Inclusive', 'Eco-Logic', 'Outdoor Shower'],
    verified: true,
    description: 'Experience the magic of the Serengeti from our luxury tents. Sustainable luxury that places you in the path of the Great Migration.',
  }
];

async function main() {
  console.log('Starting seed...');
  for (const stay of stays) {
    await prisma.stay.upsert({
      where: { id: stay.id },
      update: {},
      create: stay,
    });
  }
  console.log('Seed finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
