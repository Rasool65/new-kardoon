import { ComponentType, FunctionComponent, useEffect, useRef, useState } from 'react';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import PrevHeader from '@src/layout/Headers/PrevHeader';
import SubRequest from './SubRequest';
import Request from './Request';

export type IRequestTabs = {
  id: number;
  title: string;
  Component: ComponentType<any>;
};

const RequestTabs: IRequestTabs[] = [
  {
    id: 0,
    title: 'ریز درخواست برای مشتری',
    Component: SubRequest,
  },
  {
    id: 1,
    title: 'درخواست جدید برای مشتری',
    Component: Request,
  },
];
const TechnicianRequest: FunctionComponent<IPageProps> = (props) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [CurrentTab, setCurrentTab] = useState(RequestTabs[activeTab]);
  const handleClickTab = (tabNumber: number) => {
    setActiveTab(tabNumber);
    setCurrentTab(RequestTabs[tabNumber]);
  };

  useEffect(() => {
    document.title = RequestTabs[activeTab].title;
  }, [activeTab]);

  return (
    <>
      <PrevHeader />
      <div className="container">
        <div className="px-2 w-100">
          <div className="account-box">
            <h4
              onClick={() => {
                handleClickTab(0);
              }}
              className={`account-item pointer ${activeTab == 0 ? 'active' : ''}`}
            >
              <a>آدرس جاری</a>
            </h4>
            <h4
              onClick={() => {
                handleClickTab(1);
              }}
              className={`account-item pointer ${activeTab == 1 ? 'active' : ''}`}
            >
              <a>آدرس جدید</a>
            </h4>
          </div>
        </div>
      </div>
      <CurrentTab.Component handleClickTab={handleClickTab} />
    </>
  );
};

export default TechnicianRequest;
