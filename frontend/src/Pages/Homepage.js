import "./Homepage.css"
import Sidebar from "../components/Sidebar";
import Carousel from "../components/Carousel";
import Footer from "../components/footer";
import RecentlyViewed from "../components/RecentlyViewed";
import TrendingProducts from "../components/TrendingProducts";
import DownloadApp from "../components/downloadapp";

function HomePage() {
  return (
    <>
     
      <div className="homepage-container">
        
        <div className="left-column">
          <Sidebar />
          <div className="scanner">
            <div class="nav-bottom-barcode ">
              <div class="bar-code-image barCodImg"></div>
              <div class="bar-code-info">
                <span class="head">Enjoy Convenient Order Tracking</span>
                <span class="desc">Scan to download app</span>
              </div>
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="top-row">
            <div className="carousel-wrapper" style={{ minWidth: 0, maxWidth: 900 }}>
              <Carousel />
            </div>
            <div className="pincode-card">
              <h3>Enter Pincode</h3>
              <input type="text" placeholder="Pincode" />
              <button>Check</button>
            </div>
                  
          </div>
          <div className="bottom-row">
            <RecentlyViewed />
          </div>
        </div>
      </div>
      <TrendingProducts />
      <DownloadApp/>
      
      <div><Footer /></div>
    </>
  );
}

export default HomePage;

