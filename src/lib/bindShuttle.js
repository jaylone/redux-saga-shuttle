import { connect } from 'react-redux';
import { validator } from 'redux-shuttle';
import { isShuttle } from 'src/lib/util';
import mapShuttleState from './mapShuttleState';
import mapShuttleDispatch from './mapShuttleDispatch';

const { isObject } = validator;

export default (shuttles, mergeProps, options = {}) => {
  let mapStateToProps, mapDispatchToProps;

  if (!isObject(shuttles)) {
    throw new Error('bindShuttle required \'shuttle\' or  \'object\'');
  }

  return connect(mapShuttleState(shuttles), mapShuttleDispatch(shuttles), mergeProps, options = {});
}
