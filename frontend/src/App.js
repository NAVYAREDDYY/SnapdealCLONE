import Navbar from './components/Navbar';
import HomePage from './Pages/Homepage';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ProductDetail from './components/ProductDetail';
import CartPage from './Pages/CartPage';
import ViewCart from './Pages/ViewCart';
import CheckoutPage from "./Pages/CheckoutPage";
import AdminDashboard from "./Pages/Adminpage";


import "./App.css";

function App() {
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
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
