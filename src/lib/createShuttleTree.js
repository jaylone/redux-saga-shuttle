import { mapObjIndexed } from 'ramda';
import { combineReducers } from 'redux';
import { validator } from 'redux-shuttle';
import { isShuttle } from './util';

const { isObject } = validator;
const reducer = 'reducer';

const recursionReducer = (treeNode) => {
  
  if (isShuttle(treeNode)) {
    return treeNode[reducer];
  } else if (isObject(treeNode)) {
    return combineReducers(mapObjIndexed(node => {
      return recursionReducer(node);
    }, treeNode));
  } else {
    throw new Error('shuttle tree node should be a shuttle.');
  }
}

export default (tree) => {
  if (isObject(tree) && !isShuttle(tree)) {
    return recursionReducer(tree);
  } else {
    throw new Error('entire shuttle tree required a object.');
  }
}
