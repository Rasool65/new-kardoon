import { FunctionComponent } from 'react';
import { Button, Input, Spinner } from 'reactstrap';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import InputIcon from 'react-multi-date-picker/components/input_icon';
const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
interface FollowUpModalProps {
  loading?: boolean;
  followUpModalVisible: boolean;
  AddFollowUp: Function;
  onChange: any;
  closeModal: any;
  nextTrackingDateTime: any;
}

const FollowUpModal: FunctionComponent<FollowUpModalProps> = ({
  followUpModalVisible,
  loading,
  AddFollowUp,
  onChange,
  nextTrackingDateTime,
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
        <div className="m-2">
          تاریخ مراجعه بعدی{' '}
          <DatePicker
            render={<InputIcon style={{ height: 'calc(2.4em + 0.75rem - 6px)', width: '100%' }} />}
            weekDays={weekDays}
            inputClass="form-control"
            onChange={nextTrackingDateTime}
            format="YYYY/MM/DD"
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
          />
        </div>
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

export default FollowUpModal;
