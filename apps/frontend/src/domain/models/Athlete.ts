import { Metric } from "@prisma/client";

export interface Athlete {
  id: string;
  name: string;
  age: number;
  team: string;
  metrics: Metric[];
}

export type AthleteFormData = Omit<Athlete, 'id'|'metrics'>;