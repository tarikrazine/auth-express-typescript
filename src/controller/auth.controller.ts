import { Request, Response } from 'express';
import { get } from 'lodash';

import { CreateSessionInput } from '../schema/auth.schema';
import {
  findSessionById,
  signAccessToken,
  signRefreshToken,
} from '../service/auth.service';
import { findUserByEmail, findUserById } from '../service/user.service';
import { verifyJwt } from '../utils/jwt';

const message = 'Invalid email or password';

export const createSessionHandler = async (
  request: Request<{}, {}, CreateSessionInput>,
  response: Response
) => {
  const { email, password } = request.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return response.send(message);
  }

  if (!user.verified) {
    return response.send('Please verified your email');
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return response.send(message);
  }

  // sign a access token
  const accessToken = signAccessToken(user);

  // sign a refresh token

  const refreshToken = await signRefreshToken(user._id);

  return response.status(200).send({
    accessToken,
    refreshToken,
  });
};

export const refreshAccessTokenHandler = async (
  request: Request,
  response: Response
) => {
  const message = 'Could not refresh access token';

  const refreshToken = get(request, 'headers.x-refresh');

  const decoded = verifyJwt<{ session: string }>(
    refreshToken,
    'refreshTokenPublicKey'
  );

  if (!decoded) {
    return response.status(401).send(message);
  }

  const session = await findSessionById(decoded.session);

  if (!session || !session.valid) {
    return response.status(401).send(message);
  }

  const user = await findUserById(String(session.user));

  if (!user) {
    return response.status(401).send(message);
  }

  const accessToken = signAccessToken(user);

  return response.send({ accessToken });
};
