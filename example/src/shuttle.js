import { createShuttle, createReducer } from 'redux-shuttle';
import { combineReducers } from 'redux';
import { takeEvery } from 'redux-saga';
import { call, fork, put } from 'redux-saga/effects';

const initState = {
  list: ['King\'s', 'Landing.'],
  name: '',
  visible: false
}

const shuttle = createShuttle(initState, {
  setList: ['list',  (state, action) => {
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
  }]
});

function* fetchAPI() {
  const { data } = yield call(() => axios.get('/api'));
  if ( data.ret ) {
    yield put(shuttle.actions.setList(data.data.list))
  }
}

function* watchFetchAPI() {
  yield* takeEvery(shuttle.Types.FETCH_LIST, fetchAPI);
}

function* saga() {
  yield [
    fork(watchFetchAPI)
  ]
}

export default {
  ...shuttle,
  saga
}
