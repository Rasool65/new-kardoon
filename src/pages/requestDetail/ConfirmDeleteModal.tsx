import { FunctionComponent } from 'react';
import { Button } from 'reactstrap';

interface ConfirmDeleteModalProps {
  confirmModalVisible?: boolean;
  accept: any;
  reject: any;
}

const ConfirmDeleteModal: FunctionComponent<ConfirmDeleteModalProps> = ({ confirmModalVisible, accept, reject }) => {
  return (
    <>
      <div className={`modal ${confirmModalVisible ? 'd-block' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="header pointer" onClick={reject}>
              X
            </h2>
            <h1 className="header">تایید حذف آدرس</h1>
          </div>
          <div className="d-flex justify-content-between">
            <p className="">آیا از حذف آدرس موردنظر اطمینان دارید؟</p>
          </div>
          <div className="row">
            <div className="col-6">
              <Button className="btn" onClick={accept}>
                بله
              </Button>
            </div>
            <div className="col-6">
              <Button onClick={reject} className="btn">
                خیر
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDeleteModal;
