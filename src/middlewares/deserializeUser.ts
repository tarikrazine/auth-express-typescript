import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';

const deserializeUser = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const accessToken = (request.headers.authorization || '').replace(
    /^Bearer\s/,
    ''
  );

  if (!accessToken) {
    return next();
  }

  const decoded = verifyJwt(accessToken, 'accessTokenPublicKey');

  if (decoded) {
    response.locals.user = decoded;
  }

  return next();
};

export default deserializeUser;
