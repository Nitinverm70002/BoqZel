#!/usr/bin/env node
require('dotenv').config();
const apiKey = process.env.RAPIDAPI_KEY;

async function testCars() {
  const url = 'https://booking-com.p.rapidapi.com/v1/car-rental/search?pick_up_latitude=51.5074&pick_up_longitude=-0.1278&drop_off_latitude=51.5074&drop_off_longitude=-0.1278&pick_up_date=2024-12-01&drop_off_date=2024-12-05&pick_up_time=10:00&drop_off_time=10:00&currency=USD';
  try {
    const res = await fetch(url, {
      headers: {
        'x-rapidapi-host': 'booking-com.p.rapidapi.com',
        'x-rapidapi-key': apiKey
      }
    });
    console.log(res.status);
    const data = await res.text();
    console.log(data.slice(0, 500));
  } catch (err) {
    console.error(err);
  }
}
testCars();
