import logo from "../Assets/logo.png"
import "./Navbar.css";
import { FaUser, FaShoppingCart } from "react-icons/fa";

function Navbar() {
    return (
        <nav className="navbar sticky-top">
            <div className="navbar-left">
                <img src={logo} alt="Snapdeal Logo" style={{ height: "30px" }} />
            </div>

            <div className="navbar-center">
                <input
                    type="text"
                    placeholder="Search products & brands"
                    className="search-input"
                />
                <button className="search-btn"> Search</button>
                <button className="cart-btn"><span>Cart</span><FaShoppingCart /></button>
            <button className="Signin-btn"><span>Sign In</span><FaUser/></button>
            </div>

        </nav>
    );
}

export default Navbar;
