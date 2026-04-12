
const fetch = require('node-fetch');

async function testTripAdvisorPhotos() {
  const apiKey = '59f9f78cefmsh31a45cb82b2dc9bp171c77jsn0ae168f81af0';
  const query = 'Zanzibar';

  console.log(`Searching for ${query}...`);
  const searchRes = await fetch(`https://tripadvisor-com1.p.rapidapi.com/auto-complete?query=${encodeURIComponent(query)}`, {
    headers: {
      'x-rapidapi-host': 'tripadvisor-com1.p.rapidapi.com',
      'x-rapidapi-key': apiKey
    }
  });
  const searchData = await searchRes.json();
  const loc = searchData?.data?.find(l => l.trackingItems?.dataType === 'LOCATION');

  if (!loc) {
    console.log('Location not found');
    return;
  }

  const locationId = loc.trackingItems.locationId;
  console.log(`Found locationId: ${locationId}. Fetching photos...`);

  const photoRes = await fetch(`https://tripadvisor-com1.p.rapidapi.com/locations/photos?locationId=${locationId}`, {
    headers: {
      'x-rapidapi-host': 'tripadvisor-com1.p.rapidapi.com',
      'x-rapidapi-key': apiKey
    }
  });
  const photoData = await photoRes.json();
  console.log('Photo Data:', JSON.stringify(photoData, null, 2));
}

testTripAdvisorPhotos();
