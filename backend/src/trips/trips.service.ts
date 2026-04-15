import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../ai/ai.service';

@Injectable()
export class TripsService {
  private readonly logger = new Logger(TripsService.name);
  private readonly apiKey = process.env.RAPIDAPI_KEY;
  private readonly host = process.env.TRIPADVISOR_API_HOST || 'tripadvisor-com1.p.rapidapi.com';

  constructor(private readonly aiService: AiService) {}

  async searchAirports(query: string) {
    if (!this.apiKey) {
      this.logger.warn('RAPIDAPI_KEY missing, using static fallback for demo');
      return this.getStaticAirports(query);
    }

    try {
      const response = await fetch(
        `https://${this.host}/flights/auto-complete?query=${encodeURIComponent(query)}&locale=en-US`,
        {
          headers: {
            'x-rapidapi-key': this.apiKey,
            'x-rapidapi-host': this.host,
          },
        }
      );

      const data = await response.json();
      
      // Handle quota exceeded
      if (data.message && data.message.includes('quota')) {
        this.logger.warn('RapidAPI quota exceeded for airports. Using fallback.');
        return this.getStaticAirports(query);
      }

      return data?.data || data || [];
    } catch (error) {
      this.logger.error(`Error searching airports: ${error.message}`);
      return this.getStaticAirports(query);
    }
  }

  async searchFlights(origin: string, destination: string, date: string) {
    if (!this.apiKey) {
      this.logger.warn('RAPIDAPI_KEY missing, using AI fallback');
      return this.aiService.generateFlights(origin, destination, date);
    }

    try {
      this.logger.log(`Searching flights from ${origin} to ${destination} on ${date}`);
      
      const url = `https://${this.host}/flights/search-flights?originAirportCode=${origin}&destinationAirportCode=${destination}&date=${date}&itineraryType=ONE_WAY&sortOrder=PRICE&numAdults=1&numRooms=1&currencyCode=USD`;
      
      const response = await fetch(url, {
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': this.host,
        },
      });

      const data = await response.json();

      // Handle quota exceeded or other errors
      if (data.message && (data.message.includes('quota') || data.message.includes('Endpoint'))) {
        this.logger.warn(`RapidAPI error: ${data.message}. Falling back to AI.`);
        return this.aiService.generateFlights(origin, destination, date);
      }
      
      const flights = data?.data?.itineraries || data?.itineraries || data?.results || [];
      
      if (flights.length === 0) {
        this.logger.log('No real flights found, providing AI alternatives.');
        return this.aiService.generateFlights(origin, destination, date);
      }

      return flights;
    } catch (error) {
      this.logger.error(`Error searching flights: ${error.message}. Using AI fallback.`);
      return this.aiService.generateFlights(origin, destination, date);
    }
  }

  private getStaticAirports(query: string) {
    const q = query.toLowerCase();
    const mockAirports = [
      { airportCode: 'JUB', airportName: 'Juba', cityName: 'South Sudan' },
      { airportCode: 'NBO', airportName: 'Nairobi Jomo Kenyatta', cityName: 'Kenya' },
      { airportCode: 'DXB', airportName: 'Dubai International', cityName: 'UAE' },
      { airportCode: 'ADD', airportName: 'Bole International', cityName: 'Addis Ababa' },
      { airportCode: 'LHR', airportName: 'London Heathrow', cityName: 'UK' },
    ];
    return mockAirports.filter(a => 
      a.airportName.toLowerCase().includes(q) || 
      a.airportCode.toLowerCase().includes(q) ||
      a.cityName.toLowerCase().includes(q)
    );
  }
}
