import { FunctionComponent } from 'react';

interface RemoveConfirmModalProps {
  confirmModalVisible?: boolean;
  accept: any;
  reject: any;
}

const ConfirmModal: FunctionComponent<RemoveConfirmModalProps> = ({ confirmModalVisible, accept, reject }) => {
  return (
    <>
      <div className={`modal ${confirmModalVisible ? 'd-block' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="header pointer" onClick={reject}>
              X
            </h2>
            <h1 className="header">تایید ثبت درخواست</h1>
          </div>
          <p className="boxed-text-l">آیا از ثبت درخواست جدید برای مشتری اطمینان دارید؟</p>
          <div className="row me-3 ms-3 mb-0">
            <div className="col-6">
              <a className="" onClick={accept}>
                بله
              </a>
            </div>
            <div className="col-6">
              <a onClick={reject} className="">
                خیر
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
