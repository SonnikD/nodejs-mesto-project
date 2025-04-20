import { z } from 'zod';
import { idRegex, urlRegex } from '../utils/constants';

export const createCardSchema = z.object({
  name: z.string().min(2).max(30),
  link: z.string().regex(urlRegex),
});

export const cardIdParamSchema = z.object({
  cardId: z.string().min(24).max(24).regex(idRegex),
});
