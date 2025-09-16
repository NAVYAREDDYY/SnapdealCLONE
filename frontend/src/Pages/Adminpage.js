import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPage.css";

function AdminDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    stock: "",
    category: "",
    subCategory: "",
    color: "",
    sizes: "",
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState({
    add: false,
    edit: false,
    delete: false,
    fetch: false,
  });

  const getCurrentToken = () => {
    const user = localStorage.getItem("currentUser");
    if (!user) return null;
    try {
      const parsed = JSON.parse(user);
      return parsed?.token || null;
    } catch {
      return null;
    }
  };

  const token = getCurrentToken();

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(prev => ({ ...prev, fetch: true }));
      try {
        const res = await axios.get("http://localhost:5000/products", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setProducts(res.data);
      } catch (err) {
        showNotification("Failed to load products", "error");
      } finally {
        setLoading(prev => ({ ...prev, fetch: false }));
      }
    };
    const fetchOrders = async () => {
      try {
        if (!token) return;
        const res = await axios.get("http://localhost:5000/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setOrders(res.data.orders || []);
      } catch (e) {
        // non-blocking
      }
    };
    fetchProducts();
    fetchOrders();
  }, [token]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return showNotification("You must be logged in as an admin", "error");

    try {
      const price = parseFloat(formData.price);
      const stock = parseInt(formData.stock);

      if (!formData.name.trim() || !formData.category.trim()) throw new Error("Name and Category are required");
      if (isNaN(price) || price <= 0) throw new Error("Price must be greater than 0");
      if (isNaN(stock) || stock < 0) throw new Error("Stock cannot be negative");

      setLoading(prev => ({ ...prev, add: true }));
      await axios.post("http://localhost:5000/products/add", { 
        ...formData, 
        price, 
        stock,
        // backend expects subcategory; keep both keys for compatibility
        subcategory: formData.subCategory,
        sizes: formData.sizes,
        color: formData.color
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showNotification("Product added successfully!");
      setFormData({ name: "", price: "", description: "", image: "", stock: "", category: "", subCategory: "", color: "", sizes: "" });

      const res = await axios.get("http://localhost:5000/products", { headers: { Authorization: `Bearer ${token}` } });
      setProducts(res.data);

    } catch (err) {
      showNotification(err.response?.data?.message || err.message, "error");
    } finally {
      setLoading(prev => ({ ...prev, add: false }));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({ 
      ...product, 
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      subCategory: product.subcategory || product.subCategory || "",
      color: product.color || "",
      sizes: Array.isArray(product.sizes) ? product.sizes.map(s=> s.name || s).join(", ") : (product.sizes || "")
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!token) return showNotification("You must be logged in as an admin", "error");

    try {
      setLoading(prev => ({ ...prev, edit: true }));

      const price = parseFloat(editingProduct.price);
      const stock = parseInt(editingProduct.stock);

      if (!editingProduct.name.trim() || !editingProduct.category.trim()) throw new Error("Name and Category are required");
      if (isNaN(price) || price <= 0) throw new Error("Price must be greater than 0");
      if (isNaN(stock) || stock < 0) throw new Error("Stock cannot be negative");

      // Prepare sizes payload
      const sizesPayload = editingProduct.sizes
        ? String(editingProduct.sizes)
            .split(',')
            .map(s=>s.trim())
            .filter(Boolean)
        : undefined;

      await axios.put(`http://localhost:5000/products/${editingProduct._id}`, { 
        ...editingProduct, 
        price, 
        stock,
        subcategory: editingProduct.subCategory,
        sizes: sizesPayload,
        color: editingProduct.color
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      setShowEditModal(false);
      setEditingProduct(null);

      const res = await axios.get("http://localhost:5000/products", { headers: { Authorization: `Bearer ${token}` } });
      setProducts(res.data);
      showNotification("Product updated successfully!");

    } catch (err) {
      showNotification(err.response?.data?.message || err.message, "error");
    } finally {
      setLoading(prev => ({ ...prev, edit: false }));
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!token) return showNotification("You must be logged in as an admin", "error");

    try {
      setLoading(prev => ({ ...prev, delete: true }));

      await axios.delete(`http://localhost:5000/products/${productToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      setShowDeleteModal(false);
      setProductToDelete(null);

      const res = await axios.get("http://localhost:5000/products", { headers: { Authorization: `Bearer ${token}` } });
      setProducts(res.data);

      showNotification("Product deleted successfully!");
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, "error");
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  return (
    <div className="admin-dashboard">
      {notification.show && <div className={`notification ${notification.type}`}>{notification.message}</div>}

      <header className="admin-header"><h1>Admin Dashboard</h1></header>

      {/* Add Product */}
      <div className="product-form">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {["name","price","stock","category","subCategory","color","sizes","image","description"].map(field => (
              <div key={field} className="input-group">
                <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                {field === "description" ? (
                  <textarea id={field} name={field} value={formData[field]} onChange={handleChange} required />
                ) : (
                  <input
                    id={field}
                    type={field==="price"||field==="stock"?"number":"text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                  />
                )}
              </div>
            ))}
          </div>
          <button type="submit" className={`submit-button ${loading.add?"loading":""}`} disabled={loading.add}>
            {loading.add ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>

      {/* Product List */}
      <div className="products-section">
        <h2>Product List</h2>
        <div className="products-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <img src={product.image || "https://via.placeholder.com/200x200?text=No+Image"} alt={product.name} className="product-image" />
              <div className="product-details">
                <h3>{product.name}</h3>
                <p><strong>Price:</strong> ₹{product.price}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>SubCategory:</strong> {product.subCategory}</p>
                {product.color && <p><strong>Color:</strong> {product.color}</p>}
                {Array.isArray(product.sizes) && product.sizes.length>0 && (
                  <p><strong>Sizes:</strong> {product.sizes.map(s => s.name || s).join(', ')}</p>
                )}
                <p><strong>Stock:</strong> {product.stock}</p>
                <p><strong>Description:</strong> {product.description}</p>
              </div>
              <div className="product-actions">
                <button className={`action-button edit-button ${loading.edit?"loading":""}`} onClick={() => handleEdit(product)} disabled={loading.edit}>
                  {loading.edit ? "Editing..." : "Edit"}
                </button>
                <button
                  className={`action-button delete-button ${loading.delete ? "loading" : ""}`}
                  onClick={(e) => { e.stopPropagation(); handleDeleteClick(product); }}
                  disabled={loading.delete}
                >
                  {loading.delete ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-section">
        <h2>Recent Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="orders-grid">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div><strong>Order ID:</strong> {order.orderId || order._id}</div>
                <div><strong>User:</strong> {order.userId?.name} ({order.userId?.email})</div>
                <div><strong>Total:</strong> ₹{order.totalAmount}</div>
                <div><strong>Payment:</strong> {order.paymentStatus}</div>
                <div><strong>Status:</strong> {order.orderStatus}</div>
                <div style={{ marginTop: 8 }}>
                  <strong>Items:</strong>
                  <ul style={{ paddingLeft: 18 }}>
                    {order.items?.map((it, idx) => (
                      <li key={idx}>
                        {(it.productId?.name || it.name)} x {it.quantity} @ ₹{it.price}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>Placed: {new Date(order.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <div className="modal" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={()=>setShowEditModal(false)}>×</button>
            <h2>Edit Product</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-grid">
                {["name","price","stock","category","subCategory","image","description"].map(field => (
                  <div key={field} className="input-group">
                    <label htmlFor={`edit-${field}`}>{field.charAt(0).toUpperCase()+field.slice(1)}</label>
                    {field==="description" ? (
                      <textarea
                        id={`edit-${field}`}
                        name={field}
                        value={editingProduct?.[field] || ""}
                        onChange={handleEditChange}
                        required
                      />
                    ) : (
                      <input
                        id={`edit-${field}`}
                        type={field==="price"||field==="stock"?"number":"text"}
                        name={field}
                        value={editingProduct?.[field] || ""}
                        onChange={handleEditChange}
                        required
                      />
                    )}
                  </div>
                ))}
              </div>
              <button type="submit" className={`submit-button ${loading.edit?"loading":""}`} disabled={loading.edit}>
                {loading.edit ? "Updating..." : "Update Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && productToDelete && (
        <div className="modal" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete "{productToDelete.name}"?</p>
            <div style={{display:"flex", gap:"1rem", marginTop:"1rem"}}>
              <button className="action-button delete-button" onClick={handleDeleteConfirm}>Yes, Delete</button>
              <button className="action-button" onClick={()=>{setShowDeleteModal(false);setProductToDelete(null)}} style={{backgroundColor:"#666"}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
