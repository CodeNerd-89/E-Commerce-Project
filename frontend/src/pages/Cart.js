import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const paymentMethods = [
  {
    id: 'card',
    title: 'Credit or Debit Card',
    badge: 'Instant',
    description: 'Use a sample Visa or Mastercard style checkout.',
  },
  {
    id: 'wallet',
    title: 'Mobile Wallet',
    badge: 'Fast',
    description: 'Pay with a demo bKash or Nagad-style flow.',
  },
  {
    id: 'cod',
    title: 'Cash on Delivery',
    badge: 'Flexible',
    description: 'Confirm now and pay when the package arrives.',
  },
];

const formatPrice = (value) => Number(value || 0).toFixed(2);

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [checkoutError, setCheckoutError] = useState('');
  const [orderSummary, setOrderSummary] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    walletProvider: 'bKash',
    walletNumber: '',
    walletPin: '',
    deliveryNote: '',
  });

  const itemCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );
  const subtotal = getTotalPrice();
  const shipping = subtotal >= 200 || cart.length === 0 ? 0 : 12;
  const serviceFee = cart.length === 0 ? 0 : Number((subtotal * 0.03).toFixed(2));
  const total = subtotal + shipping + serviceFee;
  const selectedPaymentMethod = paymentMethods.find(
    (method) => method.id === paymentMethod
  );

  const handlePaymentMethodChange = (methodId) => {
    setPaymentMethod(methodId);
    setCheckoutError('');
  };

  const handlePaymentDetailChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === 'cardNumber') {
      value = value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(\d{4})(?=\d)/g, '$1 ')
        .trim();
    }

    if (name === 'expiry') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length > 2) {
        value = `${value.slice(0, 2)}/${value.slice(2)}`;
      }
    }

    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    if (name === 'walletNumber') {
      value = value.replace(/\D/g, '').slice(0, 11);
    }

    if (name === 'walletPin') {
      value = value.replace(/\D/g, '').slice(0, 6);
    }

    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCheckoutError('');
  };

  const validatePayment = () => {
    if (paymentMethod === 'card') {
      const cardDigits = paymentDetails.cardNumber.replace(/\D/g, '');
      const cvvDigits = paymentDetails.cvv.replace(/\D/g, '');

      if (!paymentDetails.cardName.trim()) {
        return 'Enter the name on the card.';
      }
      if (cardDigits.length !== 16) {
        return 'Enter a 16-digit sample card number.';
      }
      if (!/^\d{2}\/\d{2}$/.test(paymentDetails.expiry)) {
        return 'Enter the expiry in MM/YY format.';
      }
      if (cvvDigits.length < 3) {
        return 'Enter a valid CVV.';
      }
    }

    if (paymentMethod === 'wallet') {
      const walletDigits = paymentDetails.walletNumber.replace(/\D/g, '');
      const pinDigits = paymentDetails.walletPin.replace(/\D/g, '');

      if (!paymentDetails.walletProvider) {
        return 'Choose a wallet provider.';
      }
      if (walletDigits.length !== 11) {
        return 'Enter an 11-digit mobile wallet number.';
      }
      if (pinDigits.length < 4) {
        return 'Enter a sample wallet PIN.';
      }
    }

    return '';
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const paymentValidationError = validatePayment();
    if (paymentValidationError) {
      setCheckoutError(paymentValidationError);
      return;
    }

    setOrderSummary({
      total,
      paymentMethod: selectedPaymentMethod?.title || 'Sample payment',
    });
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      setOrderPlaced(false);
      setOrderSummary(null);
      navigate('/');
    }, 2400);
  };

  if (orderPlaced) {
    return (
      <div className="order-success-shell">
        <div className="success-message">
          <div className="success-chip">Payment approved</div>
          <h2>Order placed successfully</h2>
          <p>
            Your sample checkout with {orderSummary?.paymentMethod} for $
            {formatPrice(orderSummary?.total)} is complete. You will be redirected
            shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <section className="cart-hero">
        <div className="cart-hero-copy">
          <p className="cart-kicker">Refined checkout</p>
          <h1>Build a cleaner checkout experience for your customers</h1>
          <p>
            Review the basket, choose a sample payment method, and place a demo
            order with a more polished storefront layout.
          </p>
        </div>
        <div className="cart-hero-card">
          <span className="cart-hero-count">{itemCount}</span>
          <span className="cart-hero-label">
            {itemCount === 1 ? 'item ready' : 'items ready'}
          </span>
          <strong>${formatPrice(total)}</strong>
          <small>Secure demo checkout</small>
        </div>
      </section>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-badge">Nothing here yet</div>
          <h2>Your cart is waiting for something good</h2>
          <p>
            Browse the catalog, add products you like, and come back here to try
            the new payment experience.
          </p>
          <Link to="/" className="shop-btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-main">
            <div className="cart-panel">
              <div className="panel-header">
                <div>
                  <p className="panel-eyebrow">Basket overview</p>
                  <h2>{itemCount} items in your bag</h2>
                </div>
                <button onClick={clearCart} className="ghost-btn">
                  Clear Cart
                </button>
              </div>

              <div className="cart-items-list">
                {cart.map((item) => (
                  <article key={item.id} className="cart-item-card">
                    <div className="cart-item-media">
                      <img
                        src={
                          item.imageUrl ||
                          'https://via.placeholder.com/220x220?text=ShopHub'
                        }
                        alt={item.title}
                        onError={(e) => {
                          e.target.src =
                            'https://via.placeholder.com/220x220?text=ShopHub';
                        }}
                      />
                    </div>
                    <div className="cart-item-content">
                      <div className="cart-item-copy">
                        <span className="item-tag">Store pick</span>
                        <Link to={`/product/${item.id}`} className="item-link">
                          {item.title}
                        </Link>
                        <p>{item.description || 'A featured product ready to ship.'}</p>
                      </div>
                      <div className="cart-item-footer">
                        <div className="quantity-picker">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, Math.max(1, item.quantity - 1))
                            }
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.id, parseInt(e.target.value, 10) || 1)
                            }
                          />
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-price">
                      <span>Unit price</span>
                      <strong>${formatPrice(item.price)}</strong>
                      <small>${formatPrice(item.price * item.quantity)} total</small>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="checkout-sidebar">
            <div className="checkout-card cart-summary">
              <div className="panel-header compact">
                <div>
                  <p className="panel-eyebrow">Summary</p>
                  <h2>Order total</h2>
                </div>
              </div>
              <div className="summary-item">
                <span>Subtotal</span>
                <span>${formatPrice(subtotal)}</span>
              </div>
              <div className="summary-item">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${formatPrice(shipping)}`}</span>
              </div>
              <div className="summary-item">
                <span>Service fee</span>
                <span>${formatPrice(serviceFee)}</span>
              </div>
              <div className="summary-item total">
                <span>Total</span>
                <span>${formatPrice(total)}</span>
              </div>
              <div className="summary-note">
                Complimentary shipping unlocks automatically once the cart reaches
                $200.
              </div>
            </div>

            <div className="checkout-card payment-card">
              <div className="panel-header compact">
                <div>
                  <p className="panel-eyebrow">Sample payment</p>
                  <h2>Choose how to pay</h2>
                </div>
              </div>
              <div className="payment-methods">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    className={`payment-method-card ${
                      paymentMethod === method.id ? 'selected' : ''
                    }`}
                    onClick={() => handlePaymentMethodChange(method.id)}
                  >
                    <div>
                      <strong>{method.title}</strong>
                      <p>{method.description}</p>
                    </div>
                    <span>{method.badge}</span>
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="payment-form">
                  <label>
                    Name on card
                    <input
                      type="text"
                      name="cardName"
                      value={paymentDetails.cardName}
                      onChange={handlePaymentDetailChange}
                      placeholder="Tahmid Hossain"
                    />
                  </label>
                  <label>
                    Card number
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentDetails.cardNumber}
                      onChange={handlePaymentDetailChange}
                      placeholder="4242 4242 4242 4242"
                    />
                  </label>
                  <div className="payment-row">
                    <label>
                      Expiry
                      <input
                        type="text"
                        name="expiry"
                        value={paymentDetails.expiry}
                        onChange={handlePaymentDetailChange}
                        placeholder="08/28"
                      />
                    </label>
                    <label>
                      CVV
                      <input
                        type="password"
                        name="cvv"
                        value={paymentDetails.cvv}
                        onChange={handlePaymentDetailChange}
                        placeholder="123"
                      />
                    </label>
                  </div>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="payment-form">
                  <label>
                    Wallet provider
                    <select
                      name="walletProvider"
                      value={paymentDetails.walletProvider}
                      onChange={handlePaymentDetailChange}
                    >
                      <option value="bKash">bKash</option>
                      <option value="Nagad">Nagad</option>
                      <option value="Rocket">Rocket</option>
                    </select>
                  </label>
                  <label>
                    Wallet number
                    <input
                      type="text"
                      name="walletNumber"
                      value={paymentDetails.walletNumber}
                      onChange={handlePaymentDetailChange}
                      placeholder="01XXXXXXXXX"
                    />
                  </label>
                  <label>
                    Wallet PIN
                    <input
                      type="password"
                      name="walletPin"
                      value={paymentDetails.walletPin}
                      onChange={handlePaymentDetailChange}
                      placeholder="1234"
                    />
                  </label>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="payment-info-box">
                  <strong>Cash on Delivery selected</strong>
                  <p>
                    This demo flow will confirm the order now and mark payment as
                    due when the package arrives.
                  </p>
                </div>
              )}

              <label className="delivery-note">
                Delivery note
                <textarea
                  name="deliveryNote"
                  value={paymentDetails.deliveryNote}
                  onChange={handlePaymentDetailChange}
                  placeholder="Gate code, floor, landmark, or leave blank."
                  rows="3"
                />
              </label>

              {checkoutError && (
                <div className="checkout-error">{checkoutError}</div>
              )}
            </div>

            <div className="checkout-card trust-card">
              <div className="trust-list">
                <div>
                  <strong>Protected checkout</strong>
                  <p>Payment fields are for demo purposes and stay in the browser.</p>
                </div>
                <div>
                  <strong>Quick confirmation</strong>
                  <p>The order clears the cart and returns the user to the storefront.</p>
                </div>
              </div>
              <button onClick={handleCheckout} className="checkout-btn">
                {user
                  ? `Pay $${formatPrice(total)} with ${selectedPaymentMethod?.title}`
                  : 'Login to Continue'}
              </button>
              <button
                onClick={() => navigate('/')}
                className="continue-shopping"
              >
                Continue Shopping
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
