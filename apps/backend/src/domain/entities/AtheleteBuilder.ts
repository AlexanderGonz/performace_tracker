import { Athlete } from './Athlete';
import { Metric } from './Metric';

export class AthleteBuilder {
  private id: string = '';
  private name: string = '';
  private age: number = 0;
  private team: string = '';
  private metrics: Metric[] = [];

  withId(id: string): AthleteBuilder {
    this.id = id;
    return this;
  }

  withName(name: string): AthleteBuilder {
    this.name = name;
    return this;
  }

  withAge(age: number): AthleteBuilder {
    this.age = age;
    return this;
  }

  withTeam(team: string): AthleteBuilder {
    this.team = team;
    return this;
  }

  withMetrics(metrics: Metric[]): AthleteBuilder {
    this.metrics = metrics;
    return this;
  }

  build(): Athlete {
    return new Athlete(this.id, this.name, this.age, this.team, this.metrics);
  }

  static createDefault(): Athlete {
    return new AthleteBuilder()
      .withId('default-id')
      .withName('Default Athlete')
      .withAge(25)
      .withTeam('Default Team')
      .build();
  }
}