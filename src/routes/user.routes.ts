import express from 'express';

import {
  createUserHandler,
  verifyUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  getCurrentUserHandler,
} from '../controller/user.controller';
import requireUser from '../middlewares/requireUser';
import validateResources from '../middlewares/validateResources';
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from '../schema/user.schema';

const router = express.Router();

router.post('/', validateResources(createUserSchema), createUserHandler);

router.get('/me', requireUser, getCurrentUserHandler);

router.post(
  '/verify/:id/:verificationCode',
  validateResources(verifyUserSchema),
  verifyUserHandler
);

router.post(
  '/forgotpassword',
  validateResources(forgotPasswordSchema),
  forgotPasswordHandler
);

router.post(
  '/resetpassword/:id/:passwordResetCode',
  validateResources(resetPasswordSchema),
  resetPasswordHandler
);

export default router;
