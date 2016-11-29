import { createShuttle, createReducer } from 'redux-shuttle';
import { combineReducers } from 'redux';
import { connect } from 'react-redux';
import { takeEvery } from 'redux-saga';
import { call, fork, put, select } from 'redux-saga/effects';
import axios from 'axios';
import { SHUTTLE_KEY } from 'src/lib/util';
import mapShuttleState from 'src/lib/mapShuttleState';
import mapShuttleDispatch from 'src/lib/mapShuttleDispatch';
import bindShuttle from 'src/lib/bindShuttle';
import createShuttleTree from 'src/lib/createShuttleTree';

const initState = {
  list: ['King\'s', 'Landing.'],
  name: '',
  visible: false
}

const shuttle = createShuttle('APP/Shuttle', initState, {
  setList: ['list', (state, action) => {
    return Object.assign({}, state, {list: action.list});
  }],
  setName: ['name', (state, action) => {
    return Object.assign({}, state, {list: action.name});
  }],
  toggleModal: (state, action) => {
    return Object.assign({}, state, {visible: !state.visible});
  },
  fetchList: ['param'],
  recieveList: ['data', (state, actions) => {
    return Object.assign({}, state, data)
  }],
  sagaSelect: null
});

function* sagaSelect() {
  const state = yield select();

  console.log(state);
}

function* fetchAPI() {
  const { data } = yield call(() => axios.get('/api'));
  if ( data.ret ) {
    yield put(shuttle.actions.setList(data.data.list));
  }
}

function* watchFetchAPI() {
  yield* takeEvery(shuttle.types.fetchList, fetchAPI);
}

function* watchSagaSelect() {
  yield* takeEvery(shuttle.types.sagaSelect, sagaSelect);
}

function* saga() {
  yield [
    fork(watchFetchAPI),
    fork(watchSagaSelect)
  ]
}

const room = {
  bookrack: {
    col: 1,
    row: 2,
    book: {
      name: 'Forget',
      total: 200
    }
  },
  Num: 101,
  admin: 'jaylone'
};
const shuttle2 = createShuttle('APP/Shuttle2', room, {
  setSecondList: ['list',  (state, action) => {
    return Object.assign({}, state, {list: action.list});
  }],
  setSecondName: ['name', (state, action) => {
    return Object.assign({}, state, {list: action.name});
  }],
  toggleSecondModal: (state, action) => {
    return Object.assign({}, state, {visible: !state.visible});
  },
  fetchSecondList: ['param'],
  recieveSecondList: ['data', (state, actions) => {
    return Object.assign({}, state, data)
  }],
  sagaSecondSelect: null
});

const author = shuttle;
const second = shuttle2;

export default {
  bindShuttle: bindShuttle({author, second}),
  reducers: createShuttleTree({author, second}),
  saga
}
