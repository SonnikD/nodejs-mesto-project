import { ERROR_CODES } from '../utils/constants';

export default class BadRequstError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODES.BAD_REQUEST;
    this.name = 'BadRequstError';
  }
}
