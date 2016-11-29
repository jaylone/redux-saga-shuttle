import { merge, filter, dissoc, without, mapObjIndexed, keys, reduce, pipe, map } from 'ramda';
import { createShuttle, validator } from 'redux-shuttle';
import { takeEvery } from 'redux-saga';
import { call, fork, put, select, take } from 'redux-saga/effects';
import { isGenerator, REDUCER_KEY } from './util';

import mapShuttleState from './mapShuttleState';
import mapShuttleDispatch from './mapShuttleDispatch';
import bindShuttle from './bindShuttle';
import createShuttleTree from './createShuttleTree';

const { isObject, isArray, isString } = validator;

const innerProps = ['watchers', 'initState', 'actions', 'state'];

const innerOpts = Symbol('innerOpts');
const init = Symbol('init');
const watchSaga = Symbol('watchSaga');
const exportSagas = Symbol('exportSagas');

class SagaShuttle {
  constructor(options) {
    const self = this;

    self.sagaWatchers = '';
    self.namespace = '';
    self.sagas = function*(){};

    self.bindSagaShuttle = bindShuttle(options.shuttle);
    self[innerOpts] = options;
    return self[init](options);
  }

  [init](options) {
    const self = this;

    const appendProps = pipe(
      keys,
      without(innerProps),
      reduce((pre, key) => {
        pre[key] = options[key];
        return pre;
      }, self)
    );

    const _self = appendProps(options);

    this[watchSaga]();
    return _self;
  }

  [watchSaga]() {
    const self = this;
    const { types } = self.shuttle;
    const watchers = this[innerOpts]['watchers'];

    self.sagas = function* () {
      yield pipe(keys, map(action => fork(function* () {
        const handler = watchers[action];
        if (isString(handler)) {
          yield* takeEvery(types[action], self[handler]);
        } else if (isGenerator(handler)) {
          yield handler.bind(self);
        } else {
          throw new Error('wather handler should be a generator.')
        }
      })))(watchers);
    }
  }
}

const createSagaShuttle = (options) => {
  const { initState, actions, effects } = options;

  const shuttle = createShuttle(initState, actions);
}

export default SagaShuttle;
