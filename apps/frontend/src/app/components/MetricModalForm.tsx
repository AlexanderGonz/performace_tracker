import React from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from '@ionic/react';
import ErrorMessage from './ErrorMessage';
import MetricForm from './MetricForm';
import { useMetricFormAndSubmission } from '../hooks/useMetricFormAndSubmission';

interface MetricModalProps {
  athleteId: string;
  isOpen: boolean;
  onClose: () => void;
}

const MetricModalForm: React.FC<MetricModalProps> = ({ athleteId, isOpen, onClose }) => {
  const {
    formData,
    handleChange,
    submitForm,
    isPending,
    error,
  } = useMetricFormAndSubmission(athleteId, onClose); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add New Metric</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={handleSubmit}>
          <MetricForm formData={formData} onChange={handleChange} />
          <IonButton expand="block" type="submit" disabled={isPending}>
            {isPending ? 'Adding...' : 'Add Metric'}
          </IonButton>
        </form>
        {error && <ErrorMessage message={(error as Error).message} />}
      </IonContent>
    </IonModal>
  );
};

export default MetricModalForm;