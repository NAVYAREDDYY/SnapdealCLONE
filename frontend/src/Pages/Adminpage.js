import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    stock: "",
    category: "",
  });
  const [products, setProducts] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
      alert(res.data.message);
      fetchProducts(); 
    } catch (err) {
      alert("Error: " + err.response?.data?.message || err.message);
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
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
        <input type="text" name="description" placeholder="Description" onChange={handleChange} />
        <input type="text" name="image" placeholder="Image URL" onChange={handleChange} />
        <input type="number" name="stock" placeholder="Stock" onChange={handleChange} />
        <input type="text" name="category" placeholder="Category" onChange={handleChange} />
        <button type="submit">Add Product</button>
      </form>

      <h4>All Products</h4>
      <ul>
        {products.map((p) => (
          <li key={p._id}>
            <strong>{p.name}</strong> - ₹{p.price} ({p.category})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
