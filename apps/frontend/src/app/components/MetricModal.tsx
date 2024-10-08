import React, { useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
} from '@ionic/react';
import ErrorMessage from './ErrorMessage';

interface MetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { metricType: string; value: number; unit: string }) => void;
  isLoading: boolean;
  error: Error | null;
}

const MetricModal: React.FC<MetricModalProps> = ({ isOpen, onClose, onSubmit, isLoading, error }) => {
  const [metricType, setMetricType] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      metricType,
      value: parseFloat(value),
      unit,
    });
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
          <IonItem>
            <IonLabel position="floating">Metric Type</IonLabel>
            <IonSelect value={metricType} onIonChange={e => setMetricType(e.detail.value)}>
              <IonSelectOption value="weight">Weight</IonSelectOption>
              <IonSelectOption value="height">Height</IonSelectOption>
              <IonSelectOption value="speed">Speed</IonSelectOption>
              {/* Add more metric types as needed */}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Value</IonLabel>
            <IonInput type="number" value={value} onIonChange={e => setValue(e.detail.value!)} required />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Unit</IonLabel>
            <IonInput type="text" value={unit} onIonChange={e => setUnit(e.detail.value!)} required />
          </IonItem>
          <IonButton expand="block" type="submit" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Metric'}
          </IonButton>
        </form>
        {error && <ErrorMessage message={error.message} />}
      </IonContent>
    </IonModal>
  );
};

export default MetricModal;