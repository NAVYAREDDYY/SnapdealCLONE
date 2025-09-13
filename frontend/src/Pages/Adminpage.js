import React, { useState, useEffect } from "react";
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
  });
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (parseFloat(formData.price) <= 0) {
        showNotification('Price must be greater than 0', 'error');
        return;
      }
      if (parseInt(formData.stock) < 0) {
        showNotification('Stock cannot be negative', 'error');
        return;
      }

      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/products/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );
      console.log(res.data);
      showNotification('Product added successfully!');
      setFormData({
        name: "",
        price: "",
        description: "",
        image: "",
        stock: "",
        category: "",
        subCategory: "",
      });
      fetchProducts();
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, 'error');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (parseFloat(editingProduct.price) <= 0) {
        showNotification('Price must be greater than 0', 'error');
        return;
      }
      if (parseInt(editingProduct.stock) < 0) {
        showNotification('Stock cannot be negative', 'error');
        return;
      }

      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/products/${editingProduct._id}`,
        editingProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowEditModal(false);
      fetchProducts();
      showNotification('Product updated successfully!');
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, 'error');
    }
  };

  const handleEditChange = (e) => {
    setEditingProduct({
      ...editingProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/products/${productToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts();
      showNotification('Product deleted successfully!');
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, 'error');
    }
  };


  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products:", err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="admin-dashboard">
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
      </header>

      <div className="product-form">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="name">Product Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="price">Price (₹)</label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="stock">Stock</label>
              <input
                id="stock"
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="subCategory">Sub Category</label>
              <input
                id="subCategory"
                type="text"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="image">Image URL</label>
              <input
                id="image"
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="submit-button">Add Product</button>
        </form>
      </div>

      <div className="products-section">
        <h2>Product List</h2>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                }}
              />
              <div className="product-details">
                <h3>{product.name}</h3>
                <p><strong>Price:</strong> ₹{product.price}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Stock:</strong> {product.stock}</p>
                <p><strong>Description:</strong> {product.description}</p>
              </div>
              <div className="product-actions">
                <button
                  className="action-button edit-button"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
                <button
                  className="action-button delete-button"
                  onClick={() => handleDeleteClick(product)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showDeleteModal && productToDelete && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete the product "{productToDelete.name}"?</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                className="action-button delete-button"
                onClick={handleDeleteConfirm}
              >
                Yes, Delete
              </button>
              <button
                className="action-button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                style={{ backgroundColor: '#666' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingProduct && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowEditModal(false)}>×</button>
            <h2>Edit Product</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="edit-name">Product Name</label>
                  <input
                    id="edit-name"
                    type="text"
                    name="name"
                    value={editingProduct.name}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="edit-price">Price (₹)</label>
                  <input
                    id="edit-price"
                    type="number"
                    name="price"
                    value={editingProduct.price}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="edit-stock">Stock</label>
                  <input
                    id="edit-stock"
                    type="number"
                    name="stock"
                    value={editingProduct.stock}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="edit-category">Category</label>
                  <input
                    id="edit-category"
                    type="text"
                    name="category"
                    value={editingProduct.category}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="edit-image">Image URL</label>
                  <input
                    id="edit-image"
                    type="text"
                    name="image"
                    value={editingProduct.image}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="edit-description">Description</label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={editingProduct.description}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="submit-button">Update Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
