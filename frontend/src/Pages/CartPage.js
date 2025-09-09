import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, increaseQty, decreaseQty } from "../redux/cartSlice";
import "./CartPage.css";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  if (cartItems.length === 0) {
    return <h2 className="empty-cart">Your cart is empty</h2>;
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>

      {cartItems.map((item) => (
        <div className="cart-item" key={item._id}>
          <img src={item.image} alt={item.name} className="cart-item-img" />
          <div className="cart-item-details">
            <h3 className="cart-item-name">{item.name}</h3>
            <p className="cart-item-price">₹{item.price}</p>   
            <div className="cart-quantity">
              <button onClick={() => dispatch(decreaseQty(item._id))}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => dispatch(increaseQty(item._id))}>+</button>
            </div>
            <button
              className="remove-btn"
              onClick={() => dispatch(removeFromCart(item._id))}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

     
      <div className="cart-summary">
        <h3>Subtotal: ₹{totalPrice}</h3>
        <button className="checkout-btn"onClick={() => Navigate("/checkout")}>Proceed to Checkout</button>
      </div>
    </div>
  );
}

export default CartPage;
