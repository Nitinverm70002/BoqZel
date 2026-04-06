import Groq from 'groq-sdk';
import 'dotenv/config';

async function testGroq() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('No API key');
  
  const groq = new Groq({ apiKey });

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are BoqZel AI, a luxury travel planning assistant.\nGenerate a JSON object containing an array named "stays" with 4 to 6 highly realistic, premium quality accommodations strictly for the location: "Malakal".\nReturn ONLY valid JSON matching this exact structure:\n{\n  "stays": [\n    {\n      "name": "String (Realistic name of hotel/resort)",\n      "type": "String (Must be \'hotel\', \'resort\', \'apartment\', or \'villa\')",\n      "image": "String (Realistic Unsplash URL, e.g., \'https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?w=800&fit=crop\'. Use different photo IDs for variety)",\n      "rating": "Number (4.5 to 5.0)",\n      "reviewCount": "Number (50 to 500)",\n      "pricePerNight": "Number (100 to 800)",\n      "currency": "USD",\n      "location": "String (Exact location or specific neighborhood)",\n      "amenities": ["Array", "of", "5-6", "Strings"],\n      "verified": true,\n      "description": "String (Compelling 2-3 sentence description emphasizing luxury)"\n    }\n  ]\n}'
        },
        {
          role: 'user',
          content: 'Generate stays for Malakal'
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' }
    });
    
    console.log(completion.choices[0].message.content);
  } catch (e) {
    console.error(e);
  }
}

testGroq();
