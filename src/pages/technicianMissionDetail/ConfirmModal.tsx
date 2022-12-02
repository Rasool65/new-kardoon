import { FunctionComponent } from 'react';
import { Button } from 'reactstrap';

interface ConfirmModalProps {
  confirmModalVisible?: boolean;
  accept: any;
  reject: any;
  closeModal: any;
}

const ConfirmModal: FunctionComponent<ConfirmModalProps> = ({ confirmModalVisible, accept, reject, closeModal }) => {
  return (
    <>
      <div className={`modal ${confirmModalVisible ? 'd-block' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="header pointer" onClick={closeModal}>
              X
            </h2>
            <h1 className="header">تایید تغییر وضعیت</h1>
          </div>
          <div className="d-flex justify-content-between">
            <p className="">آیا از تغییر وضعیت اطمینان دارید؟</p>
          </div>
          <div className="row">
            <div className="col-6">
              <Button className="" onClick={accept}>
                بله
              </Button>
            </div>
            <div className="col-6">
              <Button onClick={reject} className="">
                خیر
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
