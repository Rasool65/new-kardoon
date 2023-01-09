import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';

interface CallModalProps {
  callModalVisible: boolean;
  closeModal: any;
  phoneNumbers: any[];
}

const CallModal: FunctionComponent<CallModalProps> = ({ callModalVisible, closeModal, phoneNumbers }) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  return (
    <>
      <div className={`modal ${callModalVisible ? 'd-block' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="header pointer" onClick={closeModal}>
              X
            </h2>
            <h1 className="header">انتخاب شماره تماس</h1>
          </div>
          <div className="d-flex justify-content-between">
            <p className="">شماره مورد نظر برای تماس را انتخاب فرمایید</p>
          </div>
          <div className="row">
            <div className="col-6">
              <div
                className="modal-call-box"
                onClick={() => window.open(`tel:${phoneNumbers[0]}`, '_self')}
              >
                <div className='modal-call-btn'>
                  <img
                    src={require(`@src/scss/images/icons/${color}-phone-icon.svg`)}
                    alt="VectorI344"
                  />
                </div>
                <span>{phoneNumbers[0]}</span>
              </div>
            </div>
            <div className="col-6">
            <div
                className="modal-call-box"
                onClick={() => window.open(`tel:${phoneNumbers[1]}`, '_self')}
              >
                <div className='modal-call-btn'>
                  <img
                    src={require(`@src/scss/images/icons/${color}-phone-icon.svg`)}
                    alt="VectorI344"
                  />
                </div>
                <span>{phoneNumbers[1]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CallModal;
