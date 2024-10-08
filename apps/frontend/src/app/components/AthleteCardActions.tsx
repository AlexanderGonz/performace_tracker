import React from 'react';
import ActionButton from './ActionButton';

interface AthleteCardActionsProps {
  editAthleteId: string;
  onDelete: () => void;
}

export const AthleteCardActions: React.FC<AthleteCardActionsProps> = ({ editAthleteId, onDelete }) => (
  <div>
    <ActionButton iconType="edit" routerLink={`/athletes/${editAthleteId}/edit`} />
    <ActionButton onClick={onDelete} iconType="remove" />
  </div>
);