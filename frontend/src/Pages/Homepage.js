import "./Homepage.css"
import Sidebar from "../components/Sidebar";
import Carousel from "../components/Carousel";
import Products from "../components/product";
import Footer from "../components/footer";
import RecentlyViewed from "../components/RecentlyViewed";


function HomePage() {
  return (
    <>
      <div className="homepage-container">
        <Sidebar />
        <div className="main-content">
          <div style={{ flex: 1, minWidth: 0, maxWidth: 700 }}>
            <Carousel />
          </div>
          <div className="pincode-card">
            <h3>Enter Pincode</h3>
            <input type="text" placeholder="Pincode" />
            <button>Check</button>
          </div>
        </div>
      </div>
      <RecentlyViewed />
      <div><Products /></div>
      <Footer/>
    </>
  );
}

export default HomePage;
