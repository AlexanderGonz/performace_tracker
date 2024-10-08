import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { home } from 'ionicons/icons';
import { useIonRouter } from '@ionic/react';

interface HomeButtonProps {
  label?: string;
}

const HomeButton: React.FC<HomeButtonProps> = ({ label }) => {
  const router = useIonRouter();

  const handleClick = () => {
    router.push('/home');
  };

  return (
    <IonButton size="small" color="light" onClick={handleClick}>
      <IonIcon icon={home} style={{ marginRight: '5px' }} />
      {label || 'Home'}
    </IonButton>
  );
};

export default HomeButton;