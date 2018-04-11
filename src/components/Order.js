import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { formatPrice } from '../helpers';

class Order extends Component {
  renderOrder = (key) => {
    const fish = this.props.fishes[key];
    const count = this.props.order[key];
    const removeButton = <button onClick={() => this.props.removeFromOrder(key)}>&times;</button>

    if (!fish || fish.status === 'unavailable') {
      return <li key={key}>Sorry, {fish ? fish.name : 'fish'} is no longer available! {removeButton}</li>
    }

    return (
      <li key={key}>
        <span>
          <CSSTransitionGroup
            className="count"
            component="span"
            transitionName="count"
            transitionEnterTimeout={250}
            transitionLeaveTimeout={250}>
            <span key={count}>{count}</span>
          </CSSTransitionGroup>
          lbs {fish.name} {removeButton}
        </span>
        <CSSTransitionGroup
          className="count"
          component="span"
          transitionName="count"
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}>
          <span key={count * fish.price}>{formatPrice(count * fish.price)}</span>
        </CSSTransitionGroup>
      </li>
    )
  }

  render() {
    const orderIds = Object.keys(this.props.order);
    const total = orderIds.reduce((prevTotal, key) => {
      const fish = this.props.fishes[key];
      const count = this.props.order[key];
      const isAvailable = fish && fish.status === 'available';
      if (isAvailable) {
        return prevTotal + (count * fish.price || 0);
      }
      return prevTotal;
    }, 0);

    return (
      < div className="order-wrap" >
        <h2>Your Order</h2>
        <CSSTransitionGroup
          className="order"
          component="ul"
          transitionName="order"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500} >
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            <CSSTransitionGroup
              className="count"
              component="span"
              transitionName="count"
              transitionEnterTimeout={250}
              transitionLeaveTimeout={250}>
              <span key={total}>{formatPrice(total)}</span>
            </CSSTransitionGroup>
          </li>
        </CSSTransitionGroup>
      </div >
    );
  }
};

Order.propTypes = {
  order: PropTypes.object.isRequired,
  fishes: PropTypes.object.isRequired,
  removeFromOrder: PropTypes.func.isRequired
}

export default Order;