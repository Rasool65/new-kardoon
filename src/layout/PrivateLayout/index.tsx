import { FunctionComponent } from 'react';
import IPageProps from '@src/configs/routerConfig/IPageProps';

const PrivateLayout = (props: any) => {
  const { children, title } = props;
  return (
    <div id="body">
      <div className="page-content">
        <div className="card header-card shape-rounded" data-card-height="150" style={{ height: '150px' }}>
          <div className="card-overlay bg-highlight opacity-95"></div>
          <div className="card-overlay dark-mode-tint"></div>
          <div
            className="card-bg preload-img entered loaded"
            // data-src={require('src/scss/images/pictures/20s.jpg')}
            data-ll-status="loaded"
            style={{ backgroundImage: 'url("src/scss/images/pictures/20s.jpg")' }}
          ></div>
        </div>
        {children}
      </div>
    </div>
  );
};
export default PrivateLayout;
