import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { createShuttleTree } from 'redux-shuttle';
import { combineSagas } from 'dist/index';

import { sagas as authorSaga, shuttle as author } from './sagaShuttle';
import { sagas as custSaga, shuttle as cust } from './custSagaShuttle';
import App from './App';

const reducers = createShuttleTree({ author, cust });
const sagaMiddleware = createSagaMiddleware();
const enhancer = window.devToolsExtension ? window.devToolsExtension() : f => f;
const store = createStore(reducers, compose(applyMiddleware(sagaMiddleware), enhancer));
store.runSaga = sagaMiddleware.run;
store.close = () => store.dispatch(END);
// const task = store.runSaga(function* (){
//   yield* authorSaga();
//   yield* custSaga();
// });
const task = store.runSaga(combineSagas(authorSaga, custSaga));
task.done.catch((err) => {
  if (console) console.log(err);
});

ReactDom.render(
  <Provider store={store}>
    <App wrapperName="jaylone" />
  </Provider>,
  document.getElementById('root')
);
