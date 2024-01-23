import LoadingComponent from '@src/components/spinner/LoadingComponent';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { ITransactionResultModel } from '@src/models/output/technician/ITransactionResultModel';
import { RootStateType } from '@src/redux/Store';
import { DateHelper } from '@src/utils/dateHelper';
import { UtilsHelper } from '@src/utils/GeneralHelpers';
import { FunctionComponent, useEffect, useState } from 'react';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import InputIcon from 'react-multi-date-picker/components/input_icon';
import { useSelector } from 'react-redux';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { APIURL_GET_TRANSACTION } from '@src/configs/apiConfig/apiUrls';
import { Input } from 'reactstrap';

interface TransactionListProps {}

const TransactionList: FunctionComponent<TransactionListProps> = () => {
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const [datePicker, setDatePicker] = useState<boolean>(true);
  const [fromDate, setFromDate] = useState<string>();
  const httpRequest = useHttpRequest();
  const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  const [transaction, setTransaction] = useState<ITransactionResultModel[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const auth = useSelector((state: RootStateType) => state.authentication.isAuthenticate);
  const GetTransactionList = (fromDate: string, endDate: string) => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<ITransactionResultModel[]>>(
        `${APIURL_GET_TRANSACTION}?TechnicianId=${userData?.userId}&DateFrom=${fromDate}&DateTo=${endDate}`
      )
      .then((result) => {
        setTransaction(result.data.data.reverse());
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    GetTransactionList(
      new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getMonth()).toISOString(),
      new Date().toISOString()
    );
  }, []);
  const handleSearch = (searchData: string) => {
    const filteredData = transaction?.filter((item) => {
      return (
        item.requestNumber?.match(searchData) ||
        item.consumerFirstName?.match(searchData) ||
        item.consumerLastName?.match(searchData)
      );
    });

    searchData
      ? setTransaction(filteredData)
      : GetTransactionList(
          new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getMonth()).toISOString(),
          new Date().toISOString()
        );
  };

  return (
    <>
      <h4 className="m-3">لیست تراکنش ها</h4>
      <div className="d-flex justify-content-between mt-3 mb-3">
        <div className="m-2">
          از تاریخ{' '}
          <DatePicker
            render={<InputIcon style={{ height: 'calc(2.4em + 0.75rem - 6px)', width: '100%' }} />}
            weekDays={weekDays}
            inputClass="form-control"
            onChange={(date: any) => {
              const selectedDate = date.toDate();
              setFromDate(selectedDate.toISOString());
              setDatePicker(false);
            }}
            format="YYYY/MM/DD"
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
          />
        </div>
        <div className="m-2">
          تا تاریخ
          <DatePicker
            disabled={datePicker}
            render={<InputIcon style={{ height: 'calc(2.4em + 0.75rem - 6px)', width: '100%' }} />}
            weekDays={weekDays}
            inputClass="form-control"
            onFocusedDateChange={(date: any) => {
              const selectedDate = date.toDate();
              GetTransactionList(fromDate!, selectedDate.toISOString());
            }}
            format="YYYY/MM/DD"
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
          />
        </div>
      </div>

      {loading ? (
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-around' }}>
          <LoadingComponent />
        </div>
      ) : (
        <div className="row">
          <div>
            <Input
              className=""
              type="text"
              placeholder="شماره درخواست ، نام یا نام خانوادگی مشتری"
              onChange={(e) => {
                handleSearch(e.currentTarget.value);
              }}
            />
          </div>
          {transaction &&
            transaction.length > 0 &&
            transaction.map((item: ITransactionResultModel, index: number) => {
              return (
                <>
                  <div className="col-12 col-sm-6 col-lg-4 p-2">
                    <div
                      className="transaction-card"
                      style={{ backgroundColor: `${item.isDebtor ? 'rgb(255 173 181 / 65%)' : 'rgb(125 227 142 / 45%)'}` }}
                    >
                      <p className="d-flex justify-content-center" style={{ color: 'black', marginBottom: '0px' }}>
                        {item.description}
                      </p>
                      <div className="d-flex justify-content-around m-3 p-2 transaction-list">
                        <div>
                          <div>شماره درخواست :</div>
                          <div>تاریخ :</div>
                          <div>مبلغ :</div>
                          <div>وضعیت :</div>
                          <div>مشتری :</div>
                        </div>
                        <div>
                          <div>{item.requestNumber}</div>
                          <div>
                            {DateHelper.isoDateTopersian(item.transactionDateTime)}-
                            {DateHelper.splitTime(item.transactionDateTime)}
                          </div>
                          {item.isDebtor ? (
                            <>
                              <div>{UtilsHelper.threeDigitSeparator(item.debtorAmount)}</div>
                              <div>بدهکار</div>
                            </>
                          ) : (
                            <>
                              <div>{UtilsHelper.threeDigitSeparator(item.creditorAmount)}</div>
                              <div>بستانکار</div>
                            </>
                          )}
                          <div>{item.consumerFirstName + ' ' + item.consumerLastName}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
        </div>
      )}
    </>
  );
};

export default TransactionList;
