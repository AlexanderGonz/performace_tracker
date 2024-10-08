import React from 'react';
import { IonInput, IonLabel, IonItem } from '@ionic/react';
import { FieldError, UseFormRegister } from 'react-hook-form';
import { AthleteFormData } from '../../domain/models/Athlete';

interface FormFieldProps {
  name: keyof AthleteFormData;
  label: string;
  type: 'text' | 'number' | 'email' | 'password';
  register: UseFormRegister<AthleteFormData>;
  error?: FieldError;
}

const FormField: React.FC<FormFieldProps> = ({ name, label, type, register, error }) => {
  return (
    <IonItem>
      <IonLabel position="floating">{label}</IonLabel>
      <IonInput type={type} {...register(name)} />
      {error && <div className="ion-error">{error.message}</div>}
    </IonItem>
  );
};

export default FormField;