export interface Metric {
  id: string;
  athleteId: string;
  metricType: string;
  value: number;
  unit: string;
  timestamp: Date;
}

export interface MetricFormData {
  metricType: string;
  value: number;
  unit: string;
}

export interface MetricViewModel {
  id: string;
  metricType: string;
  value: number;
  unit: string;
  timestamp: Date;
}
