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
    await this.prisma.athlete.upsert({
      where: { id: athlete.id },
      update: {
        name: athlete.name,
        age: athlete.age,
        team: athlete.team,
        metrics: {
          upsert: athlete.metrics.map(metric => ({
            where: { id: metric.id },
            update: this.mapMetricToUpdateInput(metric),
            create: this.mapMetricToCreateInput(metric),
          })),
        },
      },
      create: {
        id: athlete.id,
        name: athlete.name,
        age: athlete.age,
        team: athlete.team,
        metrics: {
          create: athlete.metrics.map(this.mapMetricToCreateInput),
        },
      },
    });
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
    await this.prisma.athlete.delete({ where: { id } });
  }

  private mapToDomainAthlete(prismaAthlete: any): Athlete {
    return new Athlete(
      prismaAthlete.id,
      prismaAthlete.name,
      prismaAthlete.age,
      prismaAthlete.team,
      prismaAthlete.metrics.map((m: any) => new Metric(m.id, m.athleteId, m.type, m.value, m.unit, m.date))
    );
  }
}