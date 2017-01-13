(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'ramda', 'redux-shuttle/validator'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('ramda'), require('redux-shuttle/validator'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ramda, global.validator);
    global.util = mod.exports;
  }
})(this, function (exports, _ramda, _validator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.console = console;
  exports.validObj = validObj;
  function console() {
    var _window$console;

    window && window.console && (_window$console = window.console).log.apply(_window$console, arguments);
  }

  function validObj(obj) {
    return (0, _validator.isObject)(obj) && !(0, _ramda.isEmpty)(obj);
  }
});