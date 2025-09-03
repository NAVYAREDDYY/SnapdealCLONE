import logo from "../Assets/logo.png"
import "./Navbar.css";
import { FaUser, FaShoppingCart, FaBox } from "react-icons/fa";


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
                <div className="dropdownWrapper">
                    <button className="sign-in"><span>Sign In</span><FaUser /></button>
                    <div className="dropdownAccount">
                        <ul className="accountList">
                            <li><FaUser/><span>Your Account</span></li>
                            <li><FaBox/><span>Your Orders</span></li>
                            <hr/>
                        
                            <li><a href='/register' className="register-link"><span>If you are new user</span>
                            <div className="register-text">Register</div></a></li>
                            <li><button className="login-btn">Log In</button></li>
                        </ul>
                    </div>
                </div>





            </div>



        </nav>
    );
}

export default Navbar;
