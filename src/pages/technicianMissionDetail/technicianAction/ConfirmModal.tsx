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
            <h1 className="header">تایید صدور فاکتور</h1>
          </div>
          <p className="boxed-text-l">آیا از صادر نمودن فاکتور اطمینان دارید؟</p>
          <div className="row me-3 ms-3 mb-0">
            <div className="col-6">
              <button className="primary-btn green-btn" onClick={accept}>
                بله
              </button>
            </div>
            <div className="col-6">
              <button onClick={reject} className="red-btn">
                خیر
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
