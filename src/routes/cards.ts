import { Router } from 'express';
import {
  createCard, deleteCard, dislikeCard, findAllCards, likeCard,
} from '../controllers/cards';
import validateRequest from '../middlewares/validateRequest';
import { cardIdParamSchema, createCardSchema } from '../schemas/cardSchema';

const cardsRouter = Router();

cardsRouter.get('/cards', findAllCards);
cardsRouter.post('/cards', validateRequest(createCardSchema, 'body'), createCard);
cardsRouter.delete('/cards/:cardId', validateRequest(cardIdParamSchema, 'params'), deleteCard);
cardsRouter.put('/cards/:cardId/likes', validateRequest(cardIdParamSchema, 'params'), likeCard);
cardsRouter.delete('/cards/:cardId/likes', validateRequest(cardIdParamSchema, 'params'), dislikeCard);

export default cardsRouter;
