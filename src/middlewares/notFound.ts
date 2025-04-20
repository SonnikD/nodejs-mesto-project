import NotFoundError from '../errors/not-found-err';

const notFound = () => {
  throw new NotFoundError('Страница не найдена');
};

export default notFound;
