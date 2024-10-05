import { Hono } from 'hono';
import { 
  createAthlete, 
  getAllAthletes, 
  getAthleteById, 
  updateAthlete, 
  addMetric, 
  getMetrics, 
  deleteAthlete 
} from '../controllers/athleteController';

const router = new Hono();

router.post('/', createAthlete);
router.get('/', getAllAthletes);
router.get('/:id', getAthleteById);
router.put('/:id', updateAthlete);
router.post('/:id/metrics', addMetric);
router.get('/:id/metrics', getMetrics);
router.delete('/:id', deleteAthlete);

export { router as athleteRoutes };