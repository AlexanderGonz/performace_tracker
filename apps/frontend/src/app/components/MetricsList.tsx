import React from 'react';
import { IonList } from '@ionic/react';
import MetricItem from './MetricItem';
import { MetricViewModel } from '../../domain/models/Metric';

interface MetricsListProps {
  metrics: MetricViewModel[];
  renderMetric?: (metric: MetricViewModel) => React.ReactNode;
}

const MetricsList: React.FC<MetricsListProps> = ({ metrics, renderMetric }) => {
  if (metrics.length === 0) {
    return <p>No metrics available</p>;
  }

  return (
    <IonList>
      {metrics.map((metric) => (
        <React.Fragment key={metric.id}>
          {renderMetric ? renderMetric(metric) : <MetricItem metric={metric} />}
        </React.Fragment>
      ))}
    </IonList>
  );
};

export default MetricsList;