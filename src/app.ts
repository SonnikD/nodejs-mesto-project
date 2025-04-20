import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { errorLogger, requestLogger } from './middlewares/logger';
import notFound from './middlewares/notFound';
import errorHandler from './middlewares/errorHandler';
import validateRequest from './middlewares/validateRequest';
import { createUserSchema, loginSchema } from './schemas/userSchema';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use(requestLogger);
app.use((req, res, next) => {
  console.log('Request body:', req.body);
  next();
});
app.post('/signin', validateRequest(loginSchema, 'body'), login);
app.post('/signup', validateRequest(createUserSchema, 'body'), createUser);

app.use(auth);

app.use(usersRouter);
app.use(cardsRouter);

app.use('*', notFound);

app.use(errorLogger);
app.use(errorHandler);

app.listen(+PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
