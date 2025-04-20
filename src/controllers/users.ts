import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ConflictError from '../errors/conflict-err';
import User from '../models/user';
import { ERROR_CODES } from '../utils/constants';
import NotFoundError from '../errors/not-found-err';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
      };
    }
  }
}

export const findAllUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

export const findUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }

      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(ERROR_CODES.BAD_REQUEST).send({ message: 'Передан некорректный _id пользователя.' });
      }

      return next(error);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(201).send({
      name, about, avatar, email,
    }))

    .catch((error) => {
      if (error.code === 11000) {
        throw new ConflictError('Пользователь с такой почтой уже существует.');
      }
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODES.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }

      return next(error);
    });
};

export const updateInfoUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user!._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about }, {
    new: true,
    runValidators: true,
  }).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь с указанным _id не найден.');
    }

    return res.status(200).send(user);
  })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODES.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }

      return next(error);
    });
};

export const updateAvatarUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user!._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, {
    new: true,
    runValidators: true,
  }).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь с указанным _id не найден.');
    }

    return res.status(200).send(user);
  })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODES.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }

      return next(error);
    });
};

export const login = ((req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      });
    })
    .catch(next);
});

export const getUserInfo = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user!._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }

      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(ERROR_CODES.BAD_REQUEST).send({ message: 'Передан некорректный _id пользователя.' });
      }

      return next(error);
    });
};
