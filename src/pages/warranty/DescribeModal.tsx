import { FunctionComponent } from 'react';
import { Button, Input, Spinner } from 'reactstrap';

interface DescribeModalProps {
  loading?: boolean;
  followUpModalVisible: boolean;
  AddFollowUp: Function;
  onChange: any;
  closeModal: any;
}

const DescribeModal: FunctionComponent<DescribeModalProps> = ({
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
          <h1 className="header">ثبت شرح جدید</h1>
        </div>
        <p className="font-13 mb-1 pt-1">شرح درخواست را وارد نمایید</p>
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
  );
};

export default DescribeModal;
