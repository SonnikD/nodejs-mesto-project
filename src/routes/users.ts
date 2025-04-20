import Router from 'express';
import {
  findAllUsers, findUserById, getUserInfo, updateAvatarUser, updateInfoUser,
} from '../controllers/users';
import validateRequest from '../middlewares/validateRequest';
import { updateAvatarUserSchema, updateInfoUserSchema, userIdParamSchema } from '../schemas/userSchema';

const usersRouter = Router();

usersRouter.get('/users', findAllUsers);
usersRouter.get('/users/:userId', validateRequest(userIdParamSchema, 'params'), findUserById);
usersRouter.patch('/users/me/avatar', validateRequest(updateAvatarUserSchema, 'body'), updateAvatarUser);
usersRouter.patch('/users/me', validateRequest(updateInfoUserSchema, 'body'), updateInfoUser);
usersRouter.get('/users/me', getUserInfo);

export default usersRouter;
