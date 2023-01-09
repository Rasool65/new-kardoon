import useHttpRequest from '@src/hooks/useHttpRequest';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { RootStateType } from '@src/redux/Store';
import { FunctionComponent, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'reactstrap';
import { UtilsHelper } from '@src/utils/GeneralHelpers';
import { API_URL_GET_WALLET_BALANCE } from '@src/configs/apiConfig/apiUrls';
import { IWalletBalanceResultModel } from '@src/models/output/orderDetail/IWalletBalanceResultModel';
import { LoadingComponent } from '@src/components/spinner/LoadingComponent';
import { handleWalletBalance } from '@src/redux/reducers/messageReducer';

interface ShowModalCheckoutProps {
  checkout: any;
  payTypeModalVisible: boolean;
  closeModal: any;
  totalAmount: number;
  loading: boolean;
}

const ShowModalCheckout: FunctionComponent<ShowModalCheckoutProps> = ({
  checkout,
  payTypeModalVisible,
  closeModal,
  totalAmount,
  loading,
}) => {
  const { getRequest } = useHttpRequest();
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const color = useSelector((state: RootStateType) => state.theme.color);
  const [payment, setPayment] = useState<number>(0);
  const [displayCheckBox, setDisplayCheckBox] = useState<boolean>(false);
  const dispatch = useDispatch();
  const GetWalletBalance = () => {
    getRequest<IOutputResult<IWalletBalanceResultModel>>(`${API_URL_GET_WALLET_BALANCE}`).then((result) => {
      setWalletBalance(result.data.data.balance!);
      dispatch(handleWalletBalance(result.data.data.balance));
    });
  };
  const handleWallet = (isChecked: boolean) => {
    isChecked ? setPayment(totalAmount - walletBalance) : setPayment(totalAmount);
  };
  useEffect(() => {
    GetWalletBalance();
  }, []);

  useEffect(() => {
    setPayment(totalAmount);
    walletBalance < 0 ? (handleWallet(true), setDisplayCheckBox(true)) : setDisplayCheckBox(false);
  }, [walletBalance]);

  useEffect(() => {
    setPayment(totalAmount - walletBalance);
  }, [totalAmount]);
  return (
    <>
      <div className={`modal ${payTypeModalVisible ? 'd-block' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="header pointer" onClick={closeModal}>
              X
            </h2>
            <h1 className="header">تعیین نوع پرداخت</h1>
          </div>

          <div className="peyment-type">
            <div className="payment-price">
              <div>مبلغ قابل پرداخت</div>
              <div className="amount">
                {totalAmount == 0 ? '0' : UtilsHelper.threeDigitSeparator(totalAmount)} <span className="rial">ریال</span>
              </div>
            </div>
            <div className="deduct-wallet">
              <input
                disabled={displayCheckBox}
                defaultChecked={true}
                type="checkbox"
                id="vehicle1"
                name="vehicle1"
                onClick={(e) => {
                  handleWallet(e.currentTarget.checked);
                }}
              />
              <label htmlFor="vehicle1">کسر از کیف پول</label>
              <div className="amount">
                {walletBalance == 0 ? '0' : UtilsHelper.threeDigitSeparator(walletBalance)}
                <span className="rial">ریال</span>
              </div>
            </div>
            <div className="total-payment">
              <img src={require(`@src/scss/images/icons/${color}-checked.svg`)} alt="" />
              <div>{payment < 0 ? 'مانده حساب' : 'مبلغ نهایی پرداخت'}</div>
              <div className={`amount ${payment < 0 ? 'negative' : 'positive'}`}>
                {UtilsHelper.threeDigitSeparator(Math.abs(payment))}
                <span className="rial">ریال</span>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 text-center">
              {loading ? (
                <LoadingComponent />
              ) : (
                <Button className="green-btn w-100" onClick={() => checkout(payment)}>
                  پرداخت صورتحساب
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowModalCheckout;
