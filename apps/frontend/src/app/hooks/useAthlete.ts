import { useQuery } from '@tanstack/react-query';
import { getAthlete } from '../services/api';
import { Athlete } from '../../domain/models/Athlete';

export const useAthlete = (id: string) => {
  return useQuery<Athlete, Error>({
    queryKey: ['athlete', id],
    queryFn: () => getAthlete(id),
  });
};