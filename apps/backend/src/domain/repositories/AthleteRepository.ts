import { Athlete } from "../entities/Athlete";
import { Metric } from "../entities/Metric";

export interface AthleteRepository {
  findAll(): Promise<Athlete[]>;
  findById(id: string): Promise<Athlete | null>;
  save(athlete: Athlete): Promise<void>;
  delete(id: string): Promise<void>;
}