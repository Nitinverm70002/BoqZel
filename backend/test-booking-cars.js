#!/usr/bin/env node
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
      const today = new Date();
      const pickupDate = new Date(today);
      pickupDate.setDate(today.getDate() + 14);
      const dropoffDate = new Date(today);
      dropoffDate.setDate(today.getDate() + 17);

      const fmtP = pickupDate.toISOString().split('T')[0] + ' 10:00:00';
      const fmtD = dropoffDate.toISOString().split('T')[0] + ' 10:00:00';
      
      // Fixed parameters: using 'nl' as from_country (valid enum) and pick_up_datetime
      const searchUrl = `https://booking-com.p.rapidapi.com/v1/car-rental/search?pick_up_latitude=${pickupData.lat}&pick_up_longitude=${pickupData.lng}&drop_off_latitude=${pickupData.lat}&drop_off_longitude=${pickupData.lng}&pick_up_datetime=${encodeURIComponent(fmtP)}&drop_off_datetime=${encodeURIComponent(fmtD)}&sort_by=recommended&from_country=nl&locale=en-gb&currency=USD`;
      
      console.log("Search URL:", searchUrl);
      
      const searchRes = await fetch(searchUrl, {
        headers: {
           'x-rapidapi-host': 'booking-com.p.rapidapi.com',
           'x-rapidapi-key': apiKey
        }
      });
      const searchData = await searchRes.json();
      console.log("Search results status:", searchRes.status);
      console.log("Search results data preview:", JSON.stringify(searchData).slice(0, 1000));
    }
  } catch(e) {
    console.error(e);
  }
}
testApi();
