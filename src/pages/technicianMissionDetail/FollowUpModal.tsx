import { FunctionComponent } from 'react';
import { Button, Input, Spinner } from 'reactstrap';

interface FollowUpModalProps {
  loading?: boolean;
  followUpModalVisible: boolean;
  AddFollowUp: Function;
  onChange: any;
  closeModal: any;
}

const FollowUpModal: FunctionComponent<FollowUpModalProps> = ({
  followUpModalVisible,
  loading,
  AddFollowUp,
  onChange,
  closeModal,
}) => {
  return (
    <div className={`modal ${followUpModalVisible ? 'd-block' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="header pointer" onClick={closeModal}>
            X
          </h2>
          <h1 className="header">ثبت پیگیری جدید</h1>
        </div>
        <p className="font-13 mb-1 pt-1">در ایجاد ثبت پیگیری دقت فرمایید ، امکان حذف یا ویرایش پس از ثبت پیگیری وجود ندارد.</p>
        <Input name="followUp" type="textarea" onChange={onChange} />
        <Button
          style={{ width: '100%', marginTop: '10px' }}
          className="btn green-btn"
          onClick={() => {
            AddFollowUp();
          }}
        >
          {loading ? <Spinner style={{ width: '1rem', height: '1rem' }} /> : 'ثبت'}
        </Button>
      </div>
    </div>

    // <div
    //   className={`menu menu-box-modal rounded-m ${followUpModalVisible ? 'menu-active' : ''}`}
    //   data-menu-height="255"
    //   data-menu-width="340"
    // >
    //   <div className="me-3 ms-3 mt-3">
    //     <h2 className="font-500 mb-0 pt-1">ثبت پیگیری جدید</h2>
    //     <p className="font-13 mb-1 pt-1">در ایجاد ثبت پیگیری دقت فرمایید ، امکان حذف یا ویرایش پس از ثبت پیگیری وجود ندارد.</p>
    //     <Input name="followUp" type="textarea" onChange={onChange} />
    //     <Button
    //       style={{ width: '100%', marginTop: '10px' }}
    //       className="btn btn-full btn-m shadow-l rounded-s bg-highlight text-uppercase font-700 top-20 p-1"
    //       onClick={() => {
    //         AddFollowUp();
    //       }}
    //     >
    //       {loading ? <Spinner style={{ width: '1rem', height: '1rem' }} /> : 'ثبت'}
    //     </Button>
    //   </div>
    // </div>
  );
};

export default FollowUpModal;
