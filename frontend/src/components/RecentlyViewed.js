import { useEffect, useState } from "react";
import axios from "axios";
import "./RecentlyViewed.css";

function RecentlyViewed() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Get recently viewed product IDs from localStorage
    const ids = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    if (ids.length === 0) return;
    axios.get(`http://localhost:5000/products?ids=${ids.join(",")}`)
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  if (!products.length) return null;

  return (
    <div className="recently-viewed-section">
      <h3 className="recently-viewed-title">Recently Viewed</h3>
      <div className="recently-viewed-list">
        {products.map(prod => (
          <div className="recently-viewed-card" key={prod._id}>
            <img src={prod.image} alt={prod.name} />
            <div className="recently-viewed-name">{prod.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentlyViewed;