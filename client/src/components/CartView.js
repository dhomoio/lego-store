import React from 'react';

export const CartView = props => {
  const { cart, updateCartQuantity, removeCartItem, checkout, setShowCart } = props;

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cart.items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div key={item.productId._id} className="af_productCard">
              <h3>{item.productId.name}</h3>
              <p>${item.productId.price} each</p>
              <div className="af_quantityControls">
                <button
                  className="af_btn af_btnSecondary"
                  onClick={() => updateCartQuantity(item.productId._id, item.quantity - 1)}
                >-</button>
                <span>{item.quantity}</span>
                <button
                  className="af_btn af_btnSecondary"
                  onClick={() => updateCartQuantity(item.productId._id, item.quantity + 1)}
                >+</button>
              </div>
              <p>Subtotal: ${(item.productId.price * item.quantity).toFixed(2)}</p>
              <button
                className="af_btn af_btnDanger"
                onClick={() => removeCartItem(item.productId._id)}
              >Remove</button>
            </div>
          ))}
          <h3>
            Total: $
            {cart.items
              .reduce((sum, item) => sum + item.productId.price * item.quantity, 0)
              .toFixed(2)}
          </h3>
        </>
      )}
      {cart.items.length > 0 && (
        <button className="af_btn af_btnSuccess" onClick={checkout}>Checkout</button>
      )}
      <button className="af_btn af_btnSecondary" onClick={() => setShowCart(false)}>Back to Products</button>
    </div>
  );
};
