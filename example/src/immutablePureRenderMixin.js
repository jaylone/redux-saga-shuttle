import React, { Component } from 'react';
import Immutable from 'immutable';
import { isNull, isUndefined, isObject } from 'redux-shuttle/validator';

function simpleEqual(pre, next) {
  if (pre === next || Immutable.is(pre, next)) {
    return true;
  }

  if (!isObject(pre) || isNull(pre) || isUndefined(pre) ||
      !isObject(next) || isNull(next) || isUndefined(next)) {
    return false;
  }

  const preKeys = Object.keys(pre);
  const nextKeys = Object.keys(next);

  if (preKeys.length !== nextKeys.length) {
    return false;
  }

  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(next);
  for (let i = 0; i < preKeys.length; i++) {
    if (!bHasOwnProperty(preKeys[i]) || !Immutable.is(pre[preKeys[i]], next[nextKeys[i]])) {
      return false;
    }
  }

  return true;
}

function shouldComponentUpdate(nextProps, nextState) {
  return !simpleEqual(this.props, nextProps) || !simpleEqual(this.state, nextState);
}

function immutablePureRenderMixin(InnerComponent) {
  class WrapperComponent extends Component {
    render() {
      return React.createElement(InnerComponent, this.props, this.props.children);
    }
  }

  WrapperComponent.prototype.shouldComponentUpdate = shouldComponentUpdate;

  return WrapperComponent;
}

export {
  immutablePureRenderMixin as default,
  shouldComponentUpdate,
  simpleEqual
};
