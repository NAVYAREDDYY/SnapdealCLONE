import { useEffect, useState } from "react";
import axios from "axios";
import "./OrdersPage.css";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user || !user.token) {
          setError("You must be logged in to view orders.");
          setLoading(false);
          return;
        }
        const { data } = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setOrders(data.orders || []);
      } catch (err) {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && orders.length === 0 && <p>No orders found.</p>}
      {orders.map(order => (
        <div key={order._id} className="order-card">
          <div><b>Order ID:</b> {order.orderId || order._id}</div>
          <div><b>Total Amount:</b> ₹{order.totalAmount}</div>
          <div><b>Payment Status:</b> {order.paymentStatus}</div>
          <div>
            <b>Products:</b>
            <ul className="products-list">
              {order.items.map((item, idx) => (
                <li key={idx} className="product-item">
                  <img src={item.productId?.image || item.image} alt={item.productId?.name || item.name} />
                  <span>
                    {item.productId?.name || item.name} x {item.quantity} @ ₹{item.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrdersPage;
