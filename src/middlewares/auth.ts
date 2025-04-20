import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ERROR_CODES } from '../utils/constants';
import { ITokenPayload } from '../utils/types';

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  const { JWT_SECRET } = process.env;

  if (!token) {
    return res.status(ERROR_CODES.UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET!) as ITokenPayload;
  } catch (error) {
    return res.status(ERROR_CODES.UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  return next();
};
