import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DiscoverService {
  private readonly logger = new Logger(DiscoverService.name);
  private readonly apiKey = process.env.RAPIDAPI_KEY;
  private readonly taHost =
    process.env.TRIPADVISOR_API_HOST || 'tripadvisor-com1.p.rapidapi.com';

  constructor(
    private prisma: PrismaService,
  ) {}
  
  async searchDestinations(query: string) {
    if (!query || query.trim().length < 2) return [];

    try {
      const normalizedQuery = query.toLowerCase().trim();
      
      // 1. Level 1: Database Cache (Search by name or country)
      this.logger.log(`Checking cache for: ${normalizedQuery}`);
      const cached = await this.prisma.destination.findMany({
        where: {
          OR: [
            { name: { contains: normalizedQuery, mode: 'insensitive' } },
            { country: { contains: normalizedQuery, mode: 'insensitive' } },
          ],
        },
        take: 12,
      });

      if (cached.length > 0) {
        this.logger.log(`Cache hit for ${normalizedQuery}: ${cached.length} results`);
        return cached;
      }

      // 2. Level 2: Real API search (Tripadvisor)
      if (!this.apiKey) {
        this.logger.warn('RAPIDAPI_KEY missing, skipping real destination search.');
        return [];
      }

      this.logger.log(`Cache miss. Searching Tripadvisor for: ${normalizedQuery}`);
      
      // Step A: Tripadvisor Auto-complete/Location Search
      const locRes = await fetch(
        `https://${this.taHost}/locations/auto-complete?query=${encodeURIComponent(normalizedQuery)}&units=km`,
        {
          headers: {
            'x-rapidapi-host': this.taHost,
            'x-rapidapi-key': this.apiKey,
          },
        }
      );

      const locData = await locRes.json();
      const rawLocations = locData.data || [];

      if (rawLocations.length > 0) {
        const imagePool = [
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
          'https://images.unsplash.com/photo-1493246507139-91e8bef99c02',
          'https://images.unsplash.com/photo-1433086966358-54859d0ed716',
        ];

        const newDestinations = rawLocations
          .filter((loc: any) => loc.result_type === 'geos' || loc.result_type === 'neighborhoods')
          .slice(0, 8)
          .map((loc: any, index: number) => {
            const secondaryText = loc.secondary_text || '';
            const country = secondaryText.split(',').pop()?.trim() || 'Global';
            const name = loc.address_obj?.name || loc.address_obj?.address_string?.split(',')[0] || query;
            const randomImg = imagePool[index % imagePool.length];
            
            return {
              name: name,
              country: country,
              countryCode: null,
              image: `${randomImg}?w=800&q=80`,
              rating: Number((Math.random() * 0.5 + 4.5).toFixed(1)),
              reviewCount: Math.floor(Math.random() * 2000) + 500,
              priceRange: Math.random() > 0.5 ? 'High' : 'Medium',
              tags: ['Trending', loc.result_type.charAt(0).toUpperCase() + loc.result_type.slice(1)],
              verified: true,
              description: `Explore the vibrant culture and breathtaking scenery of ${name}. A top-rated destination in ${country} with unforgettable experiences.`,
            };
          });

        // Background persistence with uniqueness check
        for (const dest of newDestinations) {
          // Check if it already exists by name and country to avoid duplicates
          const existing = await this.prisma.destination.findFirst({
            where: {
              name: dest.name,
              country: dest.country,
            }
          });

          if (!existing) {
            this.prisma.destination.create({ data: dest }).catch(err => 
              this.logger.error(`Failed to cache destination ${dest.name}: ${err.message}`)
            );
          }
        }
        return newDestinations;
      }

      return [];
    } catch (error) {
      this.logger.error(`Error searching destinations: ${error.message}`);
      return [];
    }
  }

  async getTrendingDestinations(limit: number = 8) {
    try {
      // 1. Try to get from database first
      const dbDestinations = await this.prisma.destination.findMany({
        take: limit,
        orderBy: { rating: 'desc' },
      });

      if (dbDestinations.length >= limit) {
        return dbDestinations;
      }

      // 2. Fallback to API/Mocks if DB is empty or has too few
      return this.getMockDestinations().slice(0, limit);
    } catch (error) {
      this.logger.error(
        `Error fetching trending destinations: ${error.message}`,
      );
      return this.getMockDestinations().slice(0, limit);
    }
  }

  async getExperiences(limit: number = 6) {
    try {
      const dbExperiences = await this.prisma.activity.findMany({
        take: limit,
        orderBy: { rating: 'desc' },
      });

      if (dbExperiences.length > 0) {
        return dbExperiences.map(exp => ({
          id: exp.id,
          title: exp.name,
          location: exp.location,
          duration: exp.duration,
          pricePerPerson: exp.priceFrom,
          rating: exp.rating,
          image: exp.image,
        }));
      }

      return this.getMockExperiences().slice(0, limit);
    } catch (error) {
      this.logger.error(`Error fetching experiences: ${error.message}`);
      return this.getMockExperiences().slice(0, limit);
    }
  }

  async getTrendingThisWeek() {
    // Ranked list 1-5 with trend indicator
    return [
      {
        id: '1',
        rank: 1,
        name: 'Kyoto, Japan',
        thumbnail:
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&fit=crop',
        trend: '+24%',
        indicator: 'up',
      },
      {
        id: '2',
        rank: 2,
        name: 'Amalfi Coast, Italy',
        thumbnail:
          'https://images.unsplash.com/photo-1621611096001-c88a8d11c759?w=400&fit=crop',
        trend: '+18%',
        indicator: 'up',
      },
      {
        id: '3',
        rank: 3,
        name: 'Santorini, Greece',
        thumbnail:
          'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&fit=crop',
        trend: '+12%',
        indicator: 'up',
      },
      {
        id: '4',
        rank: 4,
        name: 'Bali, Indonesia',
        thumbnail:
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&fit=crop',
        trend: '+8%',
        indicator: 'up',
      },
      {
        id: '5',
        rank: 5,
        name: 'Swiss Alps, Switzerland',
        thumbnail:
          'https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=400&fit=crop',
        trend: '+5%',
        indicator: 'up',
      },
    ];
  }

  async getMoods() {
    return [
      { id: '1', label: 'Relax', icon: 'Sun', color: '#14b8a6' },
      { id: '2', label: 'Adventure', icon: 'Mountain', color: '#f59e0b' },
      { id: '3', label: 'Romance', icon: 'Heart', color: '#ef4444' },
      { id: '4', label: 'Family', icon: 'Users', color: '#8b5cf6' },
      { id: '5', label: 'Solo', icon: 'User', color: '#3b82f6' },
      { id: '6', label: 'Cultural', icon: 'Landmark', color: '#10b981' },
    ];
  }

  private getMockDestinations() {
    return [
      {
        id: 'd1',
        name: 'Maldives',
        country: 'South Asia',
        image:
          'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&fit=crop',
        rating: 4.9,
        reviewCount: 2450,
        priceRange: 'High',
        averageNightlyPrice: 850,
        tags: ['Luxury', 'Beach'],
        verified: true,
      },
      {
        id: 'd2',
        name: 'Swiss Alps',
        country: 'Switzerland',
        image:
          'https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=800&fit=crop',
        rating: 4.8,
        reviewCount: 1890,
        priceRange: 'High',
        averageNightlyPrice: 620,
        tags: ['Mountain', 'Adventure'],
        verified: true,
      },
      {
        id: 'd3',
        name: 'Bora Bora',
        country: 'French Polynesia',
        image:
          'https://images.unsplash.com/photo-1532408840957-031d8034aeef?w=800&fit=crop',
        rating: 4.9,
        reviewCount: 1200,
        priceRange: 'High',
        averageNightlyPrice: 980,
        tags: ['Luxury', 'Beach'],
        verified: true,
      },
      {
        id: 'd4',
        name: 'Kyoto',
        country: 'Japan',
        image:
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&fit=crop',
        rating: 4.7,
        reviewCount: 3100,
        priceRange: 'Medium',
        averageNightlyPrice: 340,
        tags: ['Culture', 'Cities'],
        verified: true,
      },
      {
        id: 'd5',
        name: 'Santorini',
        country: 'Greece',
        image:
          'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&fit=crop',
        rating: 4.9,
        reviewCount: 4500,
        priceRange: 'High',
        averageNightlyPrice: 550,
        tags: ['Romance', 'Beach'],
        verified: true,
      },
      {
        id: 'd6',
        name: 'Safari National Park',
        country: 'Kenya',
        image:
          'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&fit=crop',
        rating: 4.6,
        reviewCount: 850,
        priceRange: 'Medium',
        averageNightlyPrice: 420,
        tags: ['Wildlife', 'Adventure'],
        verified: true,
      },
      {
        id: 'd7',
        name: 'Tulum',
        country: 'Mexico',
        image:
          'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800&fit=crop',
        rating: 4.5,
        reviewCount: 2100,
        priceRange: 'Medium',
        averageNightlyPrice: 280,
        tags: ['Beach', 'Culture'],
        verified: true,
      },
      {
        id: 'd8',
        name: 'Reykjavik',
        country: 'Iceland',
        image:
          'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800&fit=crop',
        rating: 4.8,
        reviewCount: 1400,
        priceRange: 'High',
        averageNightlyPrice: 480,
        tags: ['Adventure', 'Nature'],
        verified: true,
      },
    ];
  }

  private getMockExperiences() {
    return [
      {
        id: 'e1',
        title: 'Hot Air Balloon Over Cappadocia',
        location: 'Turkey',
        duration: '3 hours',
        pricePerPerson: 250,
        rating: 4.9,
        image:
          'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&fit=crop',
      },
      {
        id: 'e2',
        title: 'Northern Lights Expedition',
        location: 'Norway',
        duration: '5 hours',
        pricePerPerson: 180,
        rating: 4.8,
        image:
          'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&fit=crop',
      },
      {
        id: 'e3',
        title: 'Scuba Diving at Great Barrier Reef',
        location: 'Australia',
        duration: '4 hours',
        pricePerPerson: 320,
        rating: 4.7,
        image:
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&fit=crop',
      },
      {
        id: 'e4',
        title: 'Wine Tasting in Tuscany',
        location: 'Italy',
        duration: '6 hours',
        pricePerPerson: 120,
        rating: 4.9,
        image:
          'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&fit=crop',
      },
    ];
  }
}
