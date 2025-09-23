import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./OrdersPage.css";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trackOrder, setTrackOrder] = useState(null);
  const [detailsOrder, setDetailsOrder] = useState(null);

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
        if (!user?.token) {
          setError("You must be logged in to view orders.");
          return;
        }
        const { data } = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.token]);

  const stages = [
    { key: "placed", label: "Placed" },
    { key: "packed", label: "Packed" },
    { key: "shipped", label: "Shipped" },
    { key: "outForDelivery", label: "Out For Delivery" },
    { key: "delivered", label: "Delivered" },
  ];

  const computeReachedIndex = (order) => {
    const status = (order?.orderStatus || "pending").toLowerCase();
    if (status === "cancelled") return -1;
    switch (status) {
      case "delivered": return 4;
      case "shipped": return 2;
      case "processing": return 1;
      default: return 0;
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: "cancelled" } : o));
      alert("Order cancelled successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order");
    }
  };

  return (
    <div className="orders-page">
      {/* Sidebar */}
      <div className="account-sidebar">
        <div className="account-header">My Account</div>
        <div className="account-user">
          <div className="avatar-circle">
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
          </div>
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

      {/* Orders Content */}
      <div className="orders-content">
        <h5 className="orders-title">My Orders</h5>
        {loading && <p>Loading...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && orders.length === 0 && <p>No orders found.</p>}

        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-card-header">
              <div>
                <span className="muted">Order ID:</span>{" "}
                <b>{order.orderId || order._id}</b>
              </div>
              <button className="details-btn" onClick={() => setDetailsOrder(order)}>
                DETAILS
              </button>
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
                  <span>
                    Size: {order.items?.[0]?.selectedSize || order.items?.[0]?.size || "-"}
                  </span>
                  <span className="divider">|</span>
                  <span>
                    Color: {order.items?.[0]?.color || order.items?.[0]?.productId?.color || "-"}
                  </span>
                </div>

                <div className="order-actions">
                  {order.orderStatus !== "cancelled" && (
                    <button className="ghost-btn" onClick={() => handleCancel(order._id)}>
                      CANCEL
                    </button>
                  )}
                  <button className="track-btn" onClick={() => setTrackOrder(order)}>
                    TRACK
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="order-timeline">
              {stages.map((stage, idx) => {
                const reached = computeReachedIndex(order);
                return (
                  <div key={stage.key} className={`tl-item ${idx <= reached ? "active" : ""}`}>
                    <div className="tl-dot" />
                    <div className="tl-label">{stage.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="order-footer">
            <div className="status">
  <span
              className={`status-pill ${
                    order.orderStatus === "cancelled"
                   ? "red"
                   : order.paymentStatus === "completed"
                   ? "green"
                  : "orange"
                              }`}
                                >
                         {order.orderStatus === "cancelled"
                        ? "ORDER CANCELLED"
                           : order.paymentStatus === "completed"
                   ? "ORDER CONFIRMED"
                     : (order.paymentStatus || "PENDING").toUpperCase()}
  </span>
</div>

              <div className="est-delivery muted">
                Est. Delivery: {new Date(new Date(order.createdAt).getTime() + 7*24*60*60*1000).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TRACK Modal */}
      {trackOrder && (
        <div className="modal" onClick={() => setTrackOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>Tracking Order {trackOrder.orderId || trackOrder._id}</div>
              <button className="close-x" onClick={() => setTrackOrder(null)}>×</button>
            </div>
            <div className="track-modal-body">
              <div className="timeline-vertical">
                {stages.map((stage, idx) => {
                  const reached = computeReachedIndex(trackOrder);
                  return (
                    <div key={stage.key} className={`v-item ${idx <= reached ? "active" : ""}`}>
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

      {/* DETAILS Modal */}
      {detailsOrder && (
        <div className="modal" onClick={() => setDetailsOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>Order Details: {detailsOrder.orderId || detailsOrder._id}</div>
              <button className="close-x" onClick={() => setDetailsOrder(null)}>×</button>
            </div>
            <div className="track-modal-products">
              {detailsOrder.items?.map((item, idx) => {
                const product = item.productId || item;
                return (
                  <div key={idx} className="track-modal-product">
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: 80, height: 80, objectFit: "cover" }}
                    />
                    <div>Name: {product.name}</div>
                    <div>Price: ₹{item.price || product.price}</div>
                    <div>Size: {item.selectedSize || "-"}</div>
                    <div>Color: {product.color || "-"}</div>
                    <div>Quantity: {item.quantity || 1}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
