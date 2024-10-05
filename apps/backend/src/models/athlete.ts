export interface Metric {
  athleteId: string;
  metricType: string;
  value: number;
  unit: string;
}

export interface Athlete {
  id: string;
  name: string;
  age: number;
  sport: string;
  metrics: Metric[];
}