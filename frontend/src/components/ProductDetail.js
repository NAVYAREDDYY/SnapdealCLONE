import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Rating from "./Rating";
import Footer from "./footer";
import "./ProductDetail.css";


function ProductDetail() {
  const highlightsRef = useRef(null);
  const reviewsRef = useRef(null);
  const questionRef = useRef(null);

  // Handlers for info links
  const handleScrollToReviews = () => {
    reviewsRef.current && reviewsRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  const handleScrollToQuestion = () => {
    questionRef.current && questionRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    // Add to recently viewed when product loads
    if (product && product._id) {
      let ids = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      ids = ids.filter(id => id !== product._id); // Remove if already exists
      ids.unshift(product._id); // Add to front
      if (ids.length > 10) ids = ids.slice(0, 10); // Limit to 10
      localStorage.setItem("recentlyViewed", JSON.stringify(ids));
    }
  }, [product]);

  if (!product) return <p>Loading...</p>;

  // Breadcrumbs logic
  const breadcrumbs = [
    { label: product.category, to: ["Men's Fashion", "Women's Fashion", "Home & Kitchen", "Toys, Kids' Fashion", "Beauty, Health"].includes(product.category) ? "/" : `/products?category=${encodeURIComponent(product.category)}` },
    { label: product.subcategory, to: `/products?subcategory=${encodeURIComponent(product.subcategory)}` },
    { label: product.name }
  ];

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const colors = product.colors && product.colors.length > 0 ? product.colors : [];

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  // Snapdeal-like layout
  return (
    <>
      <div className="snapdeal-detail">
        <div className="product-breadcrumbs">
          {breadcrumbs.map((crumb, idx) => (
            crumb.to ? (
              <span key={crumb.label}>
                <Link to={crumb.to}>{crumb.label}</Link>
                {idx < breadcrumbs.length - 1 && <span> / </span>}
              </span>
            ) : (
              <span key={crumb.label}>{crumb.label}</span>
            )
          ))}
        </div>
        <div className="snapdeal-main-row">
          {/* Left: Small image and Main image */}
          <div className="snapdeal-gallery-col">
            <div className="snapdeal-img-row">
              <div className="snapdeal-small-img-wrap">
                <img className="snapdeal-small-img" src={images[0]} alt={product.name + " small"} />
              </div>
              <div className="snapdeal-main-img-wrap">
                <img className="snapdeal-main-img" src={images[selectedImg]} alt={product.name} />
              </div>
            </div>
          </div>
          {/* Right: Info */}
          <div className="snapdeal-info">
            <h1 className="snapdeal-title">{product.name}</h1>
            <div className="snapdeal-rating-row">
              <span className="snapdeal-stars"><Rating productId={product._id} /></span>
              <span className="snapdeal-rating-count">({product.rating ? product.rating.toFixed(1) : "0.0"})</span>
              <span className="snapdeal-link" style={{cursor:'pointer'}} onClick={handleScrollToReviews}>{product.numRatings || 0} Ratings</span>
              <span className="snapdeal-link" style={{cursor:'pointer'}} onClick={handleScrollToQuestion}>Have a question?</span>
            </div>
            <div className="snapdeal-price-row">
              <span className="snapdeal-mrp">MRP <span className="snapdeal-mrp-strike">₹{product.originalPrice || (product.price + 200)}</span></span>
              <span className="snapdeal-tax">(Inclusive of all taxes)</span>
            </div>
            <div className="snapdeal-offer-row">
              <span className="snapdeal-price">Rs. {product.price}</span>
              <span className="snapdeal-discount">{product.originalPrice ? Math.round(100 - (product.price / product.originalPrice) * 100) : 38}% OFF</span>
            </div>
            <div className="snapdeal-actions">
              <button className="snapdeal-cart-btn" onClick={handleAddToCart}>ADD TO CART</button>
              <button className="snapdeal-buy-btn">BUY NOW</button>
            </div>
          </div>
        </div>

        {/* Color selection below info */}
        {colors.length > 0 && (
          <div className="snapdeal-color-row snapdeal-color-row-below">
            <span className="snapdeal-color-label">Color</span>
            <div className="snapdeal-color-list">
              {colors.map((color, idx) => (
                <div
                  key={color.name || color}
                  className={`snapdeal-color-item${selectedColor === idx ? " selected" : ""}`}
                  onClick={() => {
                    setSelectedColor(idx);
                    if (color.image) setSelectedImg(images.findIndex(img => img === color.image));
                  }}
                >
                  <img src={color.image || images[idx] || images[0]} alt={color.name || color} />
                  <span>{color.name || color}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabbed menu for below sections */}
        <div className="snapdeal-below-tabs">
          <div className="snapdeal-below-tab-menu">
            <button onClick={() => highlightsRef.current.scrollIntoView({ behavior: 'smooth' })}>Item Highlights</button>
            <button onClick={() => reviewsRef.current.scrollIntoView({ behavior: 'smooth' })}>Ratings & Reviews</button>
            <button onClick={() => questionRef.current.scrollIntoView({ behavior: 'smooth' })}>Have a Question?</button>
          </div>
          <div className="snapdeal-below-tab-content">
            <div ref={highlightsRef} className="snapdeal-highlights">
              <h3>Item Highlights</h3>
              <ul>
                <li>100% Original Products</li>
                <li>Pay on delivery might be available</li>
                <li>Easy 7 days returns and exchanges</li>
                <li>Try & Buy available for select products</li>
                <li>Free Shipping on orders above ₹500</li>
                <li>Secure Payments</li>
                <li>1 Year Manufacturer Warranty</li>
                <li>Top Rated Seller</li>
                <li>Cash on Delivery available</li>
                <li>GST invoice available</li>
                {product.features && product.features.length > 0 && product.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
            <div ref={reviewsRef} className="snapdeal-reviews snapdeal-reviews-left">
              <h3>Ratings & Reviews</h3>
              <div><Rating productId={product._id} /></div>
              <div className="snapdeal-review-list">
                <div className="snapdeal-review-item">
                  <strong>Rohit S.</strong> <span>★★★★★</span>
                  <p>Great product, fast delivery. Highly recommended!</p>
                </div>
                <div className="snapdeal-review-item">
                  <strong>Anjali P.</strong> <span>★★★★☆</span>
                  <p>Good quality, but packaging could be better.</p>
                </div>
                <div className="snapdeal-review-item">
                  <strong>Vikram T.</strong> <span>★★★★★</span>
                  <p>Value for money. Will buy again.</p>
                </div>
              </div>
            </div>
            <div ref={questionRef} className="snapdeal-question">
              <h3>Have a Question?</h3>
              <div className="snapdeal-question-list">
                <div className="snapdeal-question-item">
                  <strong>Q:</strong> Is there a warranty on this product?<br/>
                  <strong>A:</strong> Yes, 1 year manufacturer warranty is included.
                </div>
                <div className="snapdeal-question-item">
                  <strong>Q:</strong> Does it support cash on delivery?<br/>
                  <strong>A:</strong> Yes, cash on delivery is available for this item.
                </div>
              </div>
              <p>Click here to ask or see answers from other buyers.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductDetail;
