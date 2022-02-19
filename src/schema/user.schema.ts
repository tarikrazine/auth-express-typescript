import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: 'First Name is required',
    }),
    lastName: string({
      required_error: 'Last Name is required',
    }),
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),
    password: string({
      required_error: 'password is required',
    }).min(6, 'Password is too short - should be min 6 chars'),
    passwordConfirm: string({
      required_error: 'passwordConfirm is required',
    }),
  }).refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  }),
});

export const verifyUserSchema = object({
  params: object({
    id: string({
      required_error: 'ID is required',
    }),
    verificationCode: string({
      required_error: 'verificationCode is required',
    }),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required',
    }),
  }),
});

export const resetPasswordSchema = object({
  params: object({
    id: string({
      required_error: 'ID is required',
    }),
    passwordResetCode: string({
      required_error: 'Password reset code is required',
    }),
  }),
  body: object({
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid Email'),
    password: string({
      required_error: 'password is required',
    }).min(6, 'Password is too short - should be min 6 chars'),
    passwordConfirm: string({
      required_error: 'passwordConfirm is required',
    }),
  }).refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  }),
});

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>['params'];

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
