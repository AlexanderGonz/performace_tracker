import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import ActionButton from './ActionButton';
import { MetricViewModel } from '../../domain/models/Metric';
import MetricsList from './MetricsList';


interface MetricsSectionProps {
  metrics: MetricViewModel[];
  onAddMetric: () => void;
  renderMetric?: (metric: MetricViewModel) => React.ReactNode;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ 
  metrics, 
  onAddMetric, 
  renderMetric 
}) => {
  return (
    <IonCard>
      <IonCardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IonCardTitle>Metrics</IonCardTitle>
          <ActionButton onClick={onAddMetric} iconType="add" />
        </div>
      </IonCardHeader>
      <IonCardContent>
        <MetricsList metrics={metrics} renderMetric={renderMetric} />
      </IonCardContent>
    </IonCard>
  );
};

export default MetricsSection;