import { Context } from 'hono';
import { APIError } from '../../../utils/errors';
import { MetricService } from '../../../application/services/MetricService';
import { CreateMetricDto } from '../../../application/dtos/athleteDto';
export class MetricController {
  constructor(private metricService: MetricService) {}

  async addMetric(c: Context) {
    try {
      const athleteId = c.req.param('athleteId');
      const metricData: CreateMetricDto = await c.req.json();
      const metric = await this.metricService.addMetric(athleteId, metricData);
      return c.json(metric, 201);
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError('Failed to add metric', 500);
    }
  }

  async getMetrics(c: Context) {
    try {
      const athleteId = c.req.param('athleteId');
      const metricType = c.req.query('metricType');
      const metrics = await this.metricService.getMetrics(athleteId, metricType);
      return c.json(metrics);
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError('Failed to get metrics', 500);
    }
  }
}