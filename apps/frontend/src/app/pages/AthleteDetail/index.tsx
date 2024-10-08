import React, { useMemo } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, useIonViewWillEnter, IonButton, IonItem, useIonRouter, IonAlert } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import ErrorMessage from '../../components/ErrorMessage';
import { useAthlete } from '../../hooks/useAthleteForm';
import Metric from '../../components/Metric';
import { useMetricForm } from '../../hooks/useMetricForm';
import MetricModalForm from '../../components/MetricModalForm';
import ActionButton from '../../components/ActionButton';
import { useDeleteAthlete } from '@/app/hooks/useDeleteAthlete';
import { MetricFormData } from '@/domain/models/Metric';
import HomeButton from '@/app/components/HomeButton';

const AthleteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ionRouter = useIonRouter();
  const queryClient = useQueryClient();
  const { data: athlete, isLoading, error, refetch } = useAthlete(id);
  const { isOpen, openForm, closeForm, createMetric, isPending, error: errorMetricForm } = useMetricForm(id);
  const { deleteAthlete, deleteError } = useDeleteAthlete();
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);


  useIonViewWillEnter(() => {
    queryClient.invalidateQueries({ queryKey: ['athlete', id] });
    refetch();
  });

  const cardColor = useMemo(() => {
    if (!athlete) return 'primary';
    const hash = athlete.name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 80%)`;
  }, [athlete]);

  const handleSubmit = async (data: MetricFormData) => {
    try {
      await createMetric({
        ...data,
        timestamp: new Date(),
      });
      closeForm()
    } catch (error) {
      console.error('Error creating metric:', error);
    }
  };

  const navigateToEditForm = () => {
    ionRouter.push(`/athletes/${id}/edit`);
  };

  const handleDeleteClick = () => {
    setShowDeleteAlert(true);
  };

  const handleDeleteConfirm = () => {
    deleteAthlete(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <ErrorMessage message={(error as Error).message} />;
  if (!athlete) return <div>Athlete not found</div>;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IonTitle>Athlete Details</IonTitle>
          <HomeButton />
        </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard style={{ backgroundColor: cardColor }}>
        <IonCardHeader>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <IonCardTitle>{athlete.name}</IonCardTitle>
              <div>
                <ActionButton onClick={navigateToEditForm} iconType="edit" />
                <ActionButton onClick={handleDeleteClick} iconType="remove" />
              </div>
            </div>
          </IonCardHeader>
          <IonCardContent>
            <p>Age: {athlete.age}</p>
            <p>Team: {athlete.team}</p>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <IonCardTitle>Metrics</IonCardTitle>
              <ActionButton onClick={openForm} iconType="add" />
            </div>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {athlete.metrics.length > 0 ? (
                athlete.metrics.map((metric) => (
                  <Metric key={metric.id} metric={metric} />
                ))
              ) : (
                <p>No metrics available</p>
              )}
            </IonList>
          </IonCardContent>
        </IonCard>
        <MetricModalForm
          isOpen={isOpen}
          onClose={closeForm}
          onSubmit={handleSubmit}
          isLoading={isPending}
          error={errorMetricForm}
        />
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Confirm Delete"
          message="Are you sure you want to delete this athlete?"
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Delete',
              handler: handleDeleteConfirm,
            },
          ]}
        />
        {deleteError && <ErrorMessage message={(deleteError as Error).message} />}
      </IonContent>
    </IonPage>
  );
};

export default AthleteDetail;