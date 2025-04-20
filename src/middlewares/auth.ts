import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ERROR_CODES } from '../utils/constants';
import { ITokenPayload } from '../utils/types';

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(ERROR_CODES.UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'secret-some-key') as ITokenPayload;
  } catch (error) {
    return res.status(ERROR_CODES.UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  return next();
};
