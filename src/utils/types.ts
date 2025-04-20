import mongoose from 'mongoose';

export interface ICard {
  name: string,
  link: string,
  owner: mongoose.Schema.Types.ObjectId,
  likes: mongoose.Schema.Types.ObjectId[],
  createdAt: Date
}

export interface IUser {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password: string,
}

export interface IUserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<mongoose.Document<unknown, any, IUser>>;
}

export interface ITokenPayload {
  _id: string;
}

export interface IErrorResponse {
  message: string;
  statusCode: number;
}
