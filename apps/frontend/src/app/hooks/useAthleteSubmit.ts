import { useIonRouter } from '@ionic/react';
import { AthleteFormData } from '../../domain/models/Athlete';
import { useCreateAthlete, useUpdateAthlete } from './useAthleteForm';
import { useQueryClient } from '@tanstack/react-query';

export const useAthleteSubmit = (athleteId?: string) => {
  const router = useIonRouter();
  const queryClient = useQueryClient();
  const createAthleteMutation = useCreateAthlete();
  const updateAthleteMutation = athleteId ? useUpdateAthlete(athleteId) : null;

  const submitAthlete = async (data: AthleteFormData) => {
    const formattedData = {
      ...data,
      age: Number(data.age)
    };

    try {
      if (athleteId) {
        await updateAthleteMutation?.mutateAsync(formattedData);
      } else {
        await createAthleteMutation.mutateAsync(formattedData);
      }
      console.log('Athlete saved successfully, invalidating queries and navigating...');
      await queryClient.invalidateQueries({ queryKey: ['athletes'] });
      router.push('/athletes', 'root', 'replace');
    } catch (error) {
      console.error('Failed to save athlete:', error);
    }
  };

  return {
    submitAthlete,
    isSubmitting: createAthleteMutation.isPending || updateAthleteMutation?.isPending,
    error: createAthleteMutation.error || updateAthleteMutation?.error,
  };
};