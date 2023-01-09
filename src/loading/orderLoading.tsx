import { FunctionComponent } from 'react';

interface OrderLoadingProps {}

const OrderLoading: FunctionComponent<OrderLoadingProps> = () => {
  return (
    <>
    <div className="skeleton-page">
      <div className="technician-mission">
        <div className="header skeleton">
          <img src={require('@src/scss/images/icons/Kardoon-logo-w.svg')} className="header-logo" alt="" />
          <img src={require('@src/scss/images/icons/menu-toggle.svg')} className="menu-box-toggle" alt="" />
        </div>

        <div className="container">
          <div className="d-flex">
            <div className="tabs-btn skeleton"></div>
            <div className="tabs-btn"></div>
          </div>
          <div className="tabs-body">
            <div className="row">
              <div className="col-md-6">
                <div className="mission-card h-90 skeleton"></div>
              </div>
              <div className="col-md-6">
                <div className="mission-card h-90 skeleton"></div>
              </div>
              <div className="col-md-6">
                <div className="mission-card h-90 skeleton"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-menu skeleton"></div>
      </div>
    </div>
    </>
  );
};

export default OrderLoading;
