import React from 'react';
import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useIonRouter } from '@ionic/react';

interface FloatingAddButtonProps {
  routePath: string;
}

const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ routePath }) => {
  const router = useIonRouter();

  const handleClick = () => {
    router.push(routePath);
  };

  return (
    <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ bottom: '80px', right: '40px' }}>
      <IonFabButton onClick={handleClick}>
        <IonIcon icon={add} />
      </IonFabButton>
    </IonFab>
  );
};

export default FloatingAddButton;