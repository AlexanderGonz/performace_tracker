import { Prisma } from '@prisma/client';

export type CreateAthleteDto = Prisma.AthleteCreateInput;
export type UpdateAthleteDto = Prisma.AthleteUpdateInput;

export type CreateMetricDto = Omit<Prisma.MetricCreateInput, 'athlete'>;
export type UpdateMetricDto = Omit<Prisma.MetricUpdateInput, 'athlete'>;

export interface AthleteDto {
  id: string;
  name: string;
  age: number;
  team: string;
}

export interface MetricDto {
  id: string;
  metricType: string;
  value: number;
  unit: string;
  date: Date;
  athleteId: string;
}