import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

const validateResources =
  (schema: AnyZodObject) =>
  (request: Request, response: Response, next: NextFunction) => {
    try {
      schema.parse({
        params: request.params,
        query: request.query,
        body: request.body,
      });
      next();
    } catch (error: any) {
      return response.status(400).send(error?.errors);
    }
  };

export default validateResources;
