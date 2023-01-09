import { FunctionComponent } from 'react';

interface MainLoadingProps {}

const MainLoading: FunctionComponent<MainLoadingProps> = () => {
  return (
    <>
    <div className="skeleton-page">
      <div className="home-page">
        <div className="header skeleton">
          <img src={require('@src/scss/images/icons/Kardoon-logo-w.svg')} className="header-logo" alt="" />
          <img src={require('@src/scss/images/icons/menu-toggle.svg')} className="menu-box-toggle" alt="" />
        </div>
        <div className="container">
          <div className="searchbox skeleton"></div>
          <div className="slider skeleton"></div>
          <div className="slider-bollet">
            <span className="skeleton"></span>
            <span className="skeleton"></span>
            <span className="skeleton"></span>
          </div>
          <div className="services">
            <div className="title skeleton"></div>
            <div className="d-flex flex-wrap justify-content-center">
              <div className="service-card skeleton"></div>
              <div className="service-card skeleton"></div>
              <div className="service-card skeleton"></div>
              <div className="service-card skeleton"></div>
              <div className="service-card skeleton"></div>
              <div className="service-card skeleton"></div>
              <div className="service-card skeleton"></div>
              <div className="service-card skeleton"></div>
              <div className="service-card skeleton"></div>
            </div>
          </div>
        </div>
        <div className="whay-kardoon">
          <div className="container">
            <div className="title skeleton"></div>
            <div className="why-kardoon-items">
              <div className="why-kardoon-item">
                <div className="sk-icon-box skeleton"></div>
                <div className="title-box">
                  <div className="mini-title skeleton"></div>
                </div>
              </div>
              <div className="why-kardoon-item border-x">
                <div className="sk-icon-box skeleton"></div>
                <div className="title-box">
                  <div className="mini-title skeleton"></div>
                </div>
              </div>
              <div className="why-kardoon-item">
                <div className="sk-icon-box skeleton"></div>
                <div className="title-box">
                  <div className="mini-title skeleton"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="container">
            <div className="col-12 col-md-5 ml-auto mr-auto">
              <img src={require('@src/scss/images/icons/Kardoon-logo.svg')} className="footer-logo" />
              <div className="socialmedia">
                <div className="social-link skeleton"></div>
                <div className="social-link skeleton"></div>
                <div className="social-link skeleton"></div>
              </div>
              <div className="text skeleton"></div>
              <div className="title skeleton"></div>
              <div className="mini-title skeleton"></div>
              <div className="title skeleton"></div>
              <div className="title skeleton"></div>
            </div>
          </div>
        </div>
        <div className="footer-menu skeleton"></div>
      </div>
    </div>
    </>
  );
};

export default MainLoading;
