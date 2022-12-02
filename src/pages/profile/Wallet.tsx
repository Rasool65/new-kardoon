import Footer from '@src/layout/Footer';
import Header from '@src/layout/Headers/Header';
import { FunctionComponent, useEffect, useState } from 'react';
import { IProfilePageProp } from './IProfilePageProp';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { Input } from 'reactstrap';
import { IOutputResult } from '@src/models/output/IOutputResult';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { ITechnicianProfileResultModel } from '@src/models/output/technician/ITechnicianProfileResultModel';
import { APIURL_GET_TECHNICIAN_PROFILE, APIURL_POST_WALLET_PAYMENT } from '@src/configs/apiConfig/apiUrls';
import { UtilsHelper } from '@src/utils/GeneralHelpers';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import { BASE_URL } from '@src/configs/apiConfig/baseUrl';
import { URL_CALLBACK } from '@src/configs/urls';
import TransactionList from './TransactionList';

const Wallet: FunctionComponent<IProfilePageProp> = ({ handleClickTab }) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const httpRequest = useHttpRequest();
  const [payment, setPayment] = useState<number>(0);
  const [profile, setProfile] = useState<ITechnicianProfileResultModel>();
  const [checkOutLoading, setCheckOutLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const CheckOutPayment = (walletBalance: number) => {
    setCheckOutLoading(true);
    const body = {
      technicianId: userData?.userId,
      amount: Math.abs(walletBalance),
      userId: userData?.userId,
      callBackUrl: BASE_URL + URL_CALLBACK,
      destinationUrl: window.location.href,
    };
    httpRequest
      .postRequest<IOutputResult<any>>(`${APIURL_POST_WALLET_PAYMENT}`, body)
      .then((result) => {
        setCheckOutLoading(false);
        window.open(result.data.data, '_self');
      })
      .catch(() => {
        setCheckOutLoading(false);
      });
  };
  const GetTechnicianProfile = () => {
    httpRequest
      .getRequest<IOutputResult<ITechnicianProfileResultModel>>(
        `${APIURL_GET_TECHNICIAN_PROFILE}?TechnicianId=${userData?.userId}`
      )
      .then((result) => {
        setProfile(result.data.data);
        setPayment(Math.abs(result.data.data.walletBalance));
      });
  };
  useEffect(() => {
    GetTechnicianProfile();
  }, []);
  return (
    <>
      <div className="home-container">
        <Header />
        <Footer activePage={3} />
        <div className="container">
          <div className="px-2 w-100">
            <div className="account-box">
              <h4 className="account-item">
                <a
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    handleClickTab(0);
                  }}
                >
                  حساب کاربری
                </a>
              </h4>
              <h4 className="account-item active">
                <a
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    handleClickTab(1);
                  }}
                >
                  کیف پول
                </a>
              </h4>
            </div>
          </div>
        </div>
        <div className="container">
          <section className="profile-section">
            <div className="account-profile">
              <div
                className={`profile-image user-activity ${!profile?.isActive && ' user-disable'}`}
                style={{
                  backgroundImage: `url(${
                    userData?.profile?.profileImageUrl
                      ? userData?.profile?.profileImageUrl
                      : require('@src/scss/images/profile-defult-img.png')
                  }`,
                }}
              >
                {/* <input type="file" className="upload-image-input" /> */}
              </div>
            </div>
            <div className="user-info">
              <h3>
                {userData?.profile?.firstName} {userData?.profile?.lastName}
              </h3>
              <p>{userData?.profile?.email}</p>
            </div>
          </section>

          <div className="container-16">
            <section>
              <div className="wallet-info">
                <h5 className="item-label">موجودی کیف پول</h5>
                <p className="wallet-amount">
                  {UtilsHelper.threeDigitSeparator(
                    profile?.walletBalance && profile?.walletBalance < 0
                      ? '(' + profile?.walletBalance.toString().substring(1) + ') ریال بدهکار'
                      : profile?.walletBalance.toString() + 'ریال بستانکار'
                  )}{' '}
                </p>
              </div>
              {/* <!-- succes-payment --> */}
              <div className="wallet-info failed-payment">
                <div className="mw-670">
                  <h5 className="item-label">افزایش کیف پول (ریال)</h5>
                  <div className="wallet-btn-box">
                    <button className="wallet-btn active" onClick={() => setPayment(5000000)}>
                      5,000,000
                    </button>
                    <button className="wallet-btn" onClick={() => setPayment(2000000)}>
                      2,000,000
                    </button>
                    <button className="wallet-btn" onClick={() => setPayment(500000)}>
                      500,000
                    </button>
                  </div>
                  <div className="wallet-input-box">
                    <button className="wallet-icon-btn">
                      <img
                        src={require(`@src/scss/images/icons/${color}-antdesignplusoutlined3441-ss1.svg`)}
                        alt="antdesignplusoutlined3441"
                        className="home-antdesignplusoutlined"
                      />
                    </button>
                    <Input
                      defaultValue={profile?.walletBalance && payment}
                      className="primary-input form-control"
                      onChange={(e: any) => setPayment(e.currentTarget.value)}
                      type="number"
                      placeholder="مبلغ مورد نظر را وارد کنید"
                    />
                    <button className="wallet-icon-btn">
                      <img
                        src={require(`@src/scss/images/icons/${color}-antdesignminusoutlined3441-1xkm.svg`)}
                        alt="antdesignminusoutlined3441"
                        className="home-antdesignminusoutlined"
                      />
                    </button>
                  </div>
                  <div className="row"></div>
                  <div className="walet-btn">
                    <button
                      onClick={() => {
                        CheckOutPayment(payment);
                      }}
                      className="primary-btn green-btn"
                    >
                      {checkOutLoading ? <LoadingComponent /> : ' افزایش موجودی'}
                    </button>
                    {profile?.walletBalance && profile?.walletBalance > 0 && <button className="success-btn">برداشت وجه</button>}
                  </div>
                </div>
                <TransactionList />
                {/* <div className="mw-670">
                  <div className="transaction-status">
                    <img src={require(`@src/scss/images/icons/${color}-successCheck.svg`)} />
                    <h4 className="success-title">پرداخت موفق</h4>
                  </div>
                  <p className="transaction-description">موجودی کیف پول شما افزایش یافت</p>
                  <div className="transaction-btn-box">
                    <button className="primary-btn">مشاهده جزییات تراکنش</button>
                    <div>بازگشت</div>
                  </div>
                </div>
                <div className="mw-670">
                  <div className="transaction-status">
                    <img src={require(`@src/scss/images/icons/${color}-closeCheck.svg`)} />
                    <h4 className="failed-title">پرداخت ناموفق</h4>
                  </div>
                  <p className="transaction-description">موجودی کیف پول شما افزایش نیافت</p>
                  <div className="transaction-btn-box">
                    <button
                      // onclick="bottomSheet()"
                      className="primary-btn"
                    >
                      مشاهده جزییات تراکنش
                    </button>
                    <div>بازگشت</div>
                  </div>
                </div> */}
              </div>
            </section>
          </div>

          {/* <div
            id="botm-ovr"
            className="filter-ovely"
            // onclick="bottomSheet()"
          >
            .
          </div>
          <div id="bottom-sheet" className="bottom-sheet">
            <div className="container-16">
              <div className="sort-title">
                <h4>جزئیات تراکنش</h4>
                <img
                  src="../public/playground_assets/close-btn.svg"
                  // onclick="bottomSheet()"
                />
              </div>
              <hr />
              <div className="transaction-details-box">
                <div className="transaction-item container-16 title">
                  <p>عنوان</p>
                  <p>جزئیات</p>
                </div>
                <div className="transaction-item container-16">
                  <p className="transaction-item-title">پرداخت کننده</p>
                  <p>آریا زمانی</p>
                </div>
                <div className="transaction-item container-16">
                  <p className="transaction-item-title">مبلغ پرداخت</p>
                  <p>۳۴۵۰۰ ریال</p>
                </div>
                <div className="transaction-item container-16">
                  <p className="transaction-item-title">تاریخ و زمان</p>
                  <p>۱۴۰۱ ساعت ۱۰</p>
                </div>
                <div className="transaction-item container-16">
                  <p className="transaction-item-title">توضیحات</p>
                  <p>بابت شارژ کیف پول</p>
                </div>
                <div className="transaction-item container-16">
                  <p className="transaction-item-title"> شناسه پرداخت </p>
                  <p>۱۴۰۱</p>
                </div>
                <div className="transaction-item container-16">
                  <p className="transaction-item-title"> شناسه مرجع </p>
                  <p>28fsd545656sdfvv3</p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Wallet;
