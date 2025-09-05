import { useEffect, useState } from "react";
import axios from "axios";
import "./Products.css"; 
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="products-container">
      {products.map((product) => (
        <div key={product._id} className="product-card">
            <Link to={`/product/${product._id}`}>
          <img src={product.image} alt={product.name} />
          <h6>{product.name}</h6>
          <p>₹{product.price}</p>
          {product.originalPrice && <span className="original-price">₹{product.originalPrice}</span>}
    
          </Link>
          
        </div>
      ))}
    </div>
  );
}

export default Products;
