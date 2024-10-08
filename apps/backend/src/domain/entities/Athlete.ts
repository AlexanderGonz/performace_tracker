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

  // Add other domain logic methods here
}