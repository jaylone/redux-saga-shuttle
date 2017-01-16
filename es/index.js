(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'src/lib/SagaShuttle', 'src/lib/combineSagas'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('src/lib/SagaShuttle'), require('src/lib/combineSagas'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.SagaShuttle, global.combineSagas);
    global.index = mod.exports;
  }
})(this, function (module, exports, _SagaShuttle, _combineSagas) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _SagaShuttle2 = _interopRequireDefault(_SagaShuttle);

  var _combineSagas2 = _interopRequireDefault(_combineSagas);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    SagaShuttle: _SagaShuttle2.default,
    combineSagas: _combineSagas2.default
  };
  module.exports = exports['default'];
});