import { ERROR_CODES } from '../utils/constants';

export default class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODES.NOT_FOUND;
    this.name = 'NotFoundError';
  }
}
