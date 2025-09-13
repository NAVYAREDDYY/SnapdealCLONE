import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Navbar from './components/Navbar';
import HomePage from './Pages/Homepage';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ProductDetail from './components/ProductDetail';
import CartPage from './Pages/CartPage';
import ViewCart from './Pages/ViewCart';
import CheckoutPage from "./Pages/CheckoutPage";
import AdminDashboard from "./Pages/Adminpage";

import { setUser } from './redux/userSlice';
import LoginForm from './components/Loginform';
import OrdersPage from './Pages/OrdersPage';
import "./App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for saved user data in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser)));
    }
  }, [dispatch]);

  return (
    <div>
      <BrowserRouter>
      <Navbar />
       <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path='/product/:id' element={<ProductDetail/>}/>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/view-cart" element={<ViewCart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/login" element={<LoginForm />} />
  <Route path="/orders" element={<OrdersPage />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
