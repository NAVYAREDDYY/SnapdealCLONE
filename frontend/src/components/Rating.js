import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function RatingDisplay({ value, showValue = true }) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      stars.push(<FaStar key={i} color="#ffc107" />); // full star
    } else if (value >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} color="#ffc107" />); // half star
    } else {
      stars.push(<FaRegStar key={i} color="#e8cf42ff" />); // empty star
    }
  }

  return (
       <div style={{ display: "flex", alignItems: "center" }}>
      {stars}
       {showValue && (
        <span style={{ marginLeft: "8px", color: "#555" }}>
          ({value ? value.toFixed(1) : "0.0"})
        </span>
      )}
    </div>

  );
}

export default RatingDisplay;
