import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { pencil, add, trash } from 'ionicons/icons';

type IconType = 'edit' | 'add' | 'remove';

interface ActionButtonProps {
  onClick?: () => void;
  label?: string;
  iconType?: IconType;
  routerLink?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, label, iconType, routerLink }) => {
  const getIcon = (type: IconType) => {
    switch (type) {
      case 'edit':
        return pencil;
      case 'add':
        return add;
      case 'remove':
        return trash;
      default:
        return undefined;
    }
  };

  const icon = iconType ? getIcon(iconType) : undefined;

  return (
    <IonButton size="small" color={iconType == 'remove' ? 'danger' : "primary"} onClick={onClick} routerLink={routerLink}>
      {icon && <IonIcon icon={icon} style={{ marginRight: '5px' }} />}
      {label && label}
    </IonButton>
  );
};

export default ActionButton;