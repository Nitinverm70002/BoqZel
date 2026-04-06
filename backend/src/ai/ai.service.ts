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
      this.logger.warn('GROQ_API_KEY is not set. AI features will be disabled.');
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
      this.logger.log(`Generated itinerary: "${parsed.title}" with ${parsed.days?.length || 0} days`);
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
            content: 'You are BoqZel AI, a helpful and premium travel concierge. You help users plan trips, find stays, and answer questions about destinations. Your tone is professional, sophisticated, and enthusiastic about travel.',
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

      return completion.choices[0].message.content || 'I apologize, but I could not generate a response.';
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
      "image": "String (Realistic Unsplash URL, e.g., 'https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?w=800&fit=crop'. Focus on African luxury, safari, or coastal aesthetics)",
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
}`
          },
          {
            role: 'user',
            content: `Generate stays for ${location}`
          }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: 'json_object' }
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
      this.logger.log(`Generating highly localized African car rentals for ${location}...`);
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
}`
          },
          {
            role: 'user',
            content: `Generate premium African car rentals for ${location}`
          }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: 'json_object' }
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
}
