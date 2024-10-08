import { PrismaClient } from '@prisma/client';
import { Athlete } from '../../domain/entities/Athlete';
import { Metric } from '../../domain/entities/Metric';
import { AthleteRepository } from '../../domain/repositories/AthleteRepository';

export class PrismaAthleteRepository implements AthleteRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Athlete[]> {
    const athletes = await this.prisma.athlete.findMany({
      include: { metrics: true }
    });
    return athletes.map(this.mapToDomainAthlete);
  }

  async findById(id: string): Promise<Athlete | null> {
    const athlete = await this.prisma.athlete.findUnique({
      where: { id },
      include: { metrics: true }
    });
    return athlete ? this.mapToDomainAthlete(athlete) : null;
  }
  
  async save(athlete: Athlete): Promise<void> {
    try {
      await this.prisma.$transaction(async (prisma) => {
        // Upsert the athlete
      const upsertedAthlete = await prisma.athlete.upsert({
        where: { id: athlete.id },
        update: {
          name: athlete.name,
          age: Number(athlete.age),
          team: athlete.team,
        },
        create: {
          id: athlete.id,
          name: athlete.name,
          age: Number(athlete.age),
          team: athlete.team,
        },
      });
  
      // Handle metrics
      if (athlete.metrics && athlete.metrics.length > 0) {
        // Delete metrics that are no longer present
        await prisma.metric.deleteMany({
          where: {
            athleteId: athlete.id,
            id: { notIn: athlete.metrics.map(m => m.id) },
          },
        });
  
        // Upsert each metric
        for (const metric of athlete.metrics) {
          await prisma.metric.upsert({
            where: { id: metric.id },
            update: this.mapMetricToUpdateInput(metric),
            create: {
              ...this.mapMetricToCreateInput(metric),
              athleteId: upsertedAthlete.id,
            },
          });
        }
      }
    });
  } catch (error) {
    console.error('Error saving athlete:', error);
    throw error;
  }
}
  private mapMetricToUpdateInput(metric: Metric) {
    return {
      metricType: metric.metricType,
      value: metric.value,
      unit: metric.unit,
      timestamp: metric.timestamp,
    };
  }
  
  private mapMetricToCreateInput(metric: Metric) {
    return {
      id: metric.id,
      metricType: metric.metricType,
      value: metric.value,
      unit: metric.unit,
      timestamp: metric.timestamp,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.metric.deleteMany({
        where: { athleteId: id },
      });

      await prisma.athlete.delete({ where: { id } });
    });
  }

  private mapToDomainAthlete(prismaAthlete: any): Athlete {
    return new Athlete(
      prismaAthlete.id,
      prismaAthlete.name,
      prismaAthlete.age,
      prismaAthlete.team,
      prismaAthlete.metrics.map((m: Metric) => new Metric(m.id, m.athleteId, m.metricType, m.value, m.unit, m.timestamp))
    );
  }
}