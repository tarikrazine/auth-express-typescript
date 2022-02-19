import { Request, Response, NextFunction } from 'express';

const requireUser = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const user = response.locals.user;

  if (!user) {
    return response.sendStatus(403);
  }

  return next();
};

export default requireUser;
