import Toggle from '@src/components/toggle';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { RootStateType } from '@src/redux/Store';
import { FunctionComponent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Input } from 'reactstrap';

interface ShowModalCheckoutProps {
  checkout: any;
  payTypeModalVisible: boolean;
  closeModal: any;
}

const ShowModalCheckout: FunctionComponent<ShowModalCheckoutProps> = ({ checkout, payTypeModalVisible, closeModal }) => {
  const { getRequest } = useHttpRequest();
  const [walletBalance, setWalletBalance] = useState<string>();
  const color = useSelector((state: RootStateType) => state.theme.color);
  const GetWalletBalance = () => {
    getRequest<IOutputResult<any>>('API_URL_GET_WALLET_BALANCE').then((result) => {
      setWalletBalance(result.data.data);
    });
  };
  useEffect(() => {
    GetWalletBalance();
  }, []);
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

          <div className='peyment-type'>
            <div className='payment-price'>
              <div>مبلغ قابل پرداخت</div>
              <div  className='amount'>2,500,000 <span className='rial'>ریال</span></div>
            </div>
            <div className="deduct-wallet">
              <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
              <label htmlFor="vehicle1">کسر از کیف پول</label>
              <div className='amount'>750,000<span className='rial'>ریال</span></div>
            </div>
            <div className='total-payment'>
              <img src={require(`@src/scss/images/icons/${color}-checked.svg`)} alt="" />
              <div>مبلغ نهایی پرداخت</div>
              <div className='amount'>1,750,000<span className='rial'>ریال</span></div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 text-center">
              <Button className="green-btn w-100" onClick={checkout}>
                پرداخت صورتحساب
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowModalCheckout;
