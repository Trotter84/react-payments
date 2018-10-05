import React from 'react';
import {
  Dimmer,
  Loader,
  Segment,
} from 'semantic-ui-react';
import { setFlash } from '../reducers/flash';
import { connect } from 'react-redux';
import braintree from 'braintree-web-drop-in';
import BraintreeDropin from 'braintree-dropin-react';
import BraintreeSubmitButton from './BraintreeSubmitButton';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class BraintreeDrop extends React.Component {
  state = {
    loaded: false,
    token: '',
    redirect: false,
    transactionId: '',
  }

  componentDidMount() {
    const { dispatch } = this.props;

    axios.get('/api/braintree_token')
      .then( res => {
        this.setState({ token: res.data, loaded: true })
      })
      .catch( err => {
        console.log(err)
        dispatch(setFlash('Error setting up payments', 'red'));
      })
  }

  handlePaymentMethod = (payload) => {
    const { dispatch, amount } = this.props;

    axios.post('/api/payment', { amount, ...payload })
      .then( res => {
        const { data: transactionId } = res;
        this.setState({ redirect: true, transactionId })
      })
      .catch( err => {
        console.log(err)
        dispatch(setFlash('Error posting payment', 'red'))
        window.location.reload();
      })
  }

  render() {
    const { loaded, token, redirect, transactionId } = this.state;

    if(redirect)
      return(
        <Redirect to={{
            pathname: '/payment_success',
            state: { amount: this.props.amount, transactionId }
          }}
        />
      )

    if(loaded)
      return (
        <Segment basic textAlign='center'>
          <BraintreeDropin
            braintree={braintree}
            authorizationToken={token}
            handlePaymentMethod={this.handlePaymentMethod}
            renderSubmitButton={BraintreeSubmitButton}
          />
        </Segment>
      );
    else
      return(
        <Dimmer active>
          <Loader>Loading Payment Experience. Please Wait...</Loader>
        </Dimmer>
      )
  }
}

export default connect()(BraintreeDrop);
