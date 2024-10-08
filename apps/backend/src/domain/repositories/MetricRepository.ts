import { Metric } from "../entities/Metric";

export interface MetricRepository {
  addMetric(athleteId: string, metric: Omit<Metric, 'id'>): Promise<Metric>;
  getMetrics(athleteId: string, metricType?: string): Promise<Metric[]>;
}