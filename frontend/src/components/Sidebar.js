import { FaSearch } from "react-icons/fa"; // for search icons
import "./Sidebar.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Sidebar() {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [subcategoryMap, setSubcategoryMap] = useState({});
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const flyoutTimeout = useRef();
  const navigate = useNavigate();
  const categories = [
    {
      name: "Men's Fashion",
      sub: ["T-Shirts"],
    },
    {
      name: "Women's Fashion",
      sub: ["Kurtis & Suits"],
    },
    {
      name: "Home & Kitchen",
      sub: ["Kitchen Tools"],
    },
    {
      name: "Toys, Kids' Fashion",
      sub: ["Toys"],
    },
    {
      name: "Beauty, Health",
      sub: ["Skin Care"],
    },
  ];

  useEffect(() => {
    axios.get("http://localhost:5000/products")
      .then(res => {
        const map = {};
        res.data.forEach(prod => {
          if (prod.subcategory && !map[prod.subcategory]) {
            map[prod.subcategory] = prod._id;
          }
        });
        setSubcategoryMap(map);
      })
      .catch(err => {
        // eslint-disable-next-line
        console.error("Sidebar fetch error:", err);
      });
  }, []);

  const handleSubcategoryTap = (sub) => {
    const productId = subcategoryMap[sub];
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  // --- DELAYED FLYOUT LOGIC ---
  const handleMouseEnter = (idx) => {
    clearTimeout(flyoutTimeout.current);
    setHoverIndex(idx);
    setFlyoutOpen(true);
  };
  const handleMouseLeave = () => {
    flyoutTimeout.current = setTimeout(() => {
      setHoverIndex(null);
      setFlyoutOpen(false);
    }, 180); // 180ms delay
  };

  return (
    <div className="sidebar">
      <h6 className="sidebar-title">TOP CATEGORIES</h6>
      <ul className="sidebar-list">
        {categories.map((cat, idx) => (
          <li
            key={cat.name}
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={handleMouseLeave}
            className="sidebar-category-item"
          >
            <span className={hoverIndex === idx ? "active" : ""} style={{ cursor: "pointer" }}>
              {cat.name}
            </span>
            {hoverIndex === idx && flyoutOpen && (
              <div
                className="sidebar-flyout"
                onMouseEnter={() => {
                  clearTimeout(flyoutTimeout.current);
                  setFlyoutOpen(true);
                }}
                onMouseLeave={handleMouseLeave}
              >
                <ul className="sidebar-sublist">
                  {cat.sub.map((sub) => (
                    <li
                      key={sub}
                      onTouchStart={() => handleSubcategoryTap(sub)}
                      onClick={() => handleSubcategoryTap(sub)}
                    >
                      {sub}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
      <h6 className="sidebar-title">MORE CATEGORIES</h6>
      <ul className="sidebar-list text-only">
        <li>Automotives</li>
        <li>Mobile & Accessories</li>
        <li>Electronics</li>
        <li>Sports, Fitness & Outdoor</li>
        <li>Computers & Gaming</li>
        <li>Books, Media & Music</li>
        <li>Hobbies</li>
      </ul>
      <h6 className="sidebar-title">TRENDING SEARCHES</h6>
      <ul className="sidebar-list text-only">
        <li><FaSearch /> Kitchen Product</li>
        <li><FaSearch /> Shoes For Men</li>
        <li><FaSearch /> Kurti Set</li>
      </ul>
    </div>
  );
}

export default Sidebar;
