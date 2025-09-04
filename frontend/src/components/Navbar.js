import logo from "../Assets/logo.png"
import "./Navbar.css";
import { FaUser, FaShoppingCart, FaBox } from "react-icons/fa";
import { useState } from "react";
import LoginForm from "./Loginform";
import { Link } from "react-router-dom"



function Navbar() {
    const [showLogin, setShowLogin] = useState(false);
    return (
        <nav className="navbar sticky-top">
            <Link to ='/' onClick={() => alert("Logo clicked!")}>
            <div className="navbar-left">
                <img src={logo} alt="Snapdeal Logo" style={{ height: "30px" }} />
            </div>
            </Link>

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
                            <li><FaUser /><span>Your Account</span></li>
                            <li><FaBox /><span>Your Orders</span></li>
                            <hr />
                             <li><a href='/register' className="register-link"><span>If you are new user</span>
                                <div className="register-text">Register</div></a></li>
                            <li><button className="login-btn" onClick={() => setShowLogin(true)}>Log In</button></li>

                        </ul>
                    </div>
                </div>
          </div>

            {showLogin && (
                <div className="overlay">
                    <div className="login-popup">
                        <span
                            className="close-btn"
                            onClick={() => setShowLogin(false)}
                        > </span>
                        <LoginForm />
                    </div>
                </div>
            )}

        </nav>
    );
}

export default Navbar;
