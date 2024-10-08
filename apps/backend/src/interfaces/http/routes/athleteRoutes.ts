import { MetricController } from '../controllers/MetricController';
import { AthleteController } from '../controllers/AthleteController';
import { Hono } from 'hono';



export const createAthleteRoutes = (athleteController: AthleteController, metricController: MetricController) => {
  const router = new Hono();

  router.get('/', (c) => athleteController.getAllAthletes(c));
  router.post('/', (c) => athleteController.createAthlete(c));
  router.get('/:id', (c) => athleteController.getAthleteById(c));
  router.put('/:id', (c) => athleteController.updateAthlete(c));
  router.delete('/:id', (c) => athleteController.deleteAthlete(c));

  router.post('/:athleteId/metrics', (c) => metricController.addMetric(c));
  router.get('/:athleteId/metrics', (c) => metricController.getMetrics(c));

  return router;
};