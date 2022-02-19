import express, { Request, Response, Router } from 'express';

import userRoutes from './user.routes';
import sessionRoutes from './auth.routes';

const router = express.Router();

router.get('/healthcheck', (request: Request, response: Response) => {
  response.sendStatus(200);
});

router.use('/api/users', userRoutes);

router.use('/api/sessions', sessionRoutes);

export default router;
