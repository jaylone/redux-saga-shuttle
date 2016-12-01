import { fork } from 'redux-saga/effects';
import { isGenerator } from 'redux-shuttle/helper';
import { isArray } from 'redux-shuttle/validator';

export default (...args) => {

  if (!isArray(args) || args.length == 0) {
    throw new Error('arguments should be a saga or saga list.');
  }

  return function* (){
    yield* args.map(saga => {
      if (isGenerator(saga)) {
        return fork(saga)
      } else {
        throw new Error('combineSagas required a Generator.');
      }
    });
  }
}
