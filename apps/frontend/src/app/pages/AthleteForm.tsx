import React from 'react';
import { IonPage, IonButton } from '@ionic/react';
import ErrorMessage from '../components/ErrorMessage';
import PageHeader from '../components/PageHeader';
import PageContent from '../components/PageContent';
import FormField from '../components/FormField';
import { FieldError } from 'react-hook-form';
import { useAthleteForm } from '../hooks/useAthleteForm';
import { AthleteFormData } from '../../domain/models/Athlete';

const AthleteForm: React.FC = () => {
  const {
    id,
    isLoading,
    register,
    handleSubmit,
    errors,
    formFields,
    onSubmit,
    isSubmitting,
    error,
  } = useAthleteForm();

  if (id && isLoading) return <div>Loading...</div>;

  return (
    <IonPage>
      <PageHeader title={id ? 'Edit Athlete' : 'Create Athlete'} />
      <PageContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {formFields.map((field) => (
            <FormField
              key={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              register={register}
              error={errors[field.name]}
            />
          ))}
          <IonButton expand="block" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Athlete'}
          </IonButton>
          {error && <ErrorMessage message={(error as Error).message || 'An error occurred'} />}
        </form>
      </PageContent>
    </IonPage>
  );
};

export default AthleteForm;