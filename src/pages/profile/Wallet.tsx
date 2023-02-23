import Footer from '@src/layout/Footer';
import Header from '@src/layout/Headers/Header';
import Num2persian from 'num2persian';
import { FunctionComponent, useEffect, useState } from 'react';
import { IProfilePageProp } from './IProfilePageProp';
import { useSelector, useDispatch } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { Input, Spinner } from 'reactstrap';
import { IOutputResult } from '@src/models/output/IOutputResult';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { ITechnicianProfileResultModel } from '@src/models/output/technician/ITechnicianProfileResultModel';
import {
  APIURL_GET_TECHNICIAN_PROFILE,
  APIURL_POST_WALLET_PAYMENT,
  APIURL_POST_WALLET_WITH_DRAW,
  API_URL_GET_WALLET_BALANCE,
} from '@src/configs/apiConfig/apiUrls';
import { UtilsHelper } from '@src/utils/GeneralHelpers';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import { BASE_URL } from '@src/configs/apiConfig/baseUrl';
import { URL_CALLBACK } from '@src/configs/urls';
import TransactionList from './TransactionList';
import { useToast } from '@src/hooks/useToast';
import { IWalletBalanceResultModel } from './../../models/output/orderDetail/IWalletBalanceResultModel';
import { handleWalletBalance } from '@src/redux/reducers/messageReducer';

const Wallet: FunctionComponent<IProfilePageProp> = ({ handleClickTab }) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const httpRequest = useHttpRequest();
  const toast = useToast();
  const [payment, setPayment] = useState<number>(0);
  const [profile, setProfile] = useState<ITechnicianProfileResultModel>();
  const [checkOutLoading, setCheckOutLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<number>();
  const dispatch = useDispatch();
  const CheckOutPayment = (walletBalance: number) => {
    if (walletBalance < 11000) return toast.showError('مبلغ نمی تولند کمتر از 1,100 تومان باشد');
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

  const checkRole = (normalizedName: string) => {
    return userData?.roles ? userData?.roles.some((roleName) => roleName.normalizedName === normalizedName) : false;
  };

  const GetWalletBalance = () => {
    httpRequest.getRequest<IOutputResult<IWalletBalanceResultModel>>(`${API_URL_GET_WALLET_BALANCE}`).then((result) => {
      setWalletBalance(result.data.data.balance);
      dispatch(handleWalletBalance(result.data.data.balance));
    });
  };
  const CashPayment = () => {
    setCheckOutLoading(true);
    const body = {
      description: 'برداشت وجه',
      amount: Math.abs(payment),
      userId: userData?.userId,
    };
    httpRequest
      .postRequest<IOutputResult<any>>(`${APIURL_POST_WALLET_WITH_DRAW}`, body)
      .then((result) => {
        setCheckOutLoading(false);
        toast.showSuccess('برداشت وجه با موفقیت انجام شد');
      })
      .catch(() => {
        setCheckOutLoading(false);
      });
  };

  useEffect(() => {
    GetTechnicianProfile();
    GetWalletBalance();
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
                className={`profile-image user-activity ${!profile?.isActive && checkRole('TECHNICIAN') && ' user-disable'}`}
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
                <p className={`wallet-amount ${walletBalance && walletBalance < 0 ? 'debtor-text' : 'creditor-text'}`}>
                  {walletBalance
                    ? UtilsHelper.threeDigitSeparator(
                        walletBalance && walletBalance < 0
                          ? '(' + walletBalance.toString().substring(1) + ') ریال بدهکار'
                          : walletBalance.toString() + ' ریال بستانکار'
                      )
                    : '0 ریال'}{' '}
                </p>
              </div>
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
                        onClick={() => {
                          setPayment(Number(payment + 100000));
                        }}
                        alt="antdesignplusoutlined3441"
                        className="home-antdesignplusoutlined"
                      />
                    </button>
                    <Input
                      defaultValue={profile?.walletBalance && payment}
                      className="primary-input form-control text-center"
                      onChange={(e: any) => setPayment(e.currentTarget.value)}
                      type="number"
                      value={payment}
                      placeholder="مبلغ مورد نظر را وارد کنید"
                    />
                    <button className="wallet-icon-btn">
                      <img
                        onClick={() => {
                          setPayment(Number(payment - 100000));
                        }}
                        src={require(`@src/scss/images/icons/${color}-antdesignminusoutlined3441-1xkm.svg`)}
                        alt="antdesignminusoutlined3441"
                        className="home-antdesignminusoutlined"
                      />
                    </button>
                  </div>
                  <div className="row"></div>
                  <div className="walet-btn">
                    <div className="w-100 mb-2">{Num2persian(Number(payment) / 10)} تومان</div>
                    <br />
                    <button
                      onClick={() => {
                        CheckOutPayment(payment);
                      }}
                      className="primary-btn green-btn"
                    >
                      {checkOutLoading ? <LoadingComponent /> : ' افزایش موجودی'}
                    </button>
                    {profile?.walletBalance && profile?.walletBalance > 0 && (
                      <button
                        onClick={() => {
                          CashPayment();
                        }}
                        className="success-btn"
                      >
                        {checkOutLoading ? <Spinner /> : 'برداشت وجه'}
                      </button>
                    )}
                  </div>
                </div>
                <TransactionList />
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wallet;
