import { Prisma } from '@prisma/client';

export type CreateAthleteDto = Prisma.AthleteCreateInput;
export type UpdateAthleteDto = Prisma.AthleteUpdateInput;
export type CreateMetricDto = Omit<Prisma.MetricCreateInput, 'athlete'>;