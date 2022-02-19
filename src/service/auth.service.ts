import { DocumentType } from '@typegoose/typegoose';
import { omit } from 'lodash';

import SessionModel from '../model/session.model';
import { privateFields, User } from '../model/user.model';
import { signJwt } from '../utils/jwt';

export const createSession = (userId: string) => {
  return SessionModel.create({ user: userId });
};

export const findSessionById = (sessionId: string) => {
  return SessionModel.findById(sessionId);
};

export const signAccessToken = (user: DocumentType<User>) => {
  const payload = omit(user.toJSON(), privateFields);

  const accessToken = signJwt(payload, 'accessTokenPrivateKey', {
    expiresIn: '15m',
  });

  return accessToken;
};

export const signRefreshToken = async (userId: string) => {
  const session = await createSession(userId);

  const refreshToken = signJwt(
    {
      session: session._id,
    },
    'refreshTokenPrivateKey',
    {
      expiresIn: '1y',
    }
  );

  return refreshToken;
};
