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
  const [refKey, setRefKey] = useState<number>();
  const [id, setId] = useState<number>();
  const handleClickTab = (tabNumber: number) => {
    setActiveTab(tabNumber);
    setCurrentTab(RegisterRequestTabs[tabNumber]);
  };

  const handleClickNext = (id?: number, userName?: string, tabNumber?: number, refKey?: number) => {
    setRefKey(refKey);
    setUserName(userName);
    setId(id);
    setActiveTab(tabNumber!);
    setCurrentTab(RegisterRequestTabs[tabNumber!]);
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
              className={`account-item mw-30p pointer ${activeTab == 0 ? 'active' : ''}`}
            >
              <a>ثبت نام</a>
            </h4>
            <h4
              onClick={() => {
                handleClickTab(1);
              }}
              className={`account-item mw-30p pointer ${activeTab == 1 ? 'active' : ''}`}
            >
              <a>ثبت آدرس</a>
            </h4>
            <h4
              onClick={() => {
                handleClickTab(2);
              }}
              className={`account-item mw-30p pointer ${activeTab == 2 ? 'active' : ''}`}
            >
              <a>ثبت درخواست</a>
            </h4>
          </div>
        </div>
      </div>
      <CurrentTab.Component
        handleClickTab={handleClickTab}
        handleClickNext={handleClickNext}
        userName={userName}
        refKey={refKey}
        id={id}
      />
    </>
  );
};

export default TechnicianRequestConsumer;
