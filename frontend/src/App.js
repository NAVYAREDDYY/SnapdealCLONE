import { useState ,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Navbar from './components/Navbar';
import HomePage from './Pages/Homepage';
import { Routes, Route, BrowserRouter} from "react-router-dom";
import ProductDetail from './components/ProductDetail';
import CartPage from './Pages/CartPage';
import ViewCart from './Pages/ViewCart';
import CheckoutPage from "./Pages/CheckoutPage";
import Products from "./components/product";
import VendorRoute from "./components/VendorRoute";
import VendorDashboard from "./Pages/VendorDashboard";
import VendorLogin from "./Pages/VendorLogin";
import SellOnSnapdeal from "./Pages/SellOnSnapdeal";
import SellerLogin from "./Pages/SellerLogin";
import { setUser } from './redux/userSlice';
import LoginForm from './components/Loginform';
import OrdersPage from './Pages/OrdersPage';
import SearchResults from './components/SearchResults';
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const location = typeof window !== 'undefined' ? window.location : { pathname: '/' };
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser)));
    }
    setLoading(false);
  }, [dispatch]);

  if (loading) return null; 
  return (
    <div>
      <BrowserRouter>
        {!(location.pathname === '/sell-on-snapdeal' || location.pathname === '/seller-login' || location.pathname.startsWith('/vendor')) && <Navbar />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/view-cart" element={<ViewCart />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/vendor" element={<VendorLogin />} />
          <Route path="/vendor/dashboard" element={<VendorRoute>
            <VendorDashboard />
          </VendorRoute>} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:subcategory" element={<Products />} />
          <Route path="/sell-on-snapdeal" element={<SellOnSnapdeal />} />
          <Route path="/seller-login" element={<SellerLogin />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
