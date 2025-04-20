import { ERROR_CODES } from '../utils/constants';

export default class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODES.CONFLICT;
    this.name = 'ConflictError';
  }
}
