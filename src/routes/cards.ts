import { Router } from 'express';
import {
  createCard, deleteCard, dislikeCard, findAllCards, likeCard,
} from '../controllers/cards';

const cardsRouter = Router();

cardsRouter.get('/cards', findAllCards);
cardsRouter.post('/cards', createCard);
cardsRouter.delete('/cards/:cardId', deleteCard);
cardsRouter.put('/cards/:cardId/likes', likeCard);
cardsRouter.delete('/cards/:cardId/likes', dislikeCard);

export default cardsRouter;
