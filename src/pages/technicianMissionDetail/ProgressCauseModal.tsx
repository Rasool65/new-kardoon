import Select from 'react-select';
import { IMissionDetailResultModel, IStatusMission } from '@src/models/output/missionDetail/IMissionDetailListResultModel';
import { FunctionComponent } from 'react';
import { Button, Spinner } from 'reactstrap';

interface ProgressCauseModalProps {
  progressReasonModalVisible: boolean;
  missionDetail?: IMissionDetailResultModel;
  statusList?: IStatusMission[];
  onChange: any;
  onClick: any;
  loading: boolean;
  closeModal: any;
}

const ProgressCauseModal: FunctionComponent<ProgressCauseModalProps> = ({
  progressReasonModalVisible,
  missionDetail,
  statusList,
  onChange,
  onClick,
  loading,
  closeModal,
}) => {
  return (
    <div className={`modal ${progressReasonModalVisible ? 'd-block' : ''}`}>
      <div className="modal-content">
        <div className="modal-header d-flex justify-content-between p-2">
          <h2 className="header pointer" onClick={closeModal}>
            X
          </h2>
          <h2 className="header">در حال بررسی</h2>
        </div>
        <p className="font-13 mb-1 pt-1">لطفأ دلیل انتخاب وضعیت در حال بررسی را وارد نمایید</p>
        {missionDetail?.statusTitle && (
          <Select
            isMulti
            isClearable
            placeholder="انتخاب دلیل درحال بررسی"
            isSearchable={false}
            options={statusList![4].causeList ? statusList![4].causeList : []}
            onChange={onChange}
          />
        )}
        <Button style={{ width: '100%', marginTop: '10px' }} className="btn p-1" onClick={onClick}>
          {loading ? <Spinner style={{ width: '1rem', height: '1rem' }} /> : 'ثبت'}
        </Button>
      </div>
    </div>
  );
};

export default ProgressCauseModal;
