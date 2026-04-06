import { Stay } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';

export async function fetchStays(type?: string, query?: string, sort?: string): Promise<Stay[]> {
  const params = new URLSearchParams();
  if (type && type !== 'All') params.append('type', type);
  if (query) params.append('q', query);
  if (sort) params.append('sort', sort);

  const response = await fetch(`${API_BASE_URL}/stays?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch stays');
  }
  return response.json();
}

export async function fetchStayById(id: string): Promise<Stay> {
  const response = await fetch(`${API_BASE_URL}/stays/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch stay details');
  }
  return response.json();
}
