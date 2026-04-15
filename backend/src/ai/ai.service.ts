import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private groq: Groq;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (apiKey) {
      this.groq = new Groq({ apiKey });
      this.logger.log('Groq AI Service initialized successfully.');
    } else {
      this.logger.warn(
        'GROQ_API_KEY is not set. AI features will be disabled.',
      );
    }
  }

  async generateItinerary(query: string) {
    if (!this.groq) {
      throw new Error('AI Service not configured. Set GROQ_API_KEY in .env');
    }

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are BoqZel AI, a luxury travel planning assistant specializing in Africa and the Middle East. Generate a detailed, structured travel itinerary. 

Return ONLY valid JSON with this exact structure:
{
  "title": "Trip title",
  "description": "Brief trip overview",
  "totalDays": number,
  "estimatedBudget": "e.g. $1,200 - $2,500",
  "days": [
    {
      "day": 1,
      "title": "Day title (e.g. Arrival & City Exploration)",
      "activities": [
        {
          "title": "Activity name",
          "description": "What to do, where to go",
          "time": "e.g. 9:00 AM",
          "type": "arrival|tour|dining|adventure|relaxation|cultural|stay|departure",
          "estimatedCost": "$50"
        }
      ],
      "eveningActivity": "Optional evening suggestion",
      "stayRecommendation": "Where to stay that night"
    }
  ]
}

Rules:
- Include 2-4 activities per day
- Add specific times for each activity
- Include a mix of activity types
- Make recommendations specific to the destination
- Keep the tone premium, sophisticated, and enthusiastic
- Include local hidden gems alongside popular attractions`,
          },
          {
            role: 'user',
            content: query,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('AI returned empty response');
      }

      const parsed = JSON.parse(content);
      this.logger.log(
        `Generated itinerary: "${parsed.title}" with ${parsed.days?.length || 0} days`,
      );
      return parsed;
    } catch (error) {
      this.logger.error(`Error generating itinerary: ${error.message}`);
      throw error;
    }
  }

  async chat(message: string, history: any[] = []) {
    if (!this.groq) {
      throw new Error('AI Service not configured. Set GROQ_API_KEY in .env');
    }

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'You are BoqZel AI, a helpful and premium travel concierge. You help users plan trips, find stays, and answer questions about destinations. Your tone is professional, sophisticated, and enthusiastic about travel.',
          },
          ...history,
          {
            role: 'user',
            content: message,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.8,
      });

      return (
        completion.choices[0].message.content ||
        'I apologize, but I could not generate a response.'
      );
    } catch (error) {
      this.logger.error(`Error in chat: ${error.message}`);
      throw error;
    }
  }

  async generateStays(location: string): Promise<any[]> {
    if (!this.groq) {
      throw new Error('AI Service not configured.');
    }

    try {
      this.logger.log(`No stays found for ${location}. Generating via AI...`);
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are BoqZel AI, a luxury travel planning assistant specifically focused entirely on Africa.
Generate a JSON object containing an array named "stays" with 4 to 6 highly realistic, premium quality accommodations strictly for the location: "${location}".
CRITICAL RULE: Everything you generate must be located in Africa. If the requested location is outside Africa, imagine realistic premium African-themed resorts or culturally rich stays with a similar vibe, but place them firmly in a relevant African setting.
Return ONLY valid JSON matching this exact structure:
{
  "stays": [
    {
      "name": "String (Realistic name of hotel/resort)",
      "type": "String (Must be 'hotel', 'resort', 'apartment', or 'villa')",
      "image": "String (Valid images.unsplash.com URL, e.g., 'https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?auto=format&fit=crop&q=80&w=800'. Focus on African luxury or coastal aesthetics)",
      "rating": "Number (4.5 to 5.0)",
      "reviewCount": "Number (50 to 500)",
      "pricePerNight": "Number (100 to 800)",
      "currency": "USD",
      "location": "String (Exact location or specific neighborhood. MUST BE IN AFRICA)",
      "amenities": ["Array", "of", "5-6", "Strings"],
      "verified": true,
      "description": "String (Compelling 2-3 sentence description emphasizing African luxury, wildlife, or local culture)"
    }
  ]
}`,
          },
          {
            role: 'user',
            content: `Generate stays for ${location}`,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0].message.content;
      if (!content) throw new Error('AI returned empty stays response');

      const parsed = JSON.parse(content);
      return parsed.stays || [];
    } catch (error) {
      this.logger.error(`Error generating stays: ${error.message}`);
      throw error;
    }
  }

  async generateVehicles(location: string): Promise<any[]> {
    if (!this.groq) {
      throw new Error('AI Service not configured.');
    }

    try {
      this.logger.log(
        `Generating highly localized African car rentals for ${location}...`,
      );
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are the core intelligence for the BoqZel Africa Mobility API.
Generate a JSON object containing an array named "vehicles" with 4 to 6 highly authentic, premium vehicles for the location: "${location}".
CRITICAL RULE: The exact vehicles and descriptions must be highly contextually targeted to Africa and particularly South Sudan/East Africa travel. Favor vehicles like Toyota Land Cruiser V8, Prado, Safari-spec vehicles, high-end SUVs, Hilux Double Cabs, and VIP Vans.
Return ONLY valid JSON matching this exact structure:
{
  "vehicles": [
    {
      "name": "String (Realistic name of car/suv)",
      "type": "String (Must be 'suv', 'truck', 'sedan', 'van', or 'luxury')",
      "image": "String (Always use a high-quality relevant Unsplash auto URL)",
      "pricePerDay": "Number (80 to 500)",
      "currency": "USD",
      "location": "${location}",
      "seats": "Number",
      "transmission": "String (Automatic or Manual)",
      "fuelType": "String (Diesel or Petrol)",
      "driverOption": true,
      "verified": true
    }
  ]
}`,
          },
          {
            role: 'user',
            content: `Generate premium African car rentals for ${location}`,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0].message.content;
      if (!content) throw new Error('AI returned empty vehicles response');

      const parsed = JSON.parse(content);
      return parsed.vehicles || [];
    } catch (error) {
      this.logger.error(`Error generating vehicles: ${error.message}`);
      throw error;
    }
  }

  async generateTrendingDestinations(): Promise<any[]> {
    if (!this.groq) {
      throw new Error('AI Service not configured.');
    }

    try {
      this.logger.log('Generating trending destinations via AI...');
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are BoqZel AI, a luxury travel expert.
Identify 5 currently trending or "must-visit" destinations in Africa for the upcoming season.
CRITICAL IMAGERY RULE: Provide a UNIQUE Unsplash image URL for EACH destination. Do not use the same image twice.
VARY the landscapes: Include one Coastal/Beach, one Safari/Savanna, one Mountains/Highlands, one Cultural/Desert, and one Lush/Rainforest.
Return ONLY valid JSON with this exact structure:
{
  "destinations": [
    {
      "name": "String",
      "country": "String",
      "image": "String (A REAL, unique high-quality Unsplash URL for this specific vibe)",
      "rating": "Number (4.8 to 5.0)",
      "reviewCount": "Number",
      "verified": true,
      "description": "String (Sensory experience snippet)",
      "tags": ["Array of 4 vibe tags"],
      "priceRange": "String",
      "isTrending": true
    }
  ]
}`,
          },
          {
            role: 'user',
            content:
              'What are the top 5 trending destinations in Africa right now?',
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.8,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0].message.content;
      if (!content) throw new Error('AI returned empty trending response');
      const parsed = JSON.parse(content);
      return parsed.destinations || [];
    } catch (error) {
      this.logger.error(
        `Error generating trending destinations: ${error.message}`,
      );
      return [];
    }
  }

  async generateDestinations(query: string): Promise<any[]> {
    if (!this.groq) {
      throw new Error('AI Service not configured.');
    }

    try {
      this.logger.log(`Generating destinations for query: ${query}...`);
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are BoqZel AI, a luxury travel expert for Africa.
Generate a JSON object containing an array named "destinations" with 3 to 5 highly compelling travel destinations matching or related to the query: "${query}".
Return ONLY valid JSON with this exact structure:
{
  "destinations": [
    {
      "name": "String (e.g., Zanzibar Island)",
      "country": "String (e.g., Tanzania)",
      "image": "String (Valid images.unsplash.com URL, e.g., 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&q=80&w=800')",
      "rating": "Number (4.5 to 5.0)",
      "reviewCount": "Number",
      "verified": true,
      "description": "String (Compelling 2-3 sentence overview)",
      "tags": ["Array", "of", "3-4", "Tags"],
      "priceRange": "String (e.g., $1,000 - $3,500)"
    }
  ]
}`,
          },
          {
            role: 'user',
            content: `Find/Generate destinations for: ${query}`,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0].message.content;
      if (!content) throw new Error('AI returned empty destinations response');

      const parsed = JSON.parse(content);
      return parsed.destinations || [];
    } catch (error) {
      this.logger.error(`Error generating destinations: ${error.message}`);
      throw error;
    }
  }

  async generateActivities(location: string): Promise<any[]> {
    if (!this.groq) {
      throw new Error('AI Service not configured.');
    }

    try {
      this.logger.log(`Generating activities/experiences for: ${location}...`);
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are BoqZel AI, a luxury experience curator for Africa.
Generate a JSON object containing an array named "activities" with 4 to 6 unique travel experiences for: "${location}".
Return ONLY valid JSON with this exact structure:
{
  "activities": [
    {
      "name": "String (e.g., Nile River Sunset Cruise)",
      "type": "String (Must be 'transport', 'dining', 'tour', 'adventure', 'cultural', or 'relaxation')",
      "image": "String (Valid images.unsplash.com URL, e.g., 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800')",
      "rating": "Number (4.5 to 5.0)",
      "priceFrom": "Number (20 to 500)",
      "currency": "USD",
      "duration": "String (e.g., 3 hours, Full day)",
      "description": "String (Brief compelling description)",
      "location": "String (Area or landmark within ${location})"
    }
  ]
}`,
          },
          {
            role: 'user',
            content: `Generate unique activities for: ${location}`,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0].message.content;
      if (!content) throw new Error('AI returned empty activities response');

      const parsed = JSON.parse(content);
      return parsed.activities || [];
    } catch (error) {
      this.logger.error(`Error generating activities: ${error.message}`);
      throw error;
    }
  }

  async enrichCityData(
    cityName: string,
    countryName: string,
  ): Promise<{ description: string; tags: string[]; priceRange: string }> {
    if (!this.groq) {
      return {
        description: `${cityName} is a beautiful destination in ${countryName}.`,
        tags: ['travel', 'explore'],
        priceRange: '$500 - $1,500',
      };
    }

    try {
      this.logger.log(
        `Enriching city data with experience for ${cityName}, ${countryName}...`,
      );
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are BoqZel AI, a luxury travel concierge.
Generate a rich, sensory, and premium travel "experience" description for the city of ${cityName} in ${countryName}.
Focus on:
- The sensory vibe (smells, sights, sounds)
- A unique "BoqZel" luxury perspective
- What it feels like to spend a day there

Return ONLY valid JSON with this exact structure:
{
  "description": "String (A compelling 3-4 sentence sensory experience summary, NOT a generic guide)",
  "tags": ["Array", "of", "4", "specific", "vibe-based", "tags"],
  "priceRange": "String (Estimated total trip cost range, e.g., $1,200 - $3,500)"
}`,
          },
          {
            role: 'user',
            content: `Generate a premium experience description for ${cityName}, ${countryName}`,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0].message.content;
      if (!content) throw new Error('AI returned empty enrichment response');
      return JSON.parse(content);
    } catch (error) {
      this.logger.error(`Error enriching city data: ${error.message}`);
      return {
        description: `Experience the unique blend of luxury and heritage in ${cityName}, where every corner tells a story of ${countryName}'s rich culture.`,
        tags: ['heritage', 'luxury', 'culture', 'discovery'],
        priceRange: '$1,000 - $2,500',
      };
    }
  }

  async generateFlights(
    origin: string,
    destination: string,
    date: string,
  ): Promise<any[]> {
    if (!this.groq) {
      throw new Error('AI Service not configured.');
    }

    try {
      this.logger.log(`Generating AI flights for ${origin} to ${destination}...`);
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are the core intelligence for the BoqZel Africa Travel API.
Generate a JSON object containing an array named "itineraries" with 3 to 5 highly realistic flight options for the flight search: from "${origin}" to "${destination}" on "${date}".
CRITICAL RULE: The airlines should be realistic for Africa and the Middle East (e.g. Ethiopian Airlines, Kenya Airways, Emirates, Qatar Airways, FlyDubai, Uganda Airlines).
Return ONLY valid JSON matching this exact structure:
{
  "itineraries": [
    {
      "id": "String (unique)",
      "purchaseLinks": [
        {
          "totalPrice": "Number (Realistic price in USD, e.g. 150 to 900)"
        }
      ],
      "legs": [
        {
          "durationInMinutes": "Number (e.g. 120, 345)",
          "stopCount": "Number (0, 1, or 2)",
          "segments": [
            {
              "originAirportCode": "${origin}",
              "destinationAirportCode": "${destination}",
              "departureTime": "String (ISO format or 2026-04-15T10:30:00)",
              "arrivalTime": "String (ISO format)",
              "marketingAirline": {
                "name": "String (e.g. Ethiopian Airlines)"
              }
            }
          ]
        }
      ]
    }
  ]
}`,
          },
          {
            role: 'user',
            content: `Generate realistic flights from ${origin} to ${destination} on ${date}`,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0].message.content;
      if (!content) throw new Error('AI returned empty flights response');

      const parsed = JSON.parse(content);
      return parsed.itineraries || [];
    } catch (error) {
      this.logger.error(`Error generating flights: ${error.message}`);
      throw error;
    }
  }
}
