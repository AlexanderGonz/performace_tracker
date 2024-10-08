import { Metric } from "./Metric";


export class Athlete {
  constructor(
    public id: string,
    public name: string,
    public age: number,
    public team: string,
    public metrics: Metric[] = []
  ) {}

  addMetric(metric: Metric): void {
    this.metrics.push(metric);
  }

  setMetrics(metrics: Metric[]): void {
    this.metrics = metrics;
  }

  getFilteredMetrics(metricType?: string): Metric[] {
    if (!metricType) {
      return this.metrics;
    }
    return this.metrics.filter(metric => metric.metricType === metricType);
  }
}