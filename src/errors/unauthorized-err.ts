import { ERROR_CODES } from '../utils/constants';

export default class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODES.UNAUTHORIZED;
    this.name = 'UnauthorizedError';
  }
}
