(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'ramda', 'redux-saga', 'redux-saga/effects', 'redux-shuttle', 'redux-shuttle/helper', 'redux-shuttle/validator', './util'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('ramda'), require('redux-saga'), require('redux-saga/effects'), require('redux-shuttle'), require('redux-shuttle/helper'), require('redux-shuttle/validator'), require('./util'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.ramda, global.reduxSaga, global.effects, global.reduxShuttle, global.helper, global.validator, global.util);
    global.SagaShuttle = mod.exports;
  }
})(this, function (module, exports, _ramda, _reduxSaga, _effects, _reduxShuttle, _helper, _validator, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var innerProps = ['watchers', 'custom', 'actions', 'state', 'getState', 'reducer', 'namespace', 'sagas', 'handlers', _helper.SHUTTLE_KEY, _helper.REDUCER_KEY];

  var innerOpts = Symbol('innerOpts');
  var init = Symbol('init');
  var watchSaga = Symbol('watchSaga');
  var getWatcher = Symbol('getWatcher');
  var getCustomWatcher = Symbol('getCustomWatcher');

  var SagaShuttle = function () {
    function SagaShuttle(options) {
      _classCallCheck(this, SagaShuttle);

      var self = this;
      var shuttle = options.shuttle;

      self.sagas = regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      });
      self.namespace = shuttle.namespace;
      self.bindSagaShuttle = (0, _reduxShuttle.bindShuttle)(shuttle);
      self.actions = shuttle.actions;
      self[innerOpts] = options;
      return self[init](options);
    }

    _createClass(SagaShuttle, [{
      key: init,
      value: function value(options) {
        var self = this;

        var appendProps = (0, _ramda.pipe)(_ramda.keys, (0, _ramda.without)(innerProps), (0, _ramda.reduce)(function (pre, key) {
          pre[key] = options[key];
          return pre;
        }, self));

        var _self = appendProps(options);

        self[watchSaga]();
        return _self;
      }
    }, {
      key: watchSaga,
      value: function value() {
        var self = this;
        var types = self.shuttle.types;

        var watchers = this[innerOpts]['watchers'];
        var custom = this[innerOpts]['custom'];
        var sagas = [];

        if ((0, _util.validObj)(watchers)) {
          sagas = sagas.concat(self[getWatcher]());
        }

        if ((0, _util.validObj)(custom)) {
          sagas = sagas.concat(self[getCustomWatcher]());
        }

        if (sagas.length > 0) {
          self.sagas = regeneratorRuntime.mark(function _callee2() {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return sagas;

                  case 2:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          });
        }
      }
    }, {
      key: getWatcher,
      value: function value() {
        var self = this;
        var types = self.shuttle.types;

        var watchers = this[innerOpts]['watchers'];

        var ret = [];

        if (!(0, _util.validObj)(watchers)) {
          return ret;
        }

        var mapToWatcher = (0, _ramda.map)(function (action) {
          return (0, _effects.fork)(regeneratorRuntime.mark(function _callee4() {
            var handler, pattern;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    handler = watchers[action];
                    pattern = types[action];

                    if (!(0, _helper.isGenerator)(self[handler])) {
                      _context4.next = 9;
                      break;
                    }

                    if (!((0, _validator.isUndefined)(pattern) || (0, _validator.isNull)(pattern))) {
                      _context4.next = 5;
                      break;
                    }

                    throw new Error('action \'' + action + '\' did not existing in shuttle.');

                  case 5:
                    return _context4.delegateYield((0, _reduxSaga.takeEvery)(pattern, regeneratorRuntime.mark(function _callee3() {
                      var _args3 = arguments;
                      return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              _context3.prev = 0;
                              _context3.next = 3;
                              return self[handler].apply(self, _args3);

                            case 3:
                              _context3.next = 8;
                              break;

                            case 5:
                              _context3.prev = 5;
                              _context3.t0 = _context3['catch'](0);

                              (0, _util.console)(_context3.t0);

                            case 8:
                            case 'end':
                              return _context3.stop();
                          }
                        }
                      }, _callee3, this, [[0, 5]]);
                    })), 't0', 6);

                  case 6:
                    return _context4.abrupt('return', _context4.t0);

                  case 9:
                    throw new Error('wather handler should be a generator.');

                  case 10:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, _callee4, this);
          }));
        });

        return (0, _ramda.pipe)(_ramda.keys, mapToWatcher)(watchers);
      }
    }, {
      key: getCustomWatcher,
      value: function value() {
        var self = this;
        var types = self.shuttle.types;

        var custom = this[innerOpts]['custom'];
        var ret = [];

        if (!(0, _util.validObj)(custom)) {
          return ret;
        }

        ret = (0, _ramda.pipe)(_ramda.keys, (0, _ramda.map)(function (watcher) {
          return (0, _effects.fork)(regeneratorRuntime.mark(function _callee5() {
            var handler,
                _args5 = arguments;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    handler = custom[watcher];

                    if (!(0, _helper.isGenerator)(handler)) {
                      _context5.next = 12;
                      break;
                    }

                    _context5.prev = 2;
                    _context5.next = 5;
                    return handler.apply(self, _args5);

                  case 5:
                    _context5.next = 10;
                    break;

                  case 7:
                    _context5.prev = 7;
                    _context5.t0 = _context5['catch'](2);

                    (0, _util.console)(_context5.t0);

                  case 10:
                    _context5.next = 13;
                    break;

                  case 12:
                    throw new Error('wather handler should be a generator.');

                  case 13:
                  case 'end':
                    return _context5.stop();
                }
              }
            }, _callee5, this, [[2, 7]]);
          }));
        }))(custom);

        return ret;
      }
    }, {
      key: 'getState',
      value: regeneratorRuntime.mark(function getState() {
        var shuttle;
        return regeneratorRuntime.wrap(function getState$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                shuttle = this.shuttle;
                _context6.next = 3;
                return (0, _effects.select)((0, _reduxShuttle.mapShuttleState)(shuttle));

              case 3:
                return _context6.abrupt('return', _context6.sent);

              case 4:
              case 'end':
                return _context6.stop();
            }
          }
        }, getState, this);
      })
    }]);

    return SagaShuttle;
  }();

  exports.default = SagaShuttle;
  module.exports = exports['default'];
});