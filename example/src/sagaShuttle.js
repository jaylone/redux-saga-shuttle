import { createShuttle } from 'redux-shuttle';
import { takeEvery } from 'redux-saga';
import { call, fork, put, select, take } from 'redux-saga/effects';
import axios from 'axios';
import { SagaShuttle } from 'es/index';
import Immutable from 'immutable';

const initState = Immutable.fromJS({
  list: ['King\'s', 'Landing.'],
  name: '',
  visible: false
})

// create shuttle: bundling reducer, actions and action types
const shuttle = createShuttle('APP/author', initState, {
  setList: ['list', (state, action) => {
    return state.set('list', Immutable.fromJS(action.list));
  }],
  setName: ['name', (state, action) => {
    return Object.assign({}, state, {list: action.name});
  }],
  toggleModal: (state, action) => {
    return state.set('visible', !state.get('visible'));
  },
  toggleModalA: null,
  fetchList: ['param'],
  recieveList: ['data', (state, actions) => {
    return state.merge(data)
  }],
  sagaSelect: null
});

// create saga shuttle: manage sagas with side effects
export default new SagaShuttle({
  shuttle: shuttle,
  watchers: {
    fetchList: 'fetchAPI',
    sagaSelect: 'sagaSelect'
  },
  custom: {
    toggleModalA: function* () {
      const { types, actions } = this.shuttle;
      while(true) {
        yield take(types.toggleModalA);
        yield put(actions.sagaSelect());
      }
    }
  },

  * sagaSelect() {
    const state = yield this.getState();

    console.log(state);
  },

  * fetchAPI(param) {
    console.log(param);
    const { data } = yield call(() => axios.get('/api'));
    if ( data.ret ) {
      console.log(this);
      this.formate();
      yield put(shuttle.actions.setList(data.data.list));
    }
  },

  add(a,b) {
    return a + b;
  },

  formate() {
    console.log('sync function', this.add(1,2));
  }
});
