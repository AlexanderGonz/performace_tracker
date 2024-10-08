import { Context } from 'hono';
import { PrismaClient } from '@prisma/client';
import { CreateAthleteDto, UpdateAthleteDto, CreateMetricDto } from '../dtos/athleteDto';
import { APIError } from '../utils/errors';

const prisma = new PrismaClient();

export const createAthlete = async (c: Context) => {
  try {
    const data: CreateAthleteDto = await c.req.json();
    const athlete = await prisma.athlete.create({
    data,
    });
    return athlete;
  } catch (error) {
    throw new APIError('Failed to create athlete', 500);
  }
};

export const getAllAthletes = async (c: Context) => {
  try {
    const athletes = await prisma.athlete.findMany();
    return athletes;
  } catch (error) {
    throw new APIError('Failed to get athletes', 500);
  }
};

export const getAthleteById = async (c: Context) => {
  const id = c.req.param('id');
  try {
    const athlete = await prisma.athlete.findUnique({
      where: { id },
      include: { metrics: true },
    });
    if (!athlete) {
      throw new APIError('Athlete not found', 404);
    }
    return athlete;
  } catch (error) {
    throw new APIError('Failed to get athlete', 500);
  }
};

export const updateAthlete = async (c: Context) => {
  const id = c.req.param('id');
  const data: UpdateAthleteDto = await c.req.json();
  try {
    const athlete = await prisma.athlete.update({
      where: { id },
      data,
    });
    return athlete;
  } catch (error) {
    throw new APIError('Failed to update athlete', 500);
  }
};

export const addMetric = async (c: Context) => {
  const athleteId = c.req.param('id');
  const data: CreateMetricDto = await c.req.json();
  try {
    const metric = await prisma.metric.create({
      data: {
        ...data,
        athlete: { connect: { id: athleteId } },
      },
    });
    return metric;
  } catch (error) {
    throw new APIError('Failed to add metric', 500);
  }
};

export const getMetrics = async (c: Context) => {
  const athleteId = c.req.param('id');
  const metricType = c.req.query('metricType');
  const whereClause = metricType ? { athleteId, type: metricType } : { athleteId };
  try {
    const metrics = await prisma.metric.findMany({
      where: whereClause,
    });
    return metrics;
  } catch (error) {
    throw new APIError('Failed to get metrics', 500);
  }
};

export const deleteAthlete = async (c: Context): Promise<void> => {
  const id = c.req.param('id');
  try {
    await prisma.athlete.delete({
      where: { id },
    });
  } catch (error) {
    throw new APIError('Failed to delete athlete', 500);
  }
};