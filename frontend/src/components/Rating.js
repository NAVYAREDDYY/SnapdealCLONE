import { useState } from "react";
import axios from "axios";

function Rating({ productId }) {
  const [rating, setRating] = useState(0); 
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`http://localhost:5000/products/${productId}/rate`, 
        {rating },{ headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("Updated Product:", response.data);
      alert("Rating submitted successfully!");
      setSubmitted(true); 
    } catch (err) {
      console.error(err);
      alert("Error submitting rating");
    }
  };
  return (
    <div>
      <h4>Rate this product:</h4>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => setRating(star)}
          style={{ cursor: "pointer" ,
          color: star <= rating ? "gold" : "grey"  }}
        >
          ★
        </span>
      ))}
      <p>You selected: {rating} stars</p>
       
      {!submitted && (  
        <button onClick={handleSubmit}>Submit</button>
      )}

      {submitted && <p>Thank you for your rating!</p>} 
    </div>
  );
}

export default Rating;

