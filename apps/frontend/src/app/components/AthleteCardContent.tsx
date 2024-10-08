import React from 'react';
import { Athlete } from '@/domain/models/Athlete';

interface AthleteCardContentProps {
  athlete: Athlete;
}

export const AthleteCardContent: React.FC<AthleteCardContentProps> = ({ athlete }) => (
  <>
    <p>Age: {athlete.age}</p>
    <p>Team: {athlete.team}</p>
  </>
);