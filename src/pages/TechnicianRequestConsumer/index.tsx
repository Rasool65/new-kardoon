import { ComponentType, FunctionComponent, useEffect, useState } from 'react';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import PrevHeader from '@src/layout/Headers/PrevHeader';
import Register from './Register';
import AddRequest from './AddRequest';
import AddAddress from './AddAddress';

export type IRequestTabs = {
  id: number;
  title: string;
  Component: ComponentType<any>;
};

const RegisterRequestTabs: IRequestTabs[] = [
  {
    id: 0,
    title: 'ثبت نام مشتری',
    Component: Register,
  },
  {
    id: 1,
    title: 'افزودن آدرس برای مشتری',
    Component: AddAddress,
  },
  {
    id: 2,
    title: 'افزودن درخواست برای مشتری',
    Component: AddRequest,
  },
];

const TechnicianRequestConsumer: FunctionComponent<IPageProps> = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [CurrentTab, setCurrentTab] = useState(RegisterRequestTabs[activeTab]);
  const [userName, setUserName] = useState<string>();
  const handleClickTab = (tabNumber: number) => {
    setActiveTab(tabNumber);
    setCurrentTab(RegisterRequestTabs[tabNumber]);
  };

  const handleClickNext = (userName: string, tabNumber: number) => {
    setUserName(userName);
    setActiveTab(tabNumber);
    setCurrentTab(RegisterRequestTabs[tabNumber]);
  };

  useEffect(() => {
    document.title = RegisterRequestTabs[activeTab].title;
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
              <a>ثبت نام</a>
            </h4>
            <h4
              onClick={() => {
                handleClickTab(1);
              }}
              className={`account-item pointer ${activeTab == 1 ? 'active' : ''}`}
            >
              <a>افزودن آدرس</a>
            </h4>
            <h4
              onClick={() => {
                handleClickTab(2);
              }}
              className={`account-item pointer ${activeTab == 2 ? 'active' : ''}`}
            >
              <a>افزودن درخواست</a>
            </h4>
          </div>
        </div>
      </div>
      <CurrentTab.Component handleClickTab={handleClickTab} handleClickNext={handleClickNext} />
    </>
  );
};

export default TechnicianRequestConsumer;
