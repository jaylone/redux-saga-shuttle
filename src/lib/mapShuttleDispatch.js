import { mapObjIndexed, merge, zipObj, keys, pipe, map } from 'ramda';
import { bindActionCreators } from 'redux';
import { validator } from 'redux-shuttle';
import { isShuttle } from 'src/lib/util';

const { isObject } = validator;
const Actions = 'actions';

export default (config) => {
  if (!isObject(config)) {
    throw new Error('mapShuttleDispatch required \'shuttle\' or \'object\'');
  }
  return (dispatch) => {
    if (isShuttle(config)) {
      return {
        actions: bindActionCreators(config[Actions], dispatch),
        dispatch
      }
    }

    const actionKeys = pipe(keys, map(key => `${key}Actions`))(config);
    const actions = pipe(keys, map(key => bindActionCreators(config[key][Actions], dispatch)))(config);

    return merge(zipObj(actionKeys, actions), { dispatch });
  }
}
