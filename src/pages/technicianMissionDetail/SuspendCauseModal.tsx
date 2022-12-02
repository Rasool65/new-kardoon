import Select from 'react-select';
import { FunctionComponent } from 'react';
import { IMissionDetailResultModel, IStatusMission } from '@src/models/output/missionDetail/IMissionDetailListResultModel';
import { Button, Spinner } from 'reactstrap';

interface SuspendCouseModalProps {
  suspendReasonModalVisible: boolean;
  missionDetail?: IMissionDetailResultModel;
  statusList?: IStatusMission[];
  onChange: any;
  onClick: any;
  loading: boolean;
  closeModal: any;
}

const SuspendCauseModal: FunctionComponent<SuspendCouseModalProps> = ({
  suspendReasonModalVisible,
  missionDetail,
  statusList,
  onChange,
  onClick,
  loading,
  closeModal,
}) => {
  return (
    <div className={`modal ${suspendReasonModalVisible ? 'd-block' : ''}`}>
      <div className="modal-content">
        <div className="modal-header d-flex justify-content-between p-2">
          <h2 className="header pointer" onClick={closeModal}>
            X
          </h2>
          <h2 className="header">منتظر لغو</h2>
        </div>
        <p className="font-13">لطفأ دلیل انتخاب وضعیت منتظر لغو را وارد نمایید</p>
        {missionDetail?.statusTitle && (
          <Select
            isMulti
            isClearable
            placeholder="انتخاب دلیل منتظر لغو"
            isSearchable={false}
            options={statusList![1].causeList ? statusList![1].causeList : []}
            onChange={onChange}
          />
        )}
        <Button
          style={{ width: '100%', marginTop: '10px' }}
          className="btn btn-full btn-m shadow-l rounded-s bg-highlight text-uppercase font-700 top-20 p-1"
          onClick={onClick}
        >
          {loading ? <Spinner style={{ width: '1rem', height: '1rem' }} /> : 'ثبت'}
        </Button>
      </div>
    </div>
  );
};

export default SuspendCauseModal;
