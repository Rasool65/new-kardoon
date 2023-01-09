import { FunctionComponent } from 'react';

interface ConversationLoadingProps {}

const ConversationLoading: FunctionComponent<ConversationLoadingProps> = () => {
  return (
    <>
    <div className="skeleton-page">
      <div className="conversation">
        <div className="header skeleton">
          <img src={require('@src/scss/images/icons/Kardoon-logo-w.svg')} className="header-logo" alt="" />
          <img src={require('@src/scss/images/icons/menu-toggle.svg')} className="menu-box-toggle" alt="" />
        </div>

        <div className="container">
          <div className="search-card">
            <div className="search-box skeleton"></div>
          </div>
          <div className="card after-search">
            <div className="content skeleton"></div>
            <div className="content skeleton"></div>
            <div className="content skeleton"></div>
            <div className="content skeleton"></div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ConversationLoading;
