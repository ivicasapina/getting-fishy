import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatPrice } from '../helpers';

class Fish extends Component {
  render() {
    const { name, image, desc, price, status } = this.props.details;
    const isAvailable = status === 'available';
    const buttonText = isAvailable ? 'Add To Order' : 'Sold Out!';

    return (
      <li className="menu-fish">
        <img src={image} alt={name} />
        <h3 className="fish-name">{name}</h3>
        <span className="price">{formatPrice(price)}</span>
        <p>{desc}</p>
        <button disabled={!isAvailable} onClick={() => this.props.addToOrder(this.props.index)}>{buttonText}</button>
      </li>
    );
  }
};

Fish.propTypes = {
  details: PropTypes.object.isRequired,
  addToOrder: PropTypes.func.isRequired,
  index: PropTypes.string.isRequired
}

export default Fish;