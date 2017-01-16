import { createShuttle } from 'redux-shuttle';
import { SagaShuttle } from 'es/index';
import Immutable from 'immutable';
import _ from 'lodash';

const initState = Immutable.fromJS({
  name: 'jaylone',
  sex: 'male',
  favor: ['movie, read, running']
});

window.cust = initState;

window.Immutable = Immutable;
window.parse = (o) => JSON.parse(JSON.stringify(o));
window._ = _;

const shuttle = createShuttle('App/cust', initState, {
  setName: ['name', (state, { name }) => {
    return state.setName('name', name);
  }],
  setFavor: ['favor', (state, { favor }) => {
    return state.set('favor', Immutable.fromJS(favor));
  }],
  getCustState: null
});

export default new SagaShuttle({
  shuttle: shuttle,
  watchers: {
    getCustState: 'selectState'
  },
  * selectState() {
    const state = yield this.getState();

    console.log(state);
  }
})
