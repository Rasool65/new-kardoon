// import { CustomFunctions } from '@src/utils/custom';
import { FunctionComponent, useEffect, useState } from 'react';

import IPageProps from '../../configs/routerConfig/IPageProps';

const test: FunctionComponent<IPageProps> = (props) => {
  useEffect(() => {
    // CustomFunctions();
  }, []);
  return (
    <>
      <div id="preloader">
        <div className="spinner-border color-highlight" role="status"></div>
      </div>

      <div id="page">
        <div className="header header-fixed header-auto-show header-logo-app">
          <a href="index.html" className="header-title">
            AZURES
          </a>
          <a style={{ cursor: 'pointer' }} data-back-button className="header-icon header-icon-1">
            <i className="fas fa-arrow-right"></i>
          </a>
          <a style={{ cursor: 'pointer' }} data-toggle-theme className="header-icon header-icon-2 show-on-theme-dark">
            <i className="fas fa-sun"></i>
          </a>
          <a style={{ cursor: 'pointer' }} data-toggle-theme className="header-icon header-icon-2 show-on-theme-light">
            <i className="fas fa-moon"></i>
          </a>
          {/* <a style={{cursor:'pointer'}} data-menu="menu-highlights" className="header-icon header-icon-3">
            <i className="fas fa-brush"></i>
          </a> */}
        </div>
        <div id="footer-bar" className="footer-bar-5">
          <a href="index-components.html">
            <i
              data-feather="heart"
              data-feather-line="1"
              data-feather-size="21"
              data-feather-color="red-dark"
              data-feather-bg="red-fade-light"
            ></i>
            <span>Features</span>
          </a>
          <a href="index-media.html">
            <i
              data-feather="image"
              data-feather-line="1"
              data-feather-size="21"
              data-feather-color="green-dark"
              data-feather-bg="green-fade-light"
            ></i>
            <span>Media</span>
          </a>
          <a href="index.html">
            <i
              data-feather="home"
              data-feather-line="1"
              data-feather-size="21"
              data-feather-color="blue-dark"
              data-feather-bg="blue-fade-light"
            ></i>
            <span>Home</span>
          </a>
          <a href="index-pages.html">
            <i
              data-feather="file"
              data-feather-line="1"
              data-feather-size="21"
              data-feather-color="brown-dark"
              data-feather-bg="brown-fade-light"
            ></i>
            <span>Pages</span>
          </a>
          <a href="index-settings.html" className="active-nav">
            <i
              data-feather="settings"
              data-feather-line="1"
              data-feather-size="21"
              data-feather-color="dark-dark"
              data-feather-bg="gray-fade-light"
            ></i>
            <span>Settings</span>
          </a>
        </div>
        <div className="page-content">
          <div className="page-title page-title-small">
            <h2>
              <a style={{ cursor: 'pointer' }} data-back-button>
                <i className="fa fa-arrow-right"></i>
              </a>
              Settings
            </h2>
            <a
              style={{ cursor: 'pointer' }}
              data-menu="menu-main"
              className="bg-fade-highlight-light shadow-xl preload-img"
              data-src="images/avatars/5s.png"
            ></a>
          </div>
          <div className="card header-card shape-rounded" data-card-height="210">
            <div className="card-overlay bg-highlight opacity-95"></div>
            <div className="card-overlay dark-mode-tint"></div>
            <div className="card-bg preload-img" data-src="images/pictures/20s.jpg"></div>
          </div>

          <div className="card card-style">
            <div className="content mt-0 mb-2">
              <div className="list-group list-custom-large mb-4">
                <a style={{ cursor: 'pointer' }} data-toggle-theme className="show-on-theme-light">
                  <i className="fa font-14 fa-moon bg-brown-dark rounded-sm"></i>
                  <span>Dark Mode</span>
                  <strong>Auto Dark Mode Available Too</strong>
                  <i className="fa fa-angle-left me-2"></i>
                </a>
                <a style={{ cursor: 'pointer' }} data-toggle-theme className="show-on-theme-dark">
                  <i className="fa font-14 fa-lightbulb bg-yellow-dark rounded-sm"></i>
                  <span>Light Mode</span>
                  <strong>Auto Dark Mode Available Too</strong>
                  <i className="fa fa-angle-left me-2"></i>
                </a>
                <a style={{ cursor: 'pointer' }} data-menu="menu-highlights">
                  <i className="fa font-14 fa-brush bg-highlight color-white rounded-sm"></i>
                  <span>Color Scheme</span>
                  <strong>A tone of Colors, Just for You</strong>
                  <i className="fa fa-angle-left me-2"></i>
                </a>
                <a style={{ cursor: 'pointer' }} data-menu="menu-share">
                  <i className="fa font-14 fa-share-alt bg-red-dark rounded-sm"></i>
                  <span>Share Azures</span>
                  <strong>Just one tap! We'll do the rest!</strong>
                  <i className="fa fa-angle-left me-2"></i>
                </a>
                <a style={{ cursor: 'pointer' }} data-menu="menu-language">
                  <i className="fa font-14 fa-globe bg-green-dark rounded-sm"></i>
                  <span>Language Picker</span>
                  <strong>A Sample for Demo Purposes</strong>
                  <i className="fa fa-angle-left me-2"></i>
                </a>
                <a href="index-shapes.html">
                  <i className="far font-14 fa-heart bg-pink-dark rounded-sm"></i>
                  <span>Azures Shapes</span>
                  <strong>Header and Footer Shapes</strong>
                  <i className="fa fa-angle-left me-2"></i>
                </a>
              </div>

              <h5>Did you know?</h5>
              <p>
                Fast loading, great support, premium quality. We have a tone of awesome features, that make us stand out from our
                competitors.
              </p>
              <div className="divider mb-1"></div>
              <div className="list-group list-custom-large">
                <a style={{ cursor: 'pointer' }} data-menu="menu-tips-1" className="border-0">
                  <i className="fa font-14 fa-gift bg-magenta-light rounded-sm"></i>
                  <span>Tap Here to Start</span>
                  <strong>A few Tips About Azures</strong>
                  <i className="fa fa-angle-left me-2"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="card card-style preload-img" data-src="images/pictures/20.jpg">
            <div className="card-body text-center">
              <h1 className="color-white pt-4">Feature Requests</h1>
              <p className="color-white mt-n2 mb-3 pb-1">We're always listening to your feedback</p>
              <p className="boxed-text-xl color-white opacity-80 pb-2">
                Do you like Azures, but want a specific feature? Please send us Feedback and feature suggestions and we'll
                consider it for future updates!
              </p>
              <a
                style={{ cursor: 'pointer' }}
                className="btn btn-m rounded-sm btn-border btn-center-l border-white color-white font-700 text-uppercase mb-4"
              >
                Request Feature
              </a>
            </div>
            <div className="card-overlay bg-highlight opacity-95"></div>
          </div>

          <div className="footer" data-menu-load="menu-footer.html"></div>
        </div>

        <div
          id="menu-share"
          className="menu menu-box-bottom menu-box-detached rounded-m"
          data-menu-load="menu-share.html"
          data-menu-height="420"
          data-menu-effect="menu-over"
        ></div>

        <div
          id="menu-highlights"
          className="menu menu-box-bottom menu-box-detached rounded-m"
          data-menu-load="menu-colors.html"
          data-menu-height="510"
          data-menu-effect="menu-over"
        ></div>

        <div
          id="menu-main"
          className="menu menu-box-right menu-box-detached rounded-m"
          data-menu-width="260"
          data-menu-load="menu-main.html"
          data-menu-active="nav-settings"
          data-menu-effect="menu-over"
        ></div>

        <div
          id="menu-language"
          className="menu menu-box-bottom menu-box-detached rounded-m"
          data-menu-height="345"
          data-menu-effect="menu-over"
        >
          <div className="me-3 ms-3 mt-3">
            <div className="float-start">
              <h3 className="font-700 mb-0 pt-1">Language</h3>
              <p className="font-11 mt-n1 color-highlight mb-3">You can direct to multiple languages of your page.</p>
            </div>
            <div className="float-end">
              <a style={{ cursor: 'pointer' }} className="close-menu">
                <i className="fa fa-times-circle color-red-dark pt-3 font-18"></i>
              </a>
            </div>
            <div className="clearfix"></div>
            <div className="list-group list-custom-small">
              <a style={{ cursor: 'pointer' }}>
                <img className="me-3 mt-n1" width="20" src="images/flags/United-States.png" />
                <span>English</span>
                <i className="fa fa-angle-left"></i>
              </a>
              <a style={{ cursor: 'pointer' }}>
                <img className="me-3 mt-n1" width="20" src="images/flags/India.png" />
                <span>Indian</span>
                <i className="fa fa-angle-left"></i>
              </a>
              <a style={{ cursor: 'pointer' }}>
                <img className="me-3 mt-n1" width="20" src="images/flags/Germany.png" />
                <span>German</span>
                <i className="fa fa-angle-left"></i>
              </a>
              <a style={{ cursor: 'pointer' }}>
                <img className="me-3 mt-n1" width="20" src="images/flags/Italy.png" />
                <span>Italian</span>
                <i className="fa fa-angle-left"></i>
              </a>
              <a style={{ cursor: 'pointer' }} className="border-0">
                <img className="me-3 mt-n1" width="20" src="images/flags/Spain.png" />
                <span>Spanish</span>
                <i className="fa fa-angle-left"></i>
              </a>
            </div>
            <div className="clear"></div>
          </div>
        </div>

        <div
          id="menu-tips-1"
          className="menu menu-box-bottom menu-box-detached rounded-m"
          data-menu-height="350"
          data-menu-effect="menu-over"
        >
          <div className="card header-card shape-rounded" data-card-height="200">
            <div className="card-overlay bg-highlight opacity-95"></div>
            <div className="card-overlay dark-mode-tint"></div>
            <div className="card-bg preload-img" data-src="images/pictures/20s.jpg"></div>
          </div>

          <div className="mt-3 pt-1 pb-1" style={{ position: 'relative', zIndex: 10 }}>
            <h1 className="text-center">
              <i
                data-feather="smartphone"
                data-feather-line="1"
                data-feather-size="60"
                data-feather-color="gray-dark"
                data-feather-bg="none"
              ></i>
            </h1>
            <h1 className="text-center color-white font-22 font-700">PWA Ready</h1>
            <p className="text-center mt-n3 mb-3 font-11 color-white">Just add it to your home screen and Enjoy!</p>
          </div>
          <div className="card card-style">
            <p className="boxed-text-xl pt-3 mb-3">
              Azures is a Mobile Webite, but it is also a PWA! You can add it to your home screen and navigate it like you would
              navigate an application.
            </p>
          </div>
          <div className="row mb-0">
            <div className="col-6">
              <a
                style={{ cursor: 'pointer' }}
                className="btn btn-border btn-sm ms-3 rounded-s btn-full shadow-l color-highlight border-highlight close-menu text-uppercase font-700"
              >
                Close
              </a>
            </div>
            <div className="col-6">
              <a
                data-menu="menu-tips-2"
                style={{ cursor: 'pointer' }}
                className="btn btn-sm me-3 rounded-s btn-full shadow-l bg-highlight font-700 text-uppercase"
              >
                1/5 - Next
              </a>
            </div>
          </div>
        </div>

        <div
          id="menu-tips-2"
          className="menu menu-box-bottom menu-box-detached rounded-m"
          data-menu-height="350"
          data-menu-effect="menu-over"
        >
          <div className="card header-card shape-rounded" data-card-height="200">
            <div className="card-overlay bg-highlight opacity-95"></div>
            <div className="card-overlay dark-mode-tint"></div>
            <div className="card-bg preload-img" data-src="images/pictures/20s.jpg"></div>
          </div>

          <div className="mt-3 pt-1 pb-1" style={{ position: 'relative', zIndex: 10 }}>
            <h1 className="text-center">
              <i
                data-feather="moon"
                data-feather-line="1"
                data-feather-size="60"
                data-feather-color="gray-dark"
                data-feather-bg="none"
              ></i>
            </h1>
            <h1 className="text-center color-white font-22 font-700">Auto Dark Mode</h1>
            <p className="text-center mt-n2 mb-3 font-11 color-white">Just add detect-theme to your body class</p>
          </div>
          <div className="card card-style">
            <p className="boxed-text-xl pt-3 mb-3">
              With modern operating systems, we can detect if your device is in dark mode and set the theme automatically. Just
              use the detect-theme class.
            </p>
          </div>
          <div className="row mb-0">
            <div className="col-6">
              <a
                style={{ cursor: 'pointer' }}
                className="btn btn-border btn-sm ms-3 rounded-s btn-full shadow-l color-highlight border-highlight close-menu text-uppercase font-700"
              >
                Close
              </a>
            </div>
            <div className="col-6">
              <a
                data-menu="menu-tips-3"
                style={{ cursor: 'pointer' }}
                className="btn btn-sm me-3 rounded-s btn-full shadow-l bg-highlight font-700 text-uppercase"
              >
                2/5 - Next
              </a>
            </div>
          </div>
        </div>

        <div
          id="menu-tips-3"
          className="menu menu-box-bottom menu-box-detached rounded-m"
          data-menu-height="350"
          data-menu-effect="menu-over"
        >
          <div className="card header-card shape-rounded" data-card-height="200">
            <div className="card-overlay bg-highlight opacity-95"></div>
            <div className="card-overlay dark-mode-tint"></div>
            <div className="card-bg preload-img" data-src="images/pictures/20s.jpg"></div>
          </div>

          <div className="mt-3 pt-1 pb-1" style={{ position: 'relative', zIndex: 10 }}>
            <h1 className="text-center">
              <i
                data-feather="archive"
                data-feather-line="1"
                data-feather-size="60"
                data-feather-color="gray-dark"
                data-feather-bg="none"
              ></i>
            </h1>
            <h1 className="text-center color-white font-22 font-700">Hybrid App Compatible</h1>
            <p className="text-center mt-n2 mb-3 font-11 color-white">Turn Azures in a Native Mobile Application</p>
          </div>
          <div className="card card-style">
            <p className="boxed-text-xl pt-3 mb-3">
              Using Cordova or PhoneGap you can compile Azures into a Native Mobile Application! It's blazing fast and super easy
              to compile!
            </p>
          </div>
          <div className="row mb-0">
            <div className="col-6">
              <a
                style={{ cursor: 'pointer' }}
                className="btn btn-border btn-sm ms-3 rounded-s btn-full shadow-l color-highlight border-highlight close-menu text-uppercase font-700"
              >
                Close
              </a>
            </div>
            <div className="col-6">
              <a
                data-menu="menu-tips-4"
                style={{ cursor: 'pointer' }}
                className="btn btn-sm me-3 rounded-s btn-full shadow-l bg-highlight font-700 text-uppercase"
              >
                3/5 - Next
              </a>
            </div>
          </div>
        </div>

        <div
          id="menu-tips-4"
          className="menu menu-box-bottom menu-box-detached rounded-m"
          data-menu-height="350"
          data-menu-effect="menu-over"
        >
          <div className="card header-card shape-rounded" data-card-height="200">
            <div className="card-overlay bg-highlight opacity-95"></div>
            <div className="card-overlay dark-mode-tint"></div>
            <div className="card-bg preload-img" data-src="images/pictures/20s.jpg"></div>
          </div>

          <div className="mt-3 pt-1 pb-1" style={{ position: 'relative', zIndex: 10 }}>
            <h1 className="text-center">
              <i
                data-feather="zap"
                data-feather-line="1"
                data-feather-size="60"
                data-feather-color="gray-dark"
                data-feather-bg="none"
              ></i>
            </h1>
            <h1 className="text-center color-white font-22 font-700">Really, Really Fast</h1>
            <p className="text-center mt-n2 mb-3 font-11 color-white">Optimized to Perfection for your Needs</p>
          </div>
          <div className="card card-style">
            <p className="boxed-text-xl pt-3 mb-3">
              All scripts and style only are loaded only once! After that, there's no more need to worry about redownloading. It's
              optimized to perfection!
            </p>
          </div>
          <div className="row mb-0">
            <div className="col-6">
              <a
                style={{ cursor: 'pointer' }}
                className="btn btn-border btn-sm ms-3 rounded-s btn-full shadow-l color-highlight border-highlight close-menu text-uppercase font-700"
              >
                Close
              </a>
            </div>
            <div className="col-6">
              <a
                data-menu="menu-tips-5"
                style={{ cursor: 'pointer' }}
                className="btn btn-sm me-3 rounded-s btn-full shadow-l bg-highlight font-700 text-uppercase"
              >
                4/5 - Next
              </a>
            </div>
          </div>
        </div>

        <div
          id="menu-tips-5"
          className="menu menu-box-bottom menu-box-detached rounded-m"
          data-menu-height="360"
          data-menu-effect="menu-over"
        >
          <div className="card header-card shape-rounded" data-card-height="200">
            <div className="card-overlay bg-highlight opacity-95"></div>
            <div className="card-overlay dark-mode-tint"></div>
            <div className="card-bg preload-img" data-src="images/pictures/20s.jpg"></div>
          </div>

          <div className="mt-3 pt-1 pb-1" style={{ position: 'relative', zIndex: 10 }}>
            <h1 className="text-center">
              <i
                data-feather="smile"
                data-feather-line="1"
                data-feather-size="60"
                data-feather-color="gray-dark"
                data-feather-bg="none"
              ></i>
            </h1>
            <h1 className="text-center color-white font-22 font-700">Colors to Match your Style!</h1>
            <p className="text-center mt-n2 mb-3 font-11 color-white">We've added tons of colors just for you!</p>
          </div>
          <div className="card card-style">
            <p className="boxed-text-xl pt-3 mb-3">
              Azures is powered by a gorgeous color scheme that you can edit with ease and add your own custom feel to it! It's
              super simple!{' '}
            </p>
          </div>
          <a
            style={{ cursor: 'pointer' }}
            className="close-menu btn btn-m btn-margins rounded-sm btn-full shadow-l bg-highlight text-uppercase font-700"
          >
            AWesome!
          </a>
        </div>
      </div>
    </>
  );
};

export default test;
