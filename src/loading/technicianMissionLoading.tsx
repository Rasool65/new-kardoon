import { FunctionComponent } from 'react';

interface TechnicianMissionLoadingProps {}

const TechnicianMissionLoading: FunctionComponent<TechnicianMissionLoadingProps> = () => {
  return (
    <>
      <div className="skeleton-page">
        <div className="sk-technician-mission">
          {/* <div className="header skeleton">
            <img src={require('@src/scss/images/icons/Kardoon-logo-w.svg')} className="header-logo" alt="" />
            <img src={require('@src/scss/images/icons/menu-toggle.svg')} className="menu-box-toggle" alt="" />
          </div> */}
          <div className="sk-filter-box skeleton"></div>
          {/* <div className="skfilter-btn skeleton"></div> */}
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="sk-mission-card skeleton"></div>
              </div>
              <div className="col-md-6">
                <div className="sk-mission-card skeleton"></div>
              </div>
              <div className="col-md-6">
                <div className="sk-mission-card skeleton"></div>
              </div>
              <div className="col-md-6">
                <div className="sk-mission-card skeleton"></div>
              </div>
              <div className="col-md-6">
                <div className="sk-mission-card skeleton"></div>
              </div>
              <div className="col-md-6">
                <div className="sk-mission-card skeleton"></div>
              </div>
              <div className="col-md-6">
                <div className="sk-mission-card skeleton"></div>
              </div>
              <div className="col-md-6">
                <div className="sk-mission-card skeleton"></div>
              </div>
              <div className="col-md-6">
                <div className="sk-mission-card skeleton"></div>
              </div>
            </div>
          </div>

          <div className="footer-menu skeleton"></div>
        </div>
      </div>
    </>
  );
};

export default TechnicianMissionLoading;
