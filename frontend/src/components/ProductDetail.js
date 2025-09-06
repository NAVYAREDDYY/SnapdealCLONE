import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux"; 
import { addToCart } from "../redux/cartSlice"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css"

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();
  const Navigate = useNavigate();

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

  if (!product) return <p>Loading...</p>;
    const handleAddToCart = () => {
    dispatch(addToCart(product)); // send product to redux
    Navigate('/cart')
  };


  return (

    <div className="product-detail">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>Price: ₹{product.price}</p>
      <p>Description: {product.description}</p>
      <p>Category: {product.category}</p>
      <p>Stock: {product.stock}</p>

      <div className="product-detail-buttons">
        <button onClick={handleAddToCart}>Add to Cart</button>
        <button>Buy Now</button>
      </div>
    </div>

  );
}

export default ProductDetail;
