export interface Metric {
  id: string;
  athleteId: string;
  metricType: string;
  value: number;
  unit: string;
  timestamp: Date;
}