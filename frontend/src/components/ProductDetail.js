import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Rating from "./Rating";
import Footer from "./footer";
import "./ProductDetail.css";
import RatingDisplay from "./Rating";


function ProductDetail() {
  const highlightsRef = useRef(null);
  const reviewsRef = useRef(null);
  const questionRef = useRef(null);
  const [openSection, setOpenSection] = useState("highlights");

  // Handlers for info links
  // const handleScrollToReviews = () => {
  //   reviewsRef.current && reviewsRef.current.scrollIntoView({ behavior: 'smooth' });
  // };
  const handleScrollToQuestion = () => {
    questionRef.current && questionRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImg] = useState(0);

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

    if (product && product._id) {
      let ids = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      ids = ids.filter(id => id !== product._id);
      ids.unshift(product._id);
      if (ids.length > 10) ids = ids.slice(0, 10);
      localStorage.setItem("recentlyViewed", JSON.stringify(ids));
    }
  }, [product]);

  if (!product) return <p>Loading...</p>;


  const breadcrumbs = [
    { label: product.category, to: ["Men's Fashion", "Women's Fashion", "Home & Kitchen", "Toys, Kids' Fashion", "Beauty, Health"].includes(product.category) ? "/" : `/products?category=${encodeURIComponent(product.category)}` },
    { label: product.subcategory, to: `/products?subcategory=${encodeURIComponent(product.subcategory)}` },
    { label: product.name }
  ];

  const images = product.images && product.images.length > 0 ? product.images : [product.image];


  const handleAddToCart = () => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  return (
    <>
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
      <div className="snapdeal-detail">
        <div className="snapdeal-main-row">

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


          <div className="snapdeal-info">
            <h1 className="snapdeal-title">{product.name}</h1>

            <div className="snapdeal-rating-row">
              <Rating value={product.rating || 0} showValue={true} />

              <span className="snapdeal-separator">|</span>
              <span className="snapdeal-blue">{product.numRatings || 0} Ratings</span>

              <span className="snapdeal-separator">|</span>
              <span className="snapdeal-blue">{product.numReviews || 0} Reviews</span>

              <span className="snapdeal-separator">|</span>
              <span className="snapdeal-blue">{product.numSelfies || 0} Selfies</span>

              <span className="snapdeal-separator">|</span>
              <span
                className="snapdeal-link"
                style={{ cursor: "pointer" }}
                onClick={handleScrollToQuestion}
              >
                Have a question?
              </span>
            </div>


            <hr className="rating-divider" />

            <div className="snapdeal-price-row">
              <span className="snapdeal-mrp">MRP <span className="snapdeal-mrp-strike">₹{product.originalPrice || (product.price + 200)}</span></span>
              <span className="snapdeal-tax">(Inclusive of all taxes)</span>
            </div>
            <div className="snapdeal-offer-row">
              <span className="snapdeal-price">Rs. {product.price}</span>
              <span className="snapdeal-discount">{product.originalPrice ? Math.round(100 - (product.price / product.originalPrice) * 100) : 38}% OFF</span>
            </div>





            {/* Static Color Section */}
            <div className="snapdeal-color-row">
              <span className="snapdeal-color-label">Color</span>
              <div className="snapdeal-color-list">
                <div className="snapdeal-color-item selected">
                  <img src={images[0]} alt={product.name} />

                </div>
              </div>
            </div>



            <div className="snapdeal-actions">
              <button className="snapdeal-cart-btn" onClick={handleAddToCart}>ADD TO CART</button>
              <button className="snapdeal-buy-btn">BUY NOW</button>
            </div>



            <div className="snapdeal-delivery-row">
              <span className="snapdeal-delivery-label">Delivery</span>
              <div className="snapdeal-pincode-wrapper">
                <input
                  type="text"
                  placeholder="Enter pincode"
                  className="snapdeal-pincode-input"
                />
                <button className="snapdeal-check-btn">Check</button>
              </div>
              <span className="snapdeal-delivery-time">
                Generally delivered in 6 - 10 days
              </span>
            </div>
            <div><span className="extrainfo"> 7 Days Easy Returns : We assure easy return of purchased items within 7 days of delivery</span></div>











          </div>


        </div>

      </div>

      {/* Tabbed menu for below sections */}
      <div className="snapdeal-below-tabs">
        <div className="snapdeal-below-tab-menu">
          <button onClick={() => highlightsRef.current.scrollIntoView({ behavior: 'smooth' })}>Item Details</button>
          <button onClick={() => reviewsRef.current.scrollIntoView({ behavior: 'smooth' })}>Ratings & Reviews</button>
          <button onClick={() => questionRef.current.scrollIntoView({ behavior: 'smooth' })}>Have a Question?</button>
        </div>
        <div className="snapdeal-below-tab-content">
          {/* Accordion Section */}
          <div className="snapdeal-accordion">
            {/* Highlights */}
            <div className="snapdeal-accordion-item">
              <div
                className="snapdeal-accordion-header"
                onClick={() =>
                  setOpenSection(openSection === "highlights" ? null : "highlights")
                }
              >
                <span className="snapdeal-accordion-icon">
                  {openSection === "highlights" ? "−" : "+"}
                </span>
                <span className="snapdeal-accordion-title">Highlights</span>
              </div>
              {openSection === "highlights" && (
                <div className="snapdeal-accordion-content">
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
                    {product.features &&
                      product.features.length > 0 &&
                      product.features.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Ratings & Reviews */}
            <div className="snapdeal-accordion-item">
              <div
                className="snapdeal-accordion-header"
                onClick={() =>
                  setOpenSection(openSection === "reviews" ? null : "reviews")
                }
              >
                <span className="snapdeal-accordion-icon">
                  {openSection === "reviews" ? "−" : "+"}
                </span>
                <span className="snapdeal-accordion-title">Other specifications</span>
              </div>
              {openSection === "reviews" && (
                <div className="snapdeal-accordion-content">
                  <h6>Ratings & Reviews</h6>
                  <div><RatingDisplay productId={product._id} /></div>
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
              )}
            </div>

            {/* Have a Question */}
            <div className="snapdeal-accordion-item">
              <div
                className="snapdeal-accordion-header"
                onClick={() =>
                  setOpenSection(openSection === "question" ? null : "question")
                }
              >
                <span className="snapdeal-accordion-icon">
                  {openSection === "question" ? "−" : "+"}
                </span>
                <span className="snapdeal-accordion-title">Terms & Conditions</span>
              </div>
              {openSection === "question" && (
                <div className="snapdeal-accordion-content">
                  
                  
                    <p>
                      The images represent actual product though color of the image and
                      product may slightly differ. Snapdeal does not select, edit, modify,
                      alter, add or supplement the information...
                    </p>
                  
                  <p>Click here to ask or see answers from other buyers.</p>
                </div>
              )}
            </div>
          </div>








        </div>
      </div>

      <Footer />
    </>
  );
}

export default ProductDetail;
