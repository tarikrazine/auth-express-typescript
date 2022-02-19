import { Request, Response } from 'express';
import { nanoid } from 'nanoid';

import {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from '../schema/user.schema';
import {
  createUser,
  findUserById,
  findUserByEmail,
} from '../service/user.service';
import log from '../utils/logger';
import sendEmail from '../utils/mailer';

const message =
  'If a user with that email is registered you will receive a password reset email';

export const createUserHandler = async (
  request: Request<{}, {}, CreateUserInput>,
  response: Response
) => {
  try {
    const user = await createUser(request.body);

    await sendEmail({
      to: user.email,
      from: 'test@example.com',
      subject: 'Verify your email',
      text: `verification code: ${user.verificationCode}. Id: ${user._id}
      Click below to verify
      http://localhost:1337/api/users/verify/${user._id}/${user.verificationCode}
      `,
    });

    return response.status(201).send('User successfully created');
  } catch (error: any) {
    if (error.code === 11000) {
      return response.status(409).send('Account already exists');
    }

    return response.status(500).send(error);
  }
};

export const verifyUserHandler = async (
  request: Request<VerifyUserInput>,
  response: Response
) => {
  const { id, verificationCode } = request.params;

  // find the user by id
  const user = await findUserById(id);

  if (!user) {
    return response.send('Could not verify user');
  }

  // check to see if they are already verified
  if (user.verified) {
    return response.send('User already verified');
  }

  // check to see if they are already verified
  if (user.verificationCode === verificationCode) {
    user.verified = true;

    await user.save();

    return response.status(200).send('User verified with success');
  }

  return response.send('Could not verify user');
};

export const forgotPasswordHandler = async (
  request: Request<{}, {}, ForgotPasswordInput>,
  response: Response
) => {
  const { email } = request.body;

  const user = await findUserByEmail(email);

  if (!user) {
    log.debug(`User with email ${email} does not exists`);
    return response.send(message);
  }

  if (!user.verified) {
    return response.send('User not verified');
  }

  const passwordResetCode = nanoid();

  user.passwordResetCode = passwordResetCode;

  await user.save();

  await sendEmail({
    to: user.email,
    from: 'test@example.com',
    subject: 'Reset your password',
    text: `Password reset code: ${passwordResetCode}. Id ${user._id}
    Click below to verify
    http://localhost:1337/api/users/resetpassword/${user._id}/${user.passwordResetCode}`,
  });

  log.debug(`Password reset email sent to ${email}`);

  return response.send(message);
};

export const resetPasswordHandler = async (
  request: Request<
    ResetPasswordInput['params'],
    {},
    ResetPasswordInput['body']
  >,
  response: Response
) => {
  const { id, passwordResetCode } = request.params;
  const { email, password } = request.body;

  const user = await findUserById(id);

  if (!user) {
    log.debug(`User with email ${email} does not exists`);
    return response.send(message);
  }

  if (!user.verified) {
    return response.send('User not verified');
  }

  if (!user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
    return response.status(400).send('Could not reset user password');
  }

  user.passwordResetCode = null;

  user.password = password;

  await user.save();

  return response.send('Successfully updated password');
};

export const getCurrentUserHandler = (request: Request, response: Response) => {
  return response.send(response.locals.user);
};
