import { useSelector } from "react-redux";
import { useState } from "react";
import "./CheckoutPage.css";

function CheckoutPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    pincode: "",
    house: "",
    city: "",
    state: "",
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsSaved(true);
  };

  const handleEdit = () => {
    setIsSaved(false);
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>

      <div className="checkout-grid">
        {/* LEFT SIDE */}
        <div className="checkout-left">
          {/* Address Section */}
          <div className="checkout-section">
            <h3>Delivery Address</h3>
            <form className="address-form">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={address.fullName}
                onChange={handleChange}
                disabled={isSaved}
                required
              />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                value={address.mobile}
                onChange={handleChange}
                disabled={isSaved}
                required
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={address.pincode}
                onChange={handleChange}
                disabled={isSaved}
                required
              />
              <input
                type="text"
                name="house"
                placeholder="Address (House No, Street)"
                value={address.house}
                onChange={handleChange}
                disabled={isSaved}
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleChange}
                disabled={isSaved}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={address.state}
                onChange={handleChange}
                disabled={isSaved}
                required
              />
            </form>

            {/* Save / Edit Buttons */}
            {!isSaved ? (
              <button className="address-btn save-btn" onClick={handleSave}>
                Save
              </button>
            ) : (
              <button className="address-btn edit-btn" onClick={handleEdit}>
                Edit
              </button>
            )}
          </div>

          {/* Payment Section */}
          <div className="checkout-section">
            <h3>Payment Method</h3>
            <label>
              <input type="radio" name="payment" defaultChecked /> Cash on Delivery
            </label>
            <label>
              <input type="radio" name="payment" /> UPI / Net Banking / Card
            </label>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="checkout-right">
          <div className="order-summary">
            <h3>Order Summary</h3>
            {cartItems.map((item, index) => (
              <div key={index} className="order-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <span>Qty: {item.quantity}</span>
                </div>
                <p>₹{item.price * item.quantity}</p>
              </div>
            ))}
            <hr />
            <h4>Total: ₹{total}</h4>
            <button className="place-order-btn">Place Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
