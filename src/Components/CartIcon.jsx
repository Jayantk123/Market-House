import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const CartIcon = ({ itemCount }) => {
  return (
    <div>
      <FontAwesomeIcon icon={faShoppingCart} size="lg" />
      <span>{itemCount}</span>
    </div>
  );
};

export default CartIcon;
