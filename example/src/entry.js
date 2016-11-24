import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { createStore, combineReducers, bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import { createReducer } from 'redux-shuttle';
import axios from 'axios';

import shuttle, { units, actions, reducer } from './shuttle';
const initState = {
  list: ['King\'s', 'Landing.'],
  name: '',
  visible: false
}

console.log(shuttle);
const reducers = combineReducers({author: createReducer(initState,units)});

@connect(state => state, dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch
  }
})
class App extends Component {
  componentWillMount() {
    console.log('componentWillMount');
    axios.get('/api').then(function (res) {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    })
  }

  setList() {
    const props = this.props;

    props.actions.setList(['Winter', 'is', 'coming.']);
  }

  render() {
    const props = this.props;

    return (
      <div>
        <p>Hello world.</p>
        <p>{ props.author.list.join(' ') }</p>
        <button onClick={::this.setList}>Set List</button>
      </div>
    )
  }
};

ReactDom.render(
  <Provider store={createStore(reducers)}>
    <App />
  </Provider>,
  document.getElementById('root')
);
