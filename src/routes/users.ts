import Router from 'express';
import {
  createUser, findAllUsers, findUserById, updateAvatarUser, updateInfoUser,
} from '../controllers/users';

const usersRouter = Router();

usersRouter.get('/users', findAllUsers);
usersRouter.post('/users', createUser);
usersRouter.get('/users/:userId', findUserById);
usersRouter.patch('/users/me/avatar', updateAvatarUser);
usersRouter.patch('/users/me', updateInfoUser);

export default usersRouter;
