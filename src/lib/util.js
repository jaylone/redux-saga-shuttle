import { isEmpty } from 'ramda';
import { isObject } from 'redux-shuttle/validator';

export function console() {
  window && window.console && window.console.log(...arguments);
}

export function validObj(obj) {
  return isObject(obj) && !isEmpty(obj);
}
