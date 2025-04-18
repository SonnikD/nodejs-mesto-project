import { Request, Response } from 'express';
import User from '../models/user';
import ERROR_CODES from '../utils/constants';

export const findAllUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => res.status(ERROR_CODES.INTERNAL).send({ message: 'На сервере произошла ошибка' }));
};

export const findUserById = (req: Request, res: Response) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const err = new Error('Пользователь по указанному _id не найден.');
        err.name = 'UserNotFound';
        return Promise.reject(err);
      }

      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'UserNotFound') {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: error.message });
      }

      if (error.name === 'CastError') {
        return res.status(ERROR_CODES.BAD_REQUEST).send({ message: 'Передан некорректный _id пользователя.' });
      }

      return res.status(ERROR_CODES.INTERNAL).send({ message: 'На сервере произошла ошибка.' });
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))

    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODES.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }

      return res.status(ERROR_CODES.INTERNAL).send({ message: 'На сервере произошла ошибка.' });
    });
};

export const updateInfoUser = (req: Request, res: Response) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about }, {
    new: true,
    runValidators: true,
  }).then((user) => {
    if (!user) {
      const err = new Error('Пользователь с указанным _id не найден.');
      err.name = 'UserNotFound';
      return Promise.reject(err);
    }

    return res.status(200).send(user);
  })
    .catch((error) => {
      if (error.name === 'UserNotFound') {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: error.message });
      }

      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODES.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }

      return res.status(ERROR_CODES.INTERNAL).send({ message: 'На сервере произошла ошибка.' });
    });
};

export const updateAvatarUser = (req: Request, res: Response) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, {
    new: true,
    runValidators: true,
  }).then((user) => {
    if (!user) {
      const err = new Error('Пользователь с указанным _id не найден.');
      err.name = 'UserNotFound';
      return Promise.reject(err);
    }

    return res.status(200).send(user);
  })
    .catch((error) => {
      if (error.name === 'UserNotFound') {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: error.message });
      }

      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODES.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }

      return res.status(ERROR_CODES.INTERNAL).send({ message: 'На сервере произошла ошибка.' });
    });
};
