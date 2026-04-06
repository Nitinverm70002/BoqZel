export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  description: string;
  tags: string[];
  priceRange: string;
}

export interface Stay {
  id: string;
  name: string;
  type: string; // 'hotel' | 'resort' | 'apartment' | 'villa' or other from API
  image: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  location: string;
  amenities: string[];
  verified: boolean;
  description: string;
}

export interface Activity {
  id: string;
  name: string;
  type: 'tour' | 'dining' | 'adventure' | 'relaxation' | 'cultural' | 'transport';
  image: string;
  rating: number;
  priceFrom: number;
  currency: string;
  duration: string;
  description: string;
  location: string;
}

export interface Flight {
  id: string;
  airline: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  stops: number;
  class: 'economy' | 'business' | 'first';
}

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  image: string;
  pricePerDay: number;
  currency: string;
  location: string;
  seats: number;
  transmission: string;
  fuelType: string;
  driverOption: boolean;
  verified: boolean;
}


export interface ItineraryDay {
  day: number;
  date: string;
  activities: ItineraryActivity[];
}

export interface ItineraryActivity {
  id: string;
  time?: string;
  title: string;
  description: string;
  type: 'arrival' | 'stay' | 'tour' | 'dining' | 'relaxation' | 'transport' | 'departure';
  image?: string;
  rating?: number;
  price?: number;
  currency?: string;
}

export interface BookingItem {
  id: string;
  type: 'flight' | 'stay' | 'tour' | 'vehicle';
  name: string;
  details: string;
  price: number;
  currency: string;
  confirmed: boolean;
}

export interface TravelStyle {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
}

export interface IntentOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  active?: boolean;
}
