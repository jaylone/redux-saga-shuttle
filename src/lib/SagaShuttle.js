import { without, keys, reduce, pipe, map } from 'ramda';
import { takeEvery } from 'redux-saga';
import { call, fork, put, select, take } from 'redux-saga/effects';
import { createShuttle, bindShuttle, mapShuttleState } from 'redux-shuttle';
import { isGenerator, SHUTTLE_KEY, REDUCER_KEY } from 'redux-shuttle/helper';
import { isObject, isArray, isString, isNull, isUndefined } from 'redux-shuttle/validator';
import { console, validObj } from './util';

const innerProps = [
  'watchers',
  'custom',
  'actions',
  'state',
  'getState',
  'reducer',
  'namespace',
  'sagas',
  'handlers',
  SHUTTLE_KEY,
  REDUCER_KEY
];

const innerOpts = Symbol('innerOpts');
const init = Symbol('init');
const watchSaga = Symbol('watchSaga');
const getWatcher = Symbol('getWatcher');
const getCustomWatcher = Symbol('getCustomWatcher');

class SagaShuttle {
  constructor(options) {
    const self = this;
    const shuttle = options.shuttle;

    self.sagas = function*() {};
    self.namespace = shuttle.namespace;
    self.bindSagaShuttle = bindShuttle(shuttle);
    self.actions = shuttle.actions;
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

    self[watchSaga]();
    return _self;
  }

  [watchSaga]() {
    const self = this;
    const { types } = self.shuttle;
    const watchers = this[innerOpts]['watchers'];
    const custom = this[innerOpts]['custom'];
    let sagas = [];

    if (validObj(watchers)) {
      sagas = sagas.concat(self[getWatcher]());
    }

    if (validObj(custom)) {
      sagas = sagas.concat(self[getCustomWatcher]());
    }

    if (sagas.length > 0) {
      self.sagas = function* () {
        yield sagas;
      }
    }
  }

  [getWatcher]() {
    const self = this;
    const { types } = self.shuttle;
    const watchers = this[innerOpts]['watchers'];

    let ret = [];

    if (!validObj(watchers)) {
      return ret;
    }

    const mapToWatcher = map(action => {
      return fork(function* () {
        const handler = watchers[action];
        const pattern = types[action];

        if (isGenerator(self[handler])) {
          if (isUndefined(pattern) || isNull(pattern)) {
            throw new Error(`action '${action}' did not existing in shuttle.`);
          }

          return yield* takeEvery(pattern, function* () {
            try {
              yield self[handler].apply(self, arguments);
            } catch (e) {
              console(e);
            }
          });
        } else {
          throw new Error('wather handler should be a generator.')
        }
      });
    });

    return pipe(keys, mapToWatcher)(watchers);
  }

  [getCustomWatcher]() {
    const self = this;
    const { types } = self.shuttle;
    const custom = this[innerOpts]['custom'];
    let ret = [];

    if (!validObj(custom)) {
      return ret;
    }

    ret = pipe(keys, map(watcher => fork(function* () {
      const handler = custom[watcher];

      if (isGenerator(handler)) {
        try {
          yield handler.apply(self, arguments);
        } catch (e) {
          console(e);
        }
      } else {
        throw new Error('wather handler should be a generator.')
      }
    })))(custom);

    return ret;
  }

  * getState() {
    const shuttle = this.shuttle;
    return yield select(mapShuttleState(shuttle));
  }
}

export default SagaShuttle;
