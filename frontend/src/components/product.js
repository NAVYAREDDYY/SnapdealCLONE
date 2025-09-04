import { useEffect, useState } from "react";
import axios from "axios";
import "./Products.css"; 

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
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>₹{product.price}</p>
          {product.originalPrice && <span className="original-price">₹{product.originalPrice}</span>}
          <button>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

export default Products;
