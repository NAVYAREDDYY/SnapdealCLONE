import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, increaseQty, decreaseQty } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import "./ViewCart.css";

function ViewCart() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const mrpTotal = cartItems.reduce(
    (total, item) => total + (item.price * 1.2) * item.quantity,
    0
  );

  const totalSavings = mrpTotal - totalPrice;
  const deliveryCharge = totalPrice > 500 ? 0 : 40;

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <img src="/empty-cart.png" alt="Empty Cart" className="empty-cart-image" />
        <h2 className="empty-cart">Your Shopping Cart is empty</h2>
        <p className="empty-cart-message">Add items to it now.</p>
        <button className="shop-now-btn" onClick={() => navigate("/")}>Shop Now</button>
      </div>
    );
  }

  return (
    <div className="view-cart-page">
      <div className="cart-header-section">
        <div className="cart-header">
          <h2 className="cart-title">Shopping Cart ({cartItems.length} Items)</h2>
          <div className="pincode-checker">
            <input type="text" placeholder="Enter pincode" className="pincode-input" />
            <button className="check-btn">Check</button>
          </div>
        </div>
      </div>

      <div className="view-cart-container">
        <div className="cart-left-section">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                <div className="item-image-section">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <div className="price-section">
                    <span className="current-price">Rs. {item.price}</span>
                    <span className="mrp-price">MRP Rs. {Math.round(item.price * 1.2)}</span>
                    <span className="discount">20% Off</span>
                  </div>
                  <div className="delivery-info">
                    Delivery expected by {new Date(Date.now() + 4*24*60*60*1000).toLocaleDateString()}
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-quantity">
                      <button onClick={() => dispatch(decreaseQty(item._id))}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => dispatch(increaseQty(item._id))}>+</button>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => dispatch(removeFromCart(item._id))}
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-right-section">
          <div className="price-details">
            <h3 className="price-summary-title">Price Details</h3>
            <div className="price-summary-item">
              <span>Price ({cartItems.length} Items)</span>
              <span>Rs. {Math.round(mrpTotal)}</span>
            </div>
            <div className="price-summary-item">
              <span>Discount</span>
              <span className="discount-amount">-Rs. {Math.round(totalSavings)}</span>
            </div>
            <div className="price-summary-item">
              <span>Delivery Charges</span>
              <span className={deliveryCharge === 0 ? 'free-delivery' : ''}>
                {deliveryCharge === 0 ? 'FREE' : `Rs. ${deliveryCharge}`}
              </span>
            </div>
            <div className="total-amount">
              <span>Total Amount</span>
              <span>Rs. {totalPrice + deliveryCharge}</span>
            </div>
            <div className="total-savings">
              You will save Rs. {Math.round(totalSavings)} on this order
            </div>
          </div>
          <button 
            className="checkout-btn" 
            onClick={() => navigate("/checkout")}
          >
            PROCEED TO PAY
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewCart;
