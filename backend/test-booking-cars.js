require('dotenv').config();

async function testApi() {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    console.error("No API key");
    return;
  }
  
  try {
    // Step 1: Search location
    const locRes = await fetch('https://booking-com.p.rapidapi.com/v1/car-rental/locations?name=Juba&locale=en-gb', {
      headers: {
        'x-rapidapi-host': 'booking-com.p.rapidapi.com',
        'x-rapidapi-key': apiKey
      }
    });
    const locData = await locRes.json();
    console.log("Locations:", JSON.stringify(locData).slice(0, 500));
    
    if (locData && locData.length > 0) {
      const pickupData = {
        lat: locData[0].latitude || locData[0].dest_latitude,
        lng: locData[0].longitude || locData[0].dest_longitude,
      };
      
      console.log("Using coords:", pickupData);
      
      // Step 2: Try to search for rentals
      // I am guessing standard params based on usual car-rental APIs, but Booking uses standard ones too
      // Usually requires pickup and dropoff coords, pickup date/time, dropoff date/time
      const pickupDate = "2026-05-10";
      const dropoffDate = "2026-05-15";
      const pickupTime = "10:00";
      const dropoffTime = "10:00";
      
      const searchUrl = `https://booking-com.p.rapidapi.com/v1/car-rental/search?pick_up_latitude=${pickupData.lat}&pick_up_longitude=${pickupData.lng}&drop_off_latitude=${pickupData.lat}&drop_off_longitude=${pickupData.lng}&pick_up_date=${pickupDate}&drop_off_date=${dropoffDate}&pick_up_time=${pickupTime}&drop_off_time=${dropoffTime}&locale=en-gb&currency=USD`;
      
      console.log("Search URL:", searchUrl);
      
      const searchRes = await fetch(searchUrl, {
        headers: {
           'x-rapidapi-host': 'booking-com.p.rapidapi.com',
           'x-rapidapi-key': apiKey
        }
      });
      const searchData = await searchRes.json();
      console.log("Search results:", JSON.stringify(searchData).slice(0, 1000));
    }
  } catch(e) {
    console.error(e);
  }
}
testApi();
