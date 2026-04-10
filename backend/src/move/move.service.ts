import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { Vehicle } from '@prisma/client';

@Injectable()
export class MoveService {
  private readonly logger = new Logger(MoveService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async findAll(location?: string): Promise<Vehicle[]> {
    const where: any = {};

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    let results: Vehicle[] = [];
    try {
      results = await this.prisma.vehicle.findMany({
        where,
      });
    } catch (error) {
      this.logger.error(
        `Database connection failed in findAll: ${error.message}`,
      );
      // If DB fails, we proceed to check if we can generate results via real API/AI
    }

    if (results.length === 0 && location && location.trim().length > 2) {
      this.logger.log(
        `Fetching real Booking API car locations for: ${location}`,
      );
      let newVehicles = await this.fetchRealCars(location);

      // Fallback
      if (!newVehicles || newVehicles.length === 0) {
        this.logger.log(
          `Booking API returned empty for ${location}. Falling back to AI Generation...`,
        );
        newVehicles = await this.aiService.generateVehicles(location);
      }

      if (newVehicles && newVehicles.length > 0) {
        // Safe verified images pool
        const safeImages = {
          suv: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80',
          van: 'https://images.unsplash.com/photo-1510168341108-16e6d19afcc9?auto=format&fit=crop&q=80',
          truck:
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80',
          luxury:
            'https://images.unsplash.com/photo-1606664515524-ed2f786a0b12?auto=format&fit=crop&q=80',
          sedan:
            'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80',
        };

        for (const v of newVehicles) {
          try {
            const vType = (v.type || 'suv').toLowerCase();
            let finalImage = v.image;
            // Unconditionally apply verified images from our pool if it's an AI hallucination
            // AI frequently hallucinates fake unsplash IDs that 404. Our pool is safe.
            if (!finalImage || finalImage.includes('unsplash.com')) {
              finalImage =
                safeImages[vType as keyof typeof safeImages] || safeImages.suv;
            }

            // Ensure vehicle has an id for the frontend
            const vehicleWithId = {
              ...v,
              id:
                v.id ||
                `ai-temp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              verified: true,
            };
            results.push(vehicleWithId as unknown as Vehicle);

            try {
              await this.prisma.vehicle.create({
                data: {
                  name: v.name,
                  type: vType,
                  image: finalImage,
                  pricePerDay: Number(v.pricePerDay) || 150,
                  currency: v.currency || 'USD',
                  location: v.location || location,
                  seats: Number(v.seats) || 5,
                  transmission: v.transmission || 'Automatic',
                  fuelType: v.fuelType || 'Petrol',
                  driverOption:
                    v.driverOption !== undefined
                      ? Boolean(v.driverOption)
                      : true,
                  verified: true,
                },
              });
            } catch (error) {
              this.logger.error(`Error saving vehicle: ${error.message}`);
            }
          } catch (error) {
            this.logger.error(`Error saving vehicle: ${error.message}`);
          }
        }
      }
    }

    return results as unknown as Vehicle[];
  }

  async fetchRealCars(city: string): Promise<any[]> {
    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
      this.logger.warn('RAPIDAPI_KEY missing, skipping real car search.');
      return [];
    }

    try {
      // Step 1: Resolve the city to coordinates using RapidAPI Locations
      const locRes = await fetch(
        `https://booking-com.p.rapidapi.com/v1/car-rental/locations?name=${encodeURIComponent(city)}&locale=en-gb`,
        {
          headers: {
            'x-rapidapi-host': 'booking-com.p.rapidapi.com',
            'x-rapidapi-key': apiKey,
          },
        },
      );
      const locData = await locRes.json();

      if (!locData || !Array.isArray(locData) || locData.length === 0) {
        this.logger.warn(`No location found in Booking API for: ${city}`);
        return [];
      }

      const pickupData = locData[0];
      const lat =
        pickupData.latitude || pickupData.dest_latitude || pickupData.lat;
      const lng =
        pickupData.longitude || pickupData.dest_longitude || pickupData.lng;
      const realLocationName = pickupData.name || city;

      if (!lat || !lng) return [];

      // Step 2: Use tomorrow's dates for a generic search to ensure availability
      const today = new Date();
      const pickupDate = new Date(today);
      pickupDate.setDate(today.getDate() + 14); // 2 weeks from now
      const dropoffDate = new Date(today);
      dropoffDate.setDate(today.getDate() + 17); // 3 days rental

      const fmtP = pickupDate.toISOString().split('T')[0] + ' 10:00:00';
      const fmtD = dropoffDate.toISOString().split('T')[0] + ' 10:00:00';

      this.logger.log(
        `Searching Booking API Cars for coords: ${lat}, ${lng} on ${fmtP}`,
      );

      // Updated to use a valid 'from_country' (nl) and pick_up_datetime
      const searchUrl = `https://booking-com.p.rapidapi.com/v1/car-rental/search?pick_up_latitude=${lat}&pick_up_longitude=${lng}&drop_off_latitude=${lat}&drop_off_longitude=${lng}&pick_up_datetime=${encodeURIComponent(fmtP)}&drop_off_datetime=${encodeURIComponent(fmtD)}&sort_by=recommended&from_country=nl&locale=en-gb&currency=USD`;

      const searchRes = await fetch(searchUrl, {
        headers: {
          'x-rapidapi-host': 'booking-com.p.rapidapi.com',
          'x-rapidapi-key': apiKey,
        },
      });

      const searchData = await searchRes.json();
      const results = searchData?.search_results || [];

      if (results.length === 0) return [];

      // Step 3: Map Booking API response to our Premium Vehicle schema
      return results.slice(0, 10).map((item: any) => {
        const vehicle = item.vehicle_info || {};
        const price = item.pricing_info?.price || item.pricing?.price || 150;
        const name = vehicle.v_name || vehicle.name || 'Premium Rental Car';

        // Ensure image is premium quality
        let image = vehicle.image_url || vehicle.v_image_url;
        if (!image || !image.startsWith('http')) {
          // Provide dynamic rich image fallback based on car type if Booking API returns poor imagery
          const typeStr = (
            vehicle.v_type ||
            vehicle.type ||
            'car'
          ).toLowerCase();
          if (typeStr.includes('suv'))
            image =
              'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80';
          else if (typeStr.includes('van'))
            image =
              'https://images.unsplash.com/photo-1510168341108-16e6d19afcc9?auto=format&fit=crop&q=80';
          else
            image =
              'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80';
        }

        return {
          name: name,
          type: (vehicle.v_type || vehicle.type || 'sedan').toLowerCase(),
          image: image,
          pricePerDay: Math.floor(Number(price) / 3), // Divided by 3 day search length
          currency: 'USD', // Normalized
          location: realLocationName,
          seats: vehicle.seats || vehicle.v_seats || 5,
          transmission:
            vehicle.transmission === 'M' || vehicle.v_transmission === 'Manual'
              ? 'Manual'
              : 'Automatic',
          fuelType: vehicle.fuel_type || vehicle.v_fuel_type || 'Petrol',
          driverOption: false,
          verified: true,
          id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
      });
    } catch (error) {
      this.logger.error(`Error with real car API logic: ${error.message}`);
      return [];
    }
  }
}
