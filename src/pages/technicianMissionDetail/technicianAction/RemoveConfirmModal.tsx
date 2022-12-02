import { FunctionComponent } from 'react';

interface RemoveConfirmModalProps {
  confirmModalVisible?: boolean;
  accept: any;
  reject: any;
}

const RemoveConfirmModal: FunctionComponent<RemoveConfirmModalProps> = ({ confirmModalVisible, accept, reject }) => {
  return (
    <>
      <div className={`modal ${confirmModalVisible ? 'd-block' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="header pointer" onClick={reject}>
              X
            </h2>
            <h1 className="header">حذف شرح اقدام</h1>
          </div>
          <p className="boxed-text-l">آیا مطمئن به حذف شرح اقدام هستید؟</p>
          <div className="row me-3 ms-3 mb-0">
            <div className="col-6">
              <a
                className="close-menu d-block success-btn"
                onClick={accept}
              >
                بله
              </a>
            </div>
            <div className="col-6">
              <a
                onClick={reject}
                className="close-menu d-block danger-btn"
              >
                خیر
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RemoveConfirmModal;
