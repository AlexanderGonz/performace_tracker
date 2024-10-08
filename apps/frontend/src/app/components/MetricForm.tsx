import React from 'react';
import {
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
} from '@ionic/react';

interface MetricFormData {
  metricType: string;
  value: string;
  unit: string;
}

interface MetricFormProps {
  formData: MetricFormData;
  onChange: (field: keyof MetricFormData, value: string) => void;
}

const MetricForm: React.FC<MetricFormProps> = ({ formData, onChange }) => {
  return (
    <>
      <IonItem>
        <IonLabel position="floating">Metric Type</IonLabel>
        <IonSelect
          value={formData.metricType}
          onIonChange={e => onChange('metricType', e.detail.value)}
        >
          <IonSelectOption value="weight">Weight</IonSelectOption>
          <IonSelectOption value="height">Height</IonSelectOption>
          <IonSelectOption value="speed">Speed</IonSelectOption>
        </IonSelect>
      </IonItem>
      <IonItem>
        <IonLabel position="floating">Value</IonLabel>
        <IonInput
          type="number"
          value={formData.value}
          onIonChange={e => onChange('value', e.detail.value!)}
          required
        />
      </IonItem>
      <IonItem>
        <IonLabel position="floating">Unit</IonLabel>
        <IonInput
          type="text"
          value={formData.unit}
          onIonChange={e => onChange('unit', e.detail.value!)}
          required
        />
      </IonItem>
    </>
  );
};

export default MetricForm;