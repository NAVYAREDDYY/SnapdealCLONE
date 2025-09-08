import { useState } from "react";
import axios from "axios";

function Rating({ productId }) {
  const [rating, setRating] = useState(0); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/products/${productId}/rate`, {
        userId: "USER_ID_HERE", 
        rating
      });
      console.log("Updated Product:", response.data);
      alert("Rating submitted successfully!");
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
       <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Rating;

