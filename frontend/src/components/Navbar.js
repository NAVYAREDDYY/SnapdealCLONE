import logo from "../Assets/logo.png"
import "./Navbar.css";
import { FaUser, FaShoppingCart, FaBox } from "react-icons/fa";
import { useState, useEffect } from "react";
import LoginForm from "./Loginform";
import RegisterForm from "./Register";
import { Link } from "react-router-dom"


function Navbar() {

    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [username, setUsername] = useState(null);
    useEffect(() => {
        const storedUser = localStorage.getItem("username");
        if (storedUser) {
            setUsername(storedUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setUsername(null);
        window.location.href = "/";
    };

    return (
        <nav className="navbar sticky-top">
            <Link to='/' onClick={() => alert("Logo clicked!")}>
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
                    <button className="sign-in"><span>{username ? username : "Sign In"}</span> <FaUser /></button>

                    <div className="dropdownAccount">
                        <ul className="accountList">
                            <li><FaUser /><span>Your Account</span></li>
                            <li><FaBox /><span>Your Orders</span></li>
                            <hr />

                            {!username ? (
                                <>
                                    <li>
                                        <div className="register-link" onClick={() => setShowRegister(true)}
                                            style={{ cursor: "pointer" }}>
                                            <span>If you are new user</span>
                                            <div className="register-text">Register</div>
                                        </div>
                                    </li>

                                    <li>
                                        <button className="login-btn" onClick={() => setShowLogin(true)}>Log In</button>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <button className="login-btn" onClick={handleLogout}>Logout</button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {showLogin && !username && (
                <div className="overlay">
                    <div className="login-popup">
                        <span className="close-btn" onClick={() => setShowLogin(false)}>x</span>
                        <LoginForm />
                    </div>
                </div>
            )}
            {showRegister && !username && (
                <div className="overlay">
                    <div className="login-popup">
                        <span className="close-btn" onClick={() => setShowRegister(false)}>x</span>
                        <RegisterForm setUsername={setUsername}/>
                    </div>
                </div>
            )}

        </nav>
    );
}

export default Navbar;