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
  avatar: string
}
