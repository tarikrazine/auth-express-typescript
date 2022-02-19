import express from 'express';

import {
  createSessionHandler,
  refreshAccessTokenHandler,
} from '../controller/auth.controller';
import validateResources from '../middlewares/validateResources';
import { createSessionSchema } from '../schema/auth.schema';

const router = express.Router();

router.post('/', validateResources(createSessionSchema), createSessionHandler);

router.post('/refresh', refreshAccessTokenHandler);
export default router;
