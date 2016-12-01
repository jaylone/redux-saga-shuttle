import React, { Component } from 'react';
import { bindShuttle } from 'redux-shuttle';
import { shuttle as author } from './sagaShuttle';
import { shuttle as cust } from './custSagaShuttle';
import immutablePureRenderMixin from './immutablePureRenderMixin';

@bindShuttle({cust, author})
@immutablePureRenderMixin
export default class App extends Component {

  setList() {
    const props = this.props;

    props.authorActions.setList(['Winter', 'is', 'coming.']);
  }

  fetchList() {
    const props = this.props;

    props.authorActions.fetchList({pageNum: 1, pageSize: 10});
  }

  sagaSelect() {
    const props = this.props;

    props.authorActions.sagaSelect();
  }

  toggleModal() {
    const props = this.props;

    props.authorActions.toggleModalA();
  }

  setFavor() {
    const props = this.props;

    props.custActions.setFavor([1,2,3,3])
  }

  selectCustState() {
    const props = this.props;

    props.custActions.getCustState();
  }

  render() {
    const props = this.props;

    window.appprops = props;

    console.log('rendered');
    console.log(props.cust.toJS());

    return (
      <div>
        <p>Hello world.</p>
        <p>{ props.author.get('list').toJS().join(' ') }</p>
        <p><button onClick={::this.setList}>Set List</button></p>
        <p><button onClick={::this.fetchList}>Fetch List</button></p>
        <p><button onClick={::this.sagaSelect}>Saga Select</button></p>
        <p><button onClick={::this.toggleModal}>custom generator</button></p>
        <p><button onClick={::this.setFavor}>Set Favor</button></p>
        <p>{ props.cust.get('favor').toJS().join(' | ') }</p>
        <p><button onClick={::this.selectCustState}>Set Cust State</button></p>
      </div>
    )
  }
};
