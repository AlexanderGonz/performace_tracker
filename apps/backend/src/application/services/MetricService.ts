import { MetricRepository } from '../../domain/repositories/MetricRepository';
import { Metric } from '../../domain/entities/Metric';
import { CreateMetricDto, MetricDto } from '../../application/dtos/athleteDto';
import { AthleteRepository } from 'apps/backend/src/domain/repositories/AthleteRepository';


export class MetricService {
  constructor(private metricRepository: MetricRepository, private athleteRepository: AthleteRepository) {}

  async addMetric(athleteId: string, metricData: CreateMetricDto): Promise<MetricDto> {
    const athlete = await this.athleteRepository.findById(athleteId);
    if (!athlete) {
      throw new Error('Athlete not found');
    }

    const newMetric = new Metric(
      '', // id will be generated
      athleteId,
      metricData.metricType,
      metricData.value,
      metricData.unit,
      metricData.timestamp ? new Date(metricData.timestamp) : new Date(),
    );

    athlete.addMetric(newMetric);
    await this.athleteRepository.save(athlete);

    const savedMetric = athlete.metrics[athlete.metrics.length - 1];
    return this.mapToDto(savedMetric);
  }

  async getMetrics(athleteId: string, metricType?: string): Promise<MetricDto[]> {
    const athlete = await this.athleteRepository.findById(athleteId);
    if (!athlete) {
      throw new Error('Athlete not found');
    }

    const metrics = await this.metricRepository.getMetricsForAthlete(athlete.id, metricType);
    athlete.setMetrics(metrics);

    const filteredMetrics = athlete.getFilteredMetrics(metricType);
    return filteredMetrics.map(this.mapToDto);
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