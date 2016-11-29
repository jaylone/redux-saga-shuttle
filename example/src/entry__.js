import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { saga, bindShuttle, reducers } from './shuttle';

const sagaMiddleware = createSagaMiddleware();
const enhancer = window.devToolsExtension ? window.devToolsExtension() : f => f;
const store = createStore(reducers, compose(applyMiddleware(sagaMiddleware), enhancer));
store.runSaga = sagaMiddleware.run;
store.close = () => store.dispatch(END);
store.runSaga(saga);

@bindShuttle
class App extends Component {

  setList() {
    const props = this.props;

    props.authorActions.setList(['Winter', 'is', 'coming.']);
  }

  fetchList() {
    const props = this.props;

    props.authorActions.fetchList();
  }

  sagaSelect() {
    const props = this.props;

    props.authorActions.sagaSelect();
  }

  render() {
    const props = this.props;

    console.log(props);

    return (
      <div>
        <p>Hello world.</p>
        <p>{ props.author.list.join(' ') }</p>
        <p><button onClick={::this.setList}>Set List</button></p>
        <p><button onClick={::this.fetchList}>Fetch List</button></p>
        <p><button onClick={::this.sagaSelect}>Saga Select</button></p>
      </div>
    )
  }
};

ReactDom.render(
  <Provider store={store}>
    <App name="jaylone" />
  </Provider>,
  document.getElementById('root')
);
