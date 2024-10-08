export class Metric {
  constructor(
    public id: string,
    public athleteId: string,
    public metricType: string,
    public value: number,
    public unit: string,
    public timestamp: Date
  ) {}
}