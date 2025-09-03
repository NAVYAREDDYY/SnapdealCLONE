import { FaSearch } from "react-icons/fa"; // for search icons
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h6 className="sidebar-title">TOP CATEGORIES</h6>
      <ul className="sidebar-list">
        <li>
          {/* <img src="assets/mens-fashion.jpg" alt="Men's Fashion" /> */}
          <span>Men's Fashion</span>
        </li>
        <li>
          {/* <img src="assets/womens-fashion.jpg" alt="Women's Fashion" /> */}
          <span>Women's Fashion</span>
        </li>
        <li>
          {/* <img src="assets/home-kitchen.jpg" alt="Home & Kitchen" /> */}
          <span>Home & Kitchen</span>
        </li>
        <li>
          {/* <img src="assets/toys.jpg" alt="Toys" /> */}
          <span>Toys, Kids' Fashion </span>
        </li>
        <li>
          {/* <img src="assets/beauty.jpg" alt="Beauty" /> */}
          <span>Beauty, Health </span>
        </li>
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
