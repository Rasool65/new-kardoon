import { FunctionComponent, ComponentType, useState, useEffect } from 'react';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import { useLocation } from 'react-router-dom';
import PrevHeader from '@src/layout/Headers/PrevHeader';
import RequestDetailInfo from './RequestDetailInfo';
import Invoices from './Invoices';
import FooterCard from '@src/layout/Footer';
import { IRequestDetailInfo, IOrderDetailListResultModel } from '@src/models/output/orderDetail/IOrderDetailListResultModel';
import { APIURL_GET_ORDER_DETAILS } from '@src/configs/apiConfig/apiUrls';
import { IOutputResult } from '@src/models/output/IOutputResult';
import useHttpRequest from '@src/hooks/useHttpRequest';

export type IOrderTabs = {
  id: number;
  title: string;
  Component: ComponentType<any>;
};

const UserAccount: FunctionComponent<IPageProps> = (props) => {
  const [order, setOrder] = useState<IOrderDetailListResultModel>();
  const OrderTabs: IOrderTabs[] = [
    {
      id: 0,
      title: 'جزییات رسید',
      Component: RequestDetailInfo,
    },
    {
      id: 1,
      title: 'جزییات سفارش',
      Component: Invoices,
    },
  ];
  const [activeTab, setActiveTab] = useState<number>(0);
  const [CurrentTab, setCurrentTab] = useState(OrderTabs[activeTab]);

  const search = useLocation().search;
  const requestDetailId = new URLSearchParams(search).get('id');
  const httpRequest = useHttpRequest();
  const [loading, setLoading] = useState<boolean>(false);

  const handleClickTab = (tabNumber: number) => {
    setActiveTab(tabNumber);
    setCurrentTab(OrderTabs[tabNumber]);
  };

  const GetOrder = () => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<IOrderDetailListResultModel>>(`${APIURL_GET_ORDER_DETAILS}?id=${requestDetailId}`)
      .then((result) => {
        setOrder(result.data.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    GetOrder();
  }, []);

  useEffect(() => {
    document.title = OrderTabs[activeTab].title;
  }, [activeTab]);

  return (
    <>
      <FooterCard />
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
              <a>جزییات رسید</a>
            </h4>
            <h4
              onClick={() => {
                handleClickTab(1);
              }}
              className={`account-item pointer ${activeTab == 1 ? 'active' : ''}`}
            >
              <a>جزییات سفارش</a>
            </h4>
          </div>
        </div>
      </div>
      <CurrentTab.Component
        handleClickTab={handleClickTab}
        requestDetailInfo={order?.requestDetailInfo}
        invoices={order?.invoices}
        getOrder={GetOrder}
        loading={loading}
      />
    </>
  );
};

export default UserAccount;
