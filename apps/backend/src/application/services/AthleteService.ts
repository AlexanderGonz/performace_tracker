import { Athlete } from '../../domain/entities/Athlete';
import { AthleteRepository } from '../../domain/repositories/AthleteRepository';
import { Metric } from '../../domain/entities/Metric';


export class AthleteService {
  constructor(private athleteRepository: AthleteRepository) {}

  async getAllAthletes(): Promise<Athlete[]> {
    return this.athleteRepository.findAll();
  }

  async getAthleteById(id: string): Promise<Athlete | null> {
    return this.athleteRepository.findById(id);
  }

  async createAthlete(athleteData: Omit<Athlete, 'id'>): Promise<Athlete> {
    const newAthlete = new Athlete(
      Date.now().toString(), // Generate a unique ID
      athleteData.name,
      athleteData.age,
      athleteData.team
    );
    await this.athleteRepository.save(newAthlete);
    return newAthlete;
  }

  async updateAthlete(id: string, athleteData: Partial<Athlete>): Promise<Athlete | null> {
    const existingAthlete = await this.athleteRepository.findById(id);
    if (!existingAthlete) return null;

    Object.assign(existingAthlete, athleteData);
    await this.athleteRepository.save(existingAthlete);
    return existingAthlete;
  }

  async deleteAthlete(id: string): Promise<void> {
    await this.athleteRepository.delete(id);
  }
}