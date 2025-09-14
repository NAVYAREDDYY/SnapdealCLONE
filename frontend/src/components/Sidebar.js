import { FaSearch } from "react-icons/fa";
import "./Sidebar.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Sidebar() {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const flyoutTimeout = useRef();
  const navigate = useNavigate();
  const [subcategoryMap, setSubcategoryMap] = useState({});

  const categories = [
    {
      name: "Men's Fashion",
      image: "https://g.sdlcdn.com/imgs/k/v/x/Men_sitenavigation-b972a.jpg",
      sub: [
        { name: "Clothing", items: ["T-Shirts", "Shirts"] },
        { name: "Footwear", items: ["Formal Shoes", "Sports Shoes"] },
      ],
    },
    {
      name: "Women's Fashion",
      image: "https://g.sdlcdn.com/imgs/k/v/x/WoMen_sitenav-5a8ca.jpg",
      sub: [
        { name: "Clothing", items: ["Tops", "Sarees"] },
        { name: "Footwear", items: ["Heels", "Flats", "Sandals", "Boots"] },
        { name: "Jewellery", items: ["Earrings", "Necklaces", "Bangles", "Rings"] },
      ],
    },
    {
      name: "Home & Kitchen",
      image: "https://g.sdlcdn.com/imgs/k/v/x/HOme_sitenavigation-d7a00.jpg",
      sub: [
        { name: "Kitchen Tools", items: ["Pans", "Cookware Sets"] },
        { name: "Home Decor", items: ["Wall Art", "Vases"] },
      ],
    },
    {
      name: "Toys, Kids' Fashion",
      image: "https://g.sdlcdn.com/imgs/k/v/x/Toys_Sitenavigation-ef666.jpg",
      sub: [
        { name: "Toys", items: ["Puzzles", "Soft Toys"] },
        { name: "Kids' Clothing", items: ["Dresses", "Pajamas"] },
      ],
    },
    {
      name: "Beauty, Health",
      image: "https://g.sdlcdn.com/imgs/k/v/x/Beauty_Site_navigation-5f3be.jpg",
      sub: [
        { name: "Skin Care", items: ["Moisturizers", "Face Wash"] },
        { name: "Personal Care", items: ["Shampoo", "Soap"] },
      ],
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
      .catch(err => console.error("Sidebar fetch error:", err));
  }, []);

  const handleSubcategoryTap = (sub) => {
    const productId = subcategoryMap[sub];
    if (productId) navigate(`/product/${productId}`);
  };

  const handleMouseEnter = (idx) => {
    clearTimeout(flyoutTimeout.current);
    setHoverIndex(idx);
    setFlyoutOpen(true);
  };

  const handleMouseLeave = () => {
    flyoutTimeout.current = setTimeout(() => {
      setHoverIndex(null);
      setFlyoutOpen(false);
    }, 180);
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
            <img src={cat.image} alt={cat.name} className="category-icon" />
            <span className={hoverIndex === idx ? "active" : ""}>
              {cat.name}
            </span>

            {hoverIndex === idx && flyoutOpen && (
              <div
                className="sidebar-flyout"
                onMouseEnter={() => clearTimeout(flyoutTimeout.current)}
                onMouseLeave={handleMouseLeave}
              >
                <ul className="sidebar-sublist">
                  {cat.sub.map((subCat) => (
                    <li key={subCat.name}>
                      <strong>{subCat.name}</strong>
                      <ul>
                        {subCat.items.map((item) => (
                          <li
                            key={item}
                            onClick={() => handleSubcategoryTap(item)}
                            onTouchStart={() => handleSubcategoryTap(item)}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
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
