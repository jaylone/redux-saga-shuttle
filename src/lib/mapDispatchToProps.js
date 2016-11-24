import { merge } from 'ramda';
import { bindActionCreators } from 'redux';
import { isUndefined, isNull } from 'src/util/validator';

export default (actions, name) => {
  return (dispatch) => {
    return {
      [name || 'actions']: bindActionCreators(actions, dispatch),
      dispatch
    }
  }
}
