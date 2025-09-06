import Navbar from './components/Navbar';
import HomePage from './Pages/Homepage';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ProductDetail from './components/ProductDetail';
import CartPage from './Pages/CartPage';
import CheckoutPage from "./Pages/CheckoutPage";



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
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
