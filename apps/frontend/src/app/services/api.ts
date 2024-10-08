import { Metric } from '../../domain/models/Metric';
import { Athlete, AthleteFormData } from '../../domain/models/Athlete';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export const fetchAthletes = async (): Promise<Athlete[]> => {
  const response = await fetch(`${API_URL}/athletes`);
  if (!response.ok) {
    throw new Error('Failed to fetch athletes');
  }
  return response.json();
};

export const createAthlete = async (data: AthleteFormData): Promise<Athlete> => {
  const response = await fetch(`${API_URL}/athletes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create athlete');
  }
  const athlete = await response.json();
  return athlete;
};

export const updateAthlete = async (id: string, data: AthleteFormData): Promise<Athlete> => {
  const response = await fetch(`${API_URL}/athletes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update athlete');
  }
  return response.json();
};

export const getAthlete = async (id: string): Promise<Athlete> => {
  const response = await fetch(`${API_URL}/athletes/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch athlete');
  }
  return response.json();
};

export const createMetric = async (athleteId: string, data: Omit<Metric, 'id' | 'athleteId'>): Promise<Metric> => {
  const response = await fetch(`${API_URL}/athletes/${athleteId}/metrics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create metric');
  }
  return response.json();
};

export const deleteAthlete = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/athletes/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete athlete');
  }
};