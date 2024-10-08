import React, { useState, Suspense, lazy } from 'react';
import { IonPage, useIonViewWillEnter } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import ErrorMessage from '../components/ErrorMessage';
import { useAthlete } from '../hooks/useAthlete';
import PageHeader from '../components/PageHeader';
import PageContent from '../components/PageContent';
import AthleteCard from '../components/AthleteCard';
import MetricsSection from '../components/MetricsSection';

const MetricModalForm = lazy(() => import('../components/MetricModalForm'));
const DeleteConfirmation = lazy(() => import('../components/DeleteConfirmation'));

const AthleteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: athlete, isLoading, error, refetch } = useAthlete(id);
  const openForm = () => setIsModalOpen(true);
  const closeForm = () => setIsModalOpen(false);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);

  useIonViewWillEnter(() => {
    queryClient.invalidateQueries({ queryKey: ['athlete', id] });
    refetch();
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <ErrorMessage message={(error as Error).message} />;
  if (!athlete) return <div>Athlete not found</div>;

  return (
    <IonPage>
      <PageHeader title="Athlete Details" />
      <PageContent>
        <AthleteCard 
          athlete={athlete} 
          editAthleteId={id}
          onDelete={() => setShowDeleteAlert(true)} 
        />
        <MetricsSection metrics={athlete.metrics} onAddMetric={openForm} />
        <Suspense fallback={<div>Loading form...</div>}>
          <MetricModalForm 
            athleteId={id} 
            isOpen={isModalOpen} 
            onClose={closeForm}
          />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <DeleteConfirmation 
            athleteId={id}  
            showDeleteAlert={showDeleteAlert}
            setShowDeleteAlert={setShowDeleteAlert}
          />
        </Suspense>
      </PageContent>
    </IonPage>
  );
};

export default AthleteDetail;