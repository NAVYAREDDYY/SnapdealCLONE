import { useEffect, useState } from "react";
import axios from "axios";
import "./TrendingProducts.css";
import { Link } from "react-router-dom";

function TrendingProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/products?limit=9") // Get 18 products for trending section
      .then(res => {
        // Randomly shuffle products to simulate trending items
        const shuffled = [...res.data].sort(() => 0.5 - Math.random());
        setProducts(shuffled);
      })
      .catch(() => setProducts([]));
  }, []);

  return (
    
    <div className="trending-section">
      <div className="trending-header">
        <h3 className="trending-title">TRENDING PRODUCTS</h3>
        <Link to="/products" className="view-all-link">View All</Link>
      </div>
      <div className="trending-grid">
        {products.map(product => (
          <Link to={`/product/${product._id}`} key={product._id} className="trending-card-link">
            <div className="trending-card">
              <div className="trending-img-wrap">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  loading="lazy"
                />
              </div>
              <div className="trending-info">
                <div className="trending-name">{product.name}</div>
                <div className="trending-price">
                  <span className="price">₹{product.price}</span>
                  {product.mrp > product.price && (
                    <span className="mrp">₹{product.mrp}</span>
                  )}
                </div>
                {product.mrp > product.price && (
                  <div className="trending-discount">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TrendingProducts;
