import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createAthlete, updateAthlete, getAthlete } from '../services/api';
import { Athlete, AthleteFormData } from '../../domain/models/Athlete';

export const useCreateAthlete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AthleteFormData) => createAthlete(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] });
    },
    onError: (error) => {
      throw new Error('Failed to create athlete');
    },
  });
};

export const useUpdateAthlete = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AthleteFormData) => updateAthlete(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] });
      queryClient.invalidateQueries({ queryKey: ['athlete', id] });
    },
  });
};

export const useAthlete = (id: string) => {
  return useQuery<Athlete, Error>({
    queryKey: ['athlete', id],
    queryFn: () => getAthlete(id),
  });
};