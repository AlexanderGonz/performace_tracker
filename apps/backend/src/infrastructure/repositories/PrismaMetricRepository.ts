import { PrismaClient } from '@prisma/client';
import { Metric } from '../../domain/entities/Metric';
import { MetricRepository } from '../../domain/repositories/MetricRepository';

export class PrismaMetricRepository implements MetricRepository {
  constructor(private prisma: PrismaClient) {}

  async addMetric(athleteId: string, metric: Omit<Metric, 'id'>): Promise<Metric> {
    return this.prisma.metric.create({
      data: {
        metricType: metric.metricType,
        value: metric.value,
        unit: metric.unit,
        athlete: { connect: { id: athleteId } }
      }
    });
  }

  async getMetrics(athleteId: string, metricType?: string): Promise<Metric[]> {
    return this.prisma.metric.findMany({
      where: {
        athleteId,
        ...(metricType && { type: metricType })
      }
    });
  }
}