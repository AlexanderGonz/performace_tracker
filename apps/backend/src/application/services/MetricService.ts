import { MetricRepository } from '../../domain/repositories/MetricRepository';
import { Metric } from '../../domain/entities/Metric';
import { CreateMetricDto, MetricDto } from '../../application/dtos/athleteDto';


export class MetricService {
  constructor(private metricRepository: MetricRepository) {}

  async addMetric(athleteId: string, metricData: CreateMetricDto): Promise<MetricDto> {
    const newMetric: Omit<Metric, 'id'> = {
      ...metricData,
      athleteId,
      timestamp: metricData.timestamp ? new Date(metricData.timestamp) : new Date(),
    };

    const savedMetric = await this.metricRepository.addMetric(athleteId, newMetric);
    return this.mapToDto(savedMetric);
  }

  async getMetrics(athleteId: string, metricType?: string): Promise<Metric[]> {
    return this.metricRepository.getMetrics(athleteId, metricType);
  }

  private mapToDto(metric: Metric): MetricDto {
    return {
      id: metric.id,
      metricType: metric.metricType,
      value: metric.value,
      unit: metric.unit,
      timestamp: metric.timestamp,
      athleteId: metric.athleteId,
    };
  }
}