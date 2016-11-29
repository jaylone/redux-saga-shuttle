import { validator } from 'redux-shuttle';

const { isObject } = validator;
const REDUCER_KEY = '@@redux-shuttle/REDUCER_KEY';
const SHUTTLE_KEY = '@@redux-shuttle/SHUTTLE_KEY';

const isGenerator = (fn) => fn.constructor.name === "GeneratorFunction";
const isShuttle = (obj) => {
  return isObject(obj) && Boolean(obj[SHUTTLE_KEY]);
}

export default {
  isGenerator,
  isShuttle,
  SHUTTLE_KEY,
  REDUCER_KEY
};
