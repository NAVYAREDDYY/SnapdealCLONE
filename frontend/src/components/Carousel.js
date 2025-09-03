function Carousel() {
  return (
    <div
      id="snapCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
    >

      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#snapCarousel"
          data-bs-slide-to="0"
          className="active"
        ></button>
        <button
          type="button"
          data-bs-target="#snapCarousel"
          data-bs-slide-to="1"
        ></button>
        <button
          type="button"
          data-bs-target="#snapCarousel"
          data-bs-slide-to="2"
        ></button>
        <button
          type="button"
          data-bs-target="#snapCarousel"
          data-bs-slide-to="3"
        ></button>
        <button
          type="button"
          data-bs-target="#snapCarousel"
          data-bs-slide-to="4"
        ></button>
      </div>

      
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src="https://g.sdlcdn.com/imgs/a/b/c/sdtv/bob_page_main_banner.png"
            className="d-block w-100"
            alt="Slide 1"
          />
        </div>
        <div className="carousel-item">
          <img
            src="https://g.sdlcdn.com/imgs/a/b/c/sdtv/bob_page_main_banner.png"
            className="d-block w-100"
            alt="Slide 2"
          />
        </div>
        <div className="carousel-item">
          <img
            src="https://g.sdlcdn.com/imgs/a/b/c/sdtv/bob_page_main_banner.png"
            className="d-block w-100"
            alt="Slide 3"
          />
        </div>
        <div className="carousel-item">
          <img
            src="https://g.sdlcdn.com/imgs/a/b/c/sdtv/bob_page_main_banner.png"
            className="d-block w-100"
            alt="Slide 4"
          />
        </div>
        <div className="carousel-item">
          <img
            src="https://g.sdlcdn.com/imgs/a/b/c/sdtv/bob_page_main_banner.png"
            className="d-block w-100"
            alt="Slide 5"
          />
        </div>
      </div>

      
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#snapCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#snapCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
}

export default Carousel;
