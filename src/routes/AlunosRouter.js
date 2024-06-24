import { Router } from 'express';
import AlunosController from '../controllers/AlunosController.js';

const router = Router();

router.post('/', AlunosController.store);

export default router;