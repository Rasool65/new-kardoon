import { FunctionComponent } from 'react';

interface UserProfileLoadingProps {}

const UserProfileLoading: FunctionComponent<UserProfileLoadingProps> = () => {
  return (
    <div className="skeleton-page">
      <div className="user-profile">
        <div className="header skeleton">
          <img src={require('@src/scss/images/icons/Kardoon-logo-w.svg')} className="header-logo" alt="" />
          <img src={require('@src/scss/images/icons/menu-toggle.svg')} className="menu-box-toggle" alt="" />
        </div>

        <div className="container">
          <div className="header-tabbar">
            <div className="tab-btn skeleton"></div>
            <div className="tab-btn skeleton"></div>
          </div>
        </div>
        <div className="account-profile">
          <div className="sk-profile-image skeleton"></div>
          <div className="mt-3 mb-2 title skeleton"></div>
          <div className="m-0 ml-auto mr-auto mini-title skeleton"></div>
        </div>
        <div className="container pb-5">
          <div className="card mt-4">
            <div className="gender">
              <img src={require('@src/scss/images/skeleton-loading.gif')} className="famel-mask" alt="" />
              <div className="toggle-bar skeleton ml-2"></div>
              <img className="male-mask mask" src={require('@src/scss/images/skeleton-loading.gif')} alt="" />
            </div>
            <div className="inputbox">
              <div className="label skeleton"></div>
              <div className="input skeleton"></div>
            </div>
            <div className="inputbox">
              <div className="label skeleton"></div>
              <div className="input skeleton"></div>
            </div>
            <div className="inputbox">
              <div className="label skeleton"></div>
              <div className="input skeleton"></div>
            </div>
            <div className="inputbox">
              <div className="label skeleton"></div>
              <div className="input skeleton"></div>
            </div>
            <div className="inputbox">
              <div className="label skeleton"></div>
              <div className="input skeleton"></div>
            </div>
            <div className="inputbox">
              <div className="label skeleton"></div>
              <div className="input skeleton"></div>
            </div>
            <div className="inputbox">
              <div className="label skeleton"></div>
              <div className="textarea skeleton"></div>
            </div>
            <div className="inputbox">
              <div className="label skeleton"></div>
              <div className="textarea skeleton"></div>
            </div>
            <div className="inputbox">
              <div className="label skeleton"></div>
              <div className="input skeleton"></div>
            </div>
            <div className="inputbox">
              <div className="label skeleton"></div>
              <div className="input skeleton"></div>
            </div>
          </div>
        </div>

        <div className="footer-menu skeleton"></div>
      </div>
    </div>
  );
};

export default UserProfileLoading;
