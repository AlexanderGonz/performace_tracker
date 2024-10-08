import React, { Suspense, lazy } from 'react';
import { IonPage, IonButton } from '@ionic/react';
import ErrorMessage from '../components/ErrorMessage';
import PageHeader from '../components/PageHeader';
import PageContent from '../components/PageContent';
import { useAthleteForm } from '../hooks/useAthleteForm';

const FormField = lazy(() => import('../components/FormField'));

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
          <Suspense fallback={<div>Loading form fields...</div>}>
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
          </Suspense>
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