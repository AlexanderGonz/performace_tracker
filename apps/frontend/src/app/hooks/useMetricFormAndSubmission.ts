import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMetric } from '../services/api';
import { Metric } from '../../domain/models/Metric';

interface MetricFormData {
  metricType: string;
  value: string;
  unit: string;
}

export const useMetricFormAndSubmission = (athleteId: string, onClose: () => void) => {
  const [formData, setFormData] = useState<MetricFormData>({
    metricType: '',
    value: '',
    unit: '',
  });

  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: Omit<Metric, 'id' | 'athleteId'>) => createMetric(athleteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athlete', athleteId] });
      resetForm();
      onClose();
    },
  });

  const handleChange = (field: keyof MetricFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      metricType: '',
      value: '',
      unit: '',
    });
  };

  const submitForm = () => {
    mutate({
      metricType: formData.metricType,
      value: parseFloat(formData.value),
      unit: formData.unit,
      timestamp: new Date(),
    });
  };

  return {
    formData,
    handleChange,
    resetForm,
    submitForm,
    isPending,
    error,
  };
};