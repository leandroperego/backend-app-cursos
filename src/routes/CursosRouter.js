import { Router } from 'express';

import CursosController from '../controllers/CursosController.js';
import isAuth from '../utils/middlewares/isAuth.js';

const router = Router();

router.get('/', CursosController.show);
router.post('/:id', isAuth, CursosController.handleMatriculas);

export default router;