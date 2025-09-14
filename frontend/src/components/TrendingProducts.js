import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./TrendingProducts.css";
import { Link } from "react-router-dom";

function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const scrollContainerRef = useRef(null);

  // const scrollLeft = () => {
  //   if (scrollContainerRef.current) {
  //     scrollContainerRef.current.scrollBy({ left: -220, behavior: 'smooth' });
  //   }
  // };

  // const scrollRight = () => {
  //   if (scrollContainerRef.current) {
  //     scrollContainerRef.current.scrollBy({ left: 220, behavior: 'smooth' });
  //   }
  // };
// const scrollLeft = () => {
//   if (scrollContainerRef.current) {
//     const container = scrollContainerRef.current;
//     const cardWidth = container.querySelector(".trending-card").offsetWidth;
//     const cardsToScroll = 3; // scroll 3 cards at a time
//     container.scrollBy({ left: -cardWidth * cardsToScroll, behavior: "smooth" });
//   }
// };

// const scrollRight = () => {
//   if (scrollContainerRef.current) {
//     const container = scrollContainerRef.current;
//     const cardWidth = container.querySelector(".trending-card").offsetWidth;
//     const cardsToScroll = 3; // scroll 3 cards at a time
//     container.scrollBy({ left: cardWidth * cardsToScroll, behavior: "smooth" });
//   }
// };
const scrollLeft = () => {
  if (scrollContainerRef.current) {
    const container = scrollContainerRef.current;
    const scrollAmount = container.offsetWidth; // scroll width of visible area
    container.scrollBy({ left: -scrollAmount, behavior: "smooth" }); // scroll left
  }
};

const scrollRight = () => {
  if (scrollContainerRef.current) {
    const container = scrollContainerRef.current;
    const scrollAmount = container.offsetWidth; // scroll width of visible area
    container.scrollBy({ left: scrollAmount, behavior: "smooth" }); // scroll right
  }
};


  useEffect(() => {
    axios.get("http://localhost:5000/products?limit=10") // Get 10 products for trending section
      .then(res => {
        // Randomly shuffle products to simulate trending items
        const shuffled = [...res.data].sort(() => 0.5 - Math.random());
        setProducts(shuffled);
      })
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="trending-section">
      <h3 className="trending-title">TRENDING PRODUCTS</h3>
      <div className="nav-arrow prev" onClick={scrollLeft}>
        <svg viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </div>
      <div className="nav-arrow next" onClick={scrollRight}>
        <svg viewBox="0 0 24 24">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </div>
      <div className="trending-list" ref={scrollContainerRef}>
        {products.map(product => (
          <Link to={`/product/${product._id}`} key={product._id} className="trending-card">
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
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TrendingProducts;
