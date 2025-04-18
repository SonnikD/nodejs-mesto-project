import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import ERROR_CODES from '../utils/constants';

export const findAllCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(ERROR_CODES.INTERNAL).send({ message: 'На сервере произошла ошибка.' });
    });
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODES.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }

      return res.status(ERROR_CODES.INTERNAL).send({ message: 'На сервере произошла ошибка.' });
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
        return res.status(ERROR_CODES.BAD_REQUEST).send({ message: 'Передан некорректный _id карточки.' });
      }

      if (error.name === 'CardNotFound') {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: error.message });
      }

      return res.status(ERROR_CODES.INTERNAL).send({ message: 'На сервере произошла ошибка.' });
    });
};

export const likeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
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
        return res.status(ERROR_CODES.BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка или некорректный _id карточки.' });
      }

      if (error.name === 'CardNotFound') {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: error.message });
      }
      return res.status(ERROR_CODES.INTERNAL).send({ message: 'На сервере произошла ошибка.' });
    });
};

export const dislikeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: new mongoose.Schema.Types.ObjectId(req.user._id) } },
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
        return res.status(ERROR_CODES.BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка или некорректный _id карточки.' });
      }

      if (error.name === 'CardNotFound') {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: error.message });
      }
      return res.status(ERROR_CODES.INTERNAL).send({ message: 'На сервере произошла ошибка.' });
    });
};
