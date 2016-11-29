import { createShuttle } from 'redux-shuttle';
import { SagaShuttle } from 'src/index';
import { call, fork, put, select, take } from 'redux-saga/effects';
import axios from 'axios';

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
  toggleModalA: null,
  fetchList: ['param'],
  recieveList: ['data', (state, actions) => {
    return Object.assign({}, state, data)
  }],
  sagaSelect: null
});

export default new SagaShuttle({
  shuttle: shuttle,

  watchers: {
    fetchList: 'fetchAPI',
    sagaSelect: 'sagaSelect',
    toggleModalA: function* () {
      const { types } = this.shuttle;
      yield* takeEvery(types.toggleModal, this.fetchAPI);
    }
  },

  * sagaSelect() {
    const state = yield select();

    console.log(state);
  },

  * fetchAPI() {
    const { data } = yield call(() => axios.get('/api'));
    if ( data.ret ) {
      yield put(shuttle.actions.setList(data.data.list));
    }
  },

  add(a,b) {
    return a + b;
  },

  formate() {
    console.log(this.add(1,2));
  }
});
