import React, { useState } from 'react';
import { IonAlert } from '@ionic/react';
import { useDeleteAthlete } from '@/app/hooks/useDeleteAthlete';
import ErrorMessage from './ErrorMessage';

interface DeleteConfirmationProps {
  athleteId: string;
  showDeleteAlert: boolean;
  setShowDeleteAlert: (show: boolean) => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ athleteId, showDeleteAlert, setShowDeleteAlert }) => {
  const { deleteAthlete, deleteError } = useDeleteAthlete();

  const handleDeleteConfirm = () => {
    deleteAthlete(athleteId);
  };

  return (
    <>
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
    </>
  );
};

export default DeleteConfirmation;