import { Vehicle } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchVehicles(query?: string): Promise<Vehicle[]> {
  try {
    const url = new URL(`${API_URL}/move`);
    if (query) {
      url.searchParams.append('q', query);
    }

    const response = await fetch(url.toString(), {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vehicles');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
}
