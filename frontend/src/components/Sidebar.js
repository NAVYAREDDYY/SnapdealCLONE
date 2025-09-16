import { FaSearch } from "react-icons/fa";
import "./Sidebar.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const flyoutTimeout = useRef();
  const navigate = useNavigate();

  const categories = [
    {
      name: "Men's Fashion",
      image: "https://g.sdlcdn.com/imgs/k/v/x/Men_sitenavigation-b972a.jpg",
      sub: [
        { items: ["CLOTHING","T-Shirts", "Shirts"] },
        { items: ["FOOTWEAR","Formal Shoes", "Sports Shoes"] },
      ],
    },
    {
      name: "Women's Fashion",
      image: "https://g.sdlcdn.com/imgs/k/v/x/WoMen_sitenav-5a8ca.jpg",
      sub: [
        { items: ["CLOTHING","Tops", "Sarees"] },
        { items: ["FOOTWEAR","Heels", "Flats", "Sandals", "Boots"] },
        { items: ["JEWELLERY","Earrings", "Necklaces", "Bangles", "Rings"] },
      ],
    },
    {
      name: "Home & Kitchen",
      image: "https://g.sdlcdn.com/imgs/k/v/x/HOme_sitenavigation-d7a00.jpg",
      sub: [
        { items: ["KITHCHEN TOOLS","Pans", "Cookware Sets"] },
        { items: ["HOME DECOR","Wall Art", "Vases"] },
      ],
    },
    {
      name: "Toys, Kids' Fashion",
      image: "https://g.sdlcdn.com/imgs/k/v/x/Toys_Sitenavigation-ef666.jpg",
      sub: [
        { items: ["TOYS","Puzzles", "Soft Toys"] },
        { items: ["KIDS","Dresses", "Pajamas"] },
      ],
    },
    {
      name: "Beauty, Health",
      image: "https://g.sdlcdn.com/imgs/k/v/x/Beauty_Site_navigation-5f3be.jpg",
      sub: [
        { items: ["SKIN CARE","Moisturizers", "Face Wash"] },
        { items: ["PERSONAL CARE" ,"Shampoo", "Soap"] },
      ],
    },
  ];

  const handleSubcategoryTap = (sub) => {
    navigate(`/products?subcategory=${encodeURIComponent(sub)}`);
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
                  {cat.sub.map((subCat, subIdx) =>
                    subCat.items.map((item, i) => (
                      <li
                        key={item}
                        onClick={() => handleSubcategoryTap(item)}
                        onTouchStart={() => handleSubcategoryTap(item)}
                        style={{ fontWeight: i === 0 ? "600" : "400" }} // First item bold
                      >
                        {item}
                      </li>
                    ))
                  )}
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
