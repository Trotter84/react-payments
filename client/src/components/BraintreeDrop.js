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

class BraintreeDrop extends React.Component {
  state = {
    loaded: false,
    token: '',
  }

  handlePaymentMethod = (payload) => {
    //TODO make this work
  }

  render() {
    const { loaded, token } = this.state;

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

export default BraintreeDrop;
