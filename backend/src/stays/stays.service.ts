import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

export interface Stay {
  id: string;
  name: string;
  type: string;
  image: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  location: string;
  amenities: string[];
  verified: boolean;
  description: string;
}

@Injectable()
export class StaysService {
  private readonly logger = new Logger(StaysService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async findAll(
    type?: string,
    query?: string,
    sortBy: string = 'rating',
  ): Promise<Stay[]> {
    const where: any = {};

    if (type && type !== 'All') {
      let normalizedType = type.toLowerCase();
      if (normalizedType.endsWith('s')) {
        normalizedType = normalizedType.slice(0, -1);
      }
      where.type = normalizedType;
    }

    if (query && query.trim().length > 0) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { rating: 'desc' };
    if (sortBy === 'priceLow') orderBy = { pricePerNight: 'asc' };
    if (sortBy === 'priceHigh') orderBy = { pricePerNight: 'desc' };
    if (sortBy === 'rating') orderBy = { rating: 'desc' };

    let results: Stay[] = [];
    try {
      results = await this.prisma.stay.findMany({
        where,
        orderBy,
      });
    } catch (error) {
      this.logger.error(`Database error: ${error.message}`);
    }

    // Level 2: Real API search if we have a specific city query and no results (Cache Miss)
    if (results.length === 0 && query && query.trim().length > 2) {
      this.logger.log(`Cache miss for stays in "${query}". Fetching from Real API (Booking.com)...`);
      const newStays = await this.fetchRealHotels(query);
      
      if (newStays && newStays.length > 0) {
        return newStays;
      }
    }

    return results;
  }

  async fetchRealHotels(city: string): Promise<any[]> {
    try {
      const apiKey = process.env.RAPIDAPI_KEY;
      if (!apiKey) {
        this.logger.warn('RAPIDAPI_KEY missing, skipping real hotel search.');
        return [];
      }

      this.logger.log(`Fetching hotels for ${city} from Booking.com...`);
      const locRes = await fetch(
        `https://booking-com.p.rapidapi.com/v1/hotels/locations?name=${encodeURIComponent(city)}&locale=en-gb`,
        {
          headers: {
            'x-rapidapi-host': 'booking-com.p.rapidapi.com',
            'x-rapidapi-key': apiKey,
          },
        },
      );

      if (locRes.status === 429) {
        this.logger.warn('RapidAPI limit reached (429).');
        return [];
      }

      const locData = await locRes.json();

      if (
        !locData ||
        !Array.isArray(locData) ||
        locData.length === 0 ||
        !locData[0].dest_id
      ) {
        this.logger.warn(`No destination ID found for ${city}`);
        return [];
      }

      const destId = locData[0].dest_id;
      const destType = locData[0].dest_type || 'city';

      // Calculate future dates (14 days from now, stay for 3 nights)
      const checkinDate = new Date();
      checkinDate.setDate(checkinDate.getDate() + 14);
      const checkinStr = checkinDate.toISOString().split('T')[0];

      const checkoutDate = new Date(checkinDate);
      checkoutDate.setDate(checkoutDate.getDate() + 3);
      const checkoutStr = checkoutDate.toISOString().split('T')[0];

      this.logger.log(`Fetching hotels for dest_id: ${destId}`);
      const searchRes = await fetch(
        `https://booking-com.p.rapidapi.com/v1/hotels/search?dest_id=${destId}&dest_type=${destType}&locale=en-gb&filter_by_currency=USD&checkin_date=${checkinStr}&checkout_date=${checkoutStr}&room_number=1&adults_number=2&order_by=popularity&page_number=0&units=metric`,
        {
          headers: {
            'x-rapidapi-host': 'booking-com.p.rapidapi.com',
            'x-rapidapi-key': apiKey,
          },
        },
      );

      if (searchRes.status === 429) {
        this.logger.warn('RapidAPI limit reached (429) during search.');
        return [];
      }

      const searchData = await searchRes.json();

      if (!searchData || !searchData.result || searchData.result.length === 0) {
        return [];
      }

      // Map top 6 real hotels
      const hotels = searchData.result.slice(0, 6).map((h: any) => ({
        name: h.hotel_name,
        type: h.accommodation_type_name
          ? h.accommodation_type_name.toLowerCase()
          : 'hotel',
        image:
          h.max_photo_url ||
          h.main_photo_url ||
          'https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?w=800&fit=crop',
        rating: h.review_score ? h.review_score / 2 : 4.5,
        reviewCount: h.review_nr || Math.floor(Math.random() * 500),
        pricePerNight: h.min_total_price
          ? Math.round(h.min_total_price / 3)
          : Math.floor(Math.random() * 300) + 100,
        currency: 'USD',
        location: `${h.city_trans || h.city || city}, ${h.country_trans || ''}`
          .trim()
          .replace(/,$/, ''),
        amenities:
          h.accommodation_type_name === 'Resort'
            ? ['Pool', 'Spa', 'Restaurant', 'WiFi']
            : ['WiFi', 'Restaurant', 'AC', 'Room Service'],
        verified: true,
        description:
          h.review_recommendation ||
          `A highly-rated ${h.accommodation_type_name || 'hotel'} situated in the heart of ${city}. Experience exceptional comfort, authentic local culture, and world-class hospitality during your stay.`,
      }));

      // Background persistence
      for (const stay of hotels) {
        this.prisma.stay.create({ data: stay }).catch(() => {});
      }

      return hotels;
    } catch (error) {
      this.logger.error(`Error fetching real hotels: ${error.message}`);
      return [];
    }
  }

  async findOne(id: string): Promise<Stay | null> {
    try {
      return await this.prisma.stay.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        `Database connection failed in findOne: ${error.message}`,
      );
      return null;
    }
  }

  // Seeding logic to move mock data to Supabase
  async seed(mockData: Stay[]) {
    try {
      for (const stay of mockData) {
        await this.prisma.stay.upsert({
          where: { id: stay.id },
          update: stay,
          create: stay,
        });
      }
    } catch (error) {
      this.logger.error(`Failed to seed stays: ${error.message}`);
    }
  }
}
