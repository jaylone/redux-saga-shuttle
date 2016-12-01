import { createShuttle } from 'redux-shuttle';
import { SagaShuttle } from 'src/index';

const initState = {
  name: 'jaylone',
  sex: 'male',
  favor: ['movie, read, running']
}

const shuttle = createShuttle('App/cust', initState, {
  setName: ['name', (state, { name }) => {
    return Object.assign({}, state, { name });
  }],
  setFavor: ['favor', (state, { favor }) => {
    return Object.assign({}, state, { favor });
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

console.log('App/cust', shuttle)
