import Sidebar from "../components/Sidebar";
import Carousel from "../components/Carousel";
import Products from "../components/product";

function HomePage() {
  return (
    <>
      <div className="homepage-container">

        <Sidebar />
        <div className="main-content">
          <Carousel />
          <div className="pincode-card">
            <h3>Enter Pincode</h3>
            <input type="text" placeholder="Pincode" />
            <button>Check</button>
          </div>
        </div>


      </div>

      <div><Products /></div>
    </>

  );
}

export default HomePage;
