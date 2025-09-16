import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./OrdersPage.css";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trackOrder, setTrackOrder] = useState(null);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser")) || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
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
  }, [user]);

  const stages = [
    { key: "placed", label: "Placed" },
    { key: "packed", label: "Packed" },
    { key: "shipped", label: "Shipped" },
    { key: "outForDelivery", label: "Out For Delivery" },
    { key: "delivered", label: "Delivered" }
  ];

  const computeReachedIndex = (order) => {
    // Map backend statuses to timeline progression
    const status = (order?.orderStatus || "pending").toLowerCase();
    if (status === "cancelled") return -1;
    if (status === "delivered") return 4;
    if (status === "shipped") return 2;
    if (status === "processing") return 1; // packed
    // pending or unknown => only placed
    return 0;
  };

  return (
    <div className="orders-page">
      <div className="account-sidebar">
        <div className="account-header">My Account</div>
        <div className="account-user">
          <div className="avatar-circle">{user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}</div>
          <div className="user-info">
            <div className="user-name">{user?.name || "User"}</div>
            <div className="user-email">{user?.email}</div>
          </div>
        </div>
        <div className="account-menu">
          <div className="menu-section">ORDERS</div>
          <div className="menu-item active">Orders</div>
          <div className="menu-section">PROFILE</div>
          <div className="menu-item">Saved Addresses</div>
          <div className="menu-item">Saved Cards</div>
          <div className="menu-item">Change Password</div>
          <div className="menu-section">PAYMENTS</div>
          <div className="menu-item">E-Gift Voucher Balance</div>
        </div>
      </div>

      <div className="orders-content">
        <h5 className="orders-title">My Orders</h5>
        {loading && <p>Loading...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && orders.length === 0 && <p>No orders found.</p>}

        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-card-header">
              <div>
                <span className="muted">Order ID:</span> <b>{order.orderId || order._id}</b>
              </div>
              <button className="details-btn">DETAILS</button>
            </div>
            <div className="order-meta muted">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </div>

            <div className="order-main">
              <div className="order-product">
                <img
                  src={order.items?.[0]?.productId?.image || order.items?.[0]?.image}
                  alt={order.items?.[0]?.productId?.name || order.items?.[0]?.name}
                />
              </div>
              <div className="order-info">
                <div className="order-name">
                  {order.items?.[0]?.productId?.name || order.items?.[0]?.name}
                  {order.items && order.items.length > 1 ? ` +${order.items.length - 1} more` : ""}
                </div>
                <div className="order-variant muted">
                  <span>Size: {order.items?.[0]?.selectedSize || order.items?.[0]?.size || "-"}</span>
                  <span className="divider">|</span>
                  <span>Color: {order.items?.[0]?.color || "-"}</span>
                </div>

                <div className="order-actions">
                  <button className="ghost-btn">CANCEL</button>
                  <button className="track-btn" onClick={() => setTrackOrder(order)}>TRACK</button>
                </div>
              </div>
            </div>

            <div className="order-timeline">
              {stages.map((stage, idx) => {
                const reached = computeReachedIndex(order);
                const active = idx <= reached;
                return (
                  <div key={stage.key} className={`tl-item ${active ? "active" : ""}`}>
                    <div className="tl-dot" />
                    <div className="tl-label">{stage.label}</div>
                  </div>
                );
              })}
            </div>

            <div className="order-footer">
              <div className="status">
                <span className={`status-pill ${order.paymentStatus === "completed" ? "green" : "orange"}`}>
                  {order.paymentStatus === "completed" ? "ORDER CONFIRMED" : (order.paymentStatus || "PENDING").toUpperCase()}
                </span>
              </div>
              <div className="est-delivery muted">
                Est. Delivery: {new Date(new Date(order.createdAt).getTime() + 7*24*60*60*1000).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {trackOrder && (
        <div className="modal" onClick={() => setTrackOrder(null)}>
          <div className="modal-content" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-header">
              <div>Tracking Order {trackOrder.orderId || trackOrder._id}</div>
              <button className="close-x" onClick={() => setTrackOrder(null)}>×</button>
            </div>
            <div className="track-modal-body">
              <div className="timeline-vertical">
                {stages.map((stage, idx) => {
                  const reached = computeReachedIndex(trackOrder);
                  const active = idx <= reached;
                  return (
                    <div key={stage.key} className={`v-item ${active ? "active" : ""}`}>
                      <div className="v-dot" />
                      <div className="v-text">
                        <div className="v-title">{stage.label}</div>
                        <div className="v-date muted">
                          {idx === 0 ? new Date(trackOrder.createdAt).toLocaleString() : "Pending"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
