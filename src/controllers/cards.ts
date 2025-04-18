import { Request, Response } from 'express';
import Card from '../models/card';

const ERROR_CODE = 400;
const INTERNAL_SERVER_CODE = 500;
const NOT_FOUND_CODE = 404;

export const findAllCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_CODE).send({ message: 'На сервере произошла ошибка.' });
    });
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;

  Card.create({ name, link })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }

      return res.status(INTERNAL_SERVER_CODE).send({ message: 'На сервере произошла ошибка.' });
    });
};

export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        const err = new Error('Карточка с указанным _id не найдена.');
        err.name = 'CardNotFound';
        return Promise.reject(err);
      }

      return res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Передан некорректный _id карточки.' });
      }

      if (error.name === 'CardNotFound') {
        return res.status(NOT_FOUND_CODE).send({ message: error.message });
      }

      return res.status(INTERNAL_SERVER_CODE).send({ message: 'На сервере произошла ошибка.' });
    });
};

export const likeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: (req as any).user._id } }, // временно тип any, чтобы TS не ругался
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const err = new Error('Передан несуществующий _id карточки.');
        err.name = 'CardNotFound';
        return Promise.reject(err);
      }

      return res.status(200).send(card);
    }).catch((error) => {
      if (error.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка или некорректный _id карточки.' });
      }

      if (error.name === 'CardNotFound') {
        return res.status(NOT_FOUND_CODE).send({ message: error.message });
      }
      return res.status(INTERNAL_SERVER_CODE).send({ message: 'На сервере произошла ошибка.' });
    });
};

export const dislikeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: (req as any).user._id } }, // временно тип any, чтобы TS не ругался
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const err = new Error('Передан несуществующий _id карточки.');
        err.name = 'CardNotFound';
        return Promise.reject(err);
      }

      return res.status(200).send(card);
    }).catch((error) => {
      if (error.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка или некорректный _id карточки.' });
      }

      if (error.name === 'CardNotFound') {
        return res.status(NOT_FOUND_CODE).send({ message: error.message });
      }
      return res.status(INTERNAL_SERVER_CODE).send({ message: 'На сервере произошла ошибка.' });
    });
};
