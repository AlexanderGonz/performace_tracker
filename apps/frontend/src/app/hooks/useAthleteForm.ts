import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useIonRouter } from '@ionic/react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createAthlete, updateAthlete, getAthlete } from '../services/api';
import { Athlete, AthleteFormData } from '../../domain/models/Athlete';

export const useAthleteForm = () => {
  const { id } = useParams<{ id: string }>();
  const router = useIonRouter();
  const queryClient = useQueryClient();

  const { data: athlete, isLoading } = useQuery<Athlete, Error>({
    queryKey: ['athlete', id],
    queryFn: () => getAthlete(id),
    enabled: !!id,
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AthleteFormData>();

  useEffect(() => {
    if (athlete) reset(athlete);
  }, [athlete, reset]);

  const mutation = useMutation({
    mutationFn: (data: AthleteFormData) => id ? updateAthlete(id, data) : createAthlete(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ['athlete', id] });
        router.goBack();
      } else {
        router.push(`/athletes/${data.id}`, 'root', 'replace');
      }
    },
  });

  const onSubmit = (data: AthleteFormData) => {
    mutation.mutate({ ...data, age: Number(data.age) });
  };

  const formFields: Array<{
    name: keyof AthleteFormData;
    label: string;
    type: 'text' | 'number';
    validation: any; // You might want to define a more specific type for validation
  }> = [
    { name: 'name', label: 'Name', type: 'text', validation: { required: 'Name is required' } },
    { name: 'age', label: 'Age', type: 'number', validation: { required: 'Age is required', min: { value: 0, message: 'Age must be positive' } } },
    { name: 'team', label: 'Team', type: 'text', validation: { required: 'Team is required' } },
  ];

  return {
    id,
    isLoading,
    register,
    handleSubmit,
    errors,
    formFields,
    onSubmit,
    isSubmitting: mutation.isPending,
    error: mutation.error,
  };
};