import { Context } from 'hono';
import { PrismaClient } from '@prisma/client';
import { CreateAthleteDto, UpdateAthleteDto, CreateMetricDto } from '../dtos/athleteDto';

const prisma = new PrismaClient();

export const createAthlete = async (c: Context) => {
  const data: CreateAthleteDto = await c.req.json();
  const athlete = await prisma.athlete.create({
    data,
  });
  return c.json(athlete, 201);
};

export const getAllAthletes = async (c: Context) => {
  const athletes = await prisma.athlete.findMany();
  return c.json(athletes);
};

export const getAthleteById = async (c: Context) => {
  const id = c.req.param('id');
  const athlete = await prisma.athlete.findUnique({
    where: { id },
    include: { metrics: true },
  });
  if (athlete) {
    return c.json(athlete);
  } else {
    return c.text('Athlete not found', 404);
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
    return c.json(athlete);
  } catch (error) {
    return c.text('Athlete not found', 404);
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
    return c.json(metric, 201);
  } catch (error) {
    return c.text('Athlete not found', 404);
  }
};

export const getMetrics = async (c: Context) => {
  const athleteId = c.req.param('id');
  const metricType = c.req.query('metricType');
  const whereClause = metricType ? { athleteId, type: metricType } : { athleteId };
  const metrics = await prisma.metric.findMany({
    where: whereClause,
  });
  return c.json(metrics);
};

export const deleteAthlete = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await prisma.athlete.delete({
      where: { id },
    });
    return c.text('', 204);
  } catch (error) {
    return c.text('Athlete not found', 404);
  }
};