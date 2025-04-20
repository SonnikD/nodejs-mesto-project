import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import BadRequstError from '../errors/bad-request-err';

type TValidateRequst = 'body' | 'params';

const validateRequest = (schema: z.ZodSchema, type: TValidateRequst) =>
  (req: Request, res: Response, next: NextFunction) => {
    const dataType = type === 'body' ? req.body : req.params;
    const result = schema.safeParse(dataType);
    if (!result.success) {
      return next(new BadRequstError('Неверные данные в запросе'));
    }
    return next();
  };

export default validateRequest;
