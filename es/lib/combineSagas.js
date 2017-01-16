(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'redux-saga/effects', 'redux-shuttle/helper', 'redux-shuttle/validator'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('redux-saga/effects'), require('redux-shuttle/helper'), require('redux-shuttle/validator'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.effects, global.helper, global.validator);
    global.combineSagas = mod.exports;
  }
})(this, function (module, exports, _effects, _helper, _validator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (!(0, _validator.isArray)(args) || args.length == 0) {
      throw new Error('arguments should be a saga or saga list.');
    }

    return regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.delegateYield(args.map(function (saga) {
                if ((0, _helper.isGenerator)(saga)) {
                  return (0, _effects.fork)(saga);
                } else {
                  throw new Error('combineSagas required a Generator.');
                }
              }), 't0', 1);

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    });
  };

  module.exports = exports['default'];
});