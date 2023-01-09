import { IOutputResult } from '@src/models/output/IOutputResult';
import { IServicesResultModel } from '@src/models/output/services/IServicesResultModel';
import { FunctionComponent, useEffect, useState } from 'react';
import Select from 'react-select';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { APIURL_GET_PRODUCT_TYPES, APIURL_GET_SERVICES, APIURL_GET_TECHNICIAN_CONSUMERS } from '@src/configs/apiConfig/apiUrls';
import { IProductTypeFilterResultModel } from '@src/models/output/products/IProductTypeResultModel';
import { ITechnicianConsumerResultModel } from '@src/models/output/mission/ITechnicianConsumerResultModel';
import { Spinner } from 'reactstrap';
import { IFilterProps } from './IFilterProps';

const Filter: FunctionComponent<IFilterProps> = ({
  showModal,
  handleClick,
  handleStatusChange,
  handleServiceTypeChange,
  handleProductTypeChange,
  handleConsumerChange,
  loading,
  onClickFilter,
  onClickNoFilter,
  emptyList,
}) => {
  const cityId = useSelector((state: RootStateType) => state.authentication.userData?.profile.residenceCityId);
  const TechnicianId = useSelector((state: RootStateType) => state.authentication.userData?.userId);
  const color = useSelector((state: RootStateType) => state.theme.color);
  const httpRequest = useHttpRequest();
  const [services, setServices] = useState<any>();
  const [productTypes, setProductTypes] = useState<any>();
  const [consumers, setConsumers] = useState<any>();

  const GetServices = (cityId: number) => {
    httpRequest.getRequest<IOutputResult<IServicesResultModel>>(`${APIURL_GET_SERVICES}?CityId=${cityId}`).then((result) => {
      setServices(result.data.data);
    });
  };
  const GetProductsType = () => {
    httpRequest.getRequest<IOutputResult<IProductTypeFilterResultModel>>(`${APIURL_GET_PRODUCT_TYPES}`).then((result) => {
      setProductTypes(result.data.data);
    });
  };
  const GetConsumers = (TechnicianId: number) => {
    httpRequest
      .getRequest<IOutputResult<ITechnicianConsumerResultModel>>(
        `${APIURL_GET_TECHNICIAN_CONSUMERS}?TechnicianId=${TechnicianId}`
      )
      .then((result) => {
        setConsumers(result.data.data);
      });
  };
  const statusList = [
    { label: 'تخصیص یافته', value: 1 },
    { label: 'منتظر لغو', value: 2 },
    { label: 'بسته', value: 3 },
    { label: 'ابطال', value: 4 },
    { label: 'در حال بررسی', value: 5 },
  ];

  useEffect(() => {
    GetProductsType();
    GetServices(cityId!);
    GetConsumers(TechnicianId!);
  }, []);
  return (
    <>
      <div className={`filter-ovely ${showModal && 'open'}`} onClick={handleClick}>
        .
      </div>
      <div className={`filter-btn ${showModal && 'open'}`} onClick={handleClick}>
        فیلتر
      </div>
      <div className="filter-btn-edge">.</div>
      <div className={`filter-box ${showModal && 'open'}`}>
        <div className="p-4">
          <div className="filter-title">
            <p>فیلترها</p>
            <img src={require(`@src/scss/images/icons/${color}-close-btn.svg`)} onClick={handleClick} />
          </div>
          <div className="m-1 mb-3 justify-content-evenly">
            <div className="filter-item">وضعیت درخواست</div>

            <Select name="statusType" onChange={handleStatusChange} isMulti options={statusList} placeholder="انتخاب وضعیت" />
          </div>
          <div className="m-1 mb-3 justify-content-evenly">
            <div className="filter-item">نوع خدمت</div>

            <Select name="serviceTypes" onChange={handleServiceTypeChange} isMulti options={services} placeholder="انتخاب خدمت" />
          </div>
          <div className="m-1 mb-3 justify-content-evenly">
            <div className="filter-item">نوع محصول</div>
            <div>
              <Select
                name="productTypes"
                onChange={handleProductTypeChange}
                isMulti
                options={productTypes}
                placeholder="انتخاب محصول"
              />
            </div>
          </div>
          <div className="m-1 mb-3 justify-content-evenly">
            <div className="filter-item">مشتری</div>
            <div>
              <Select
                isClearable
                name="consumer"
                onChange={handleConsumerChange}
                options={consumers}
                placeholder="انتخاب مشتری"
              />
            </div>
          </div>
          <div className="filter-btn-box">
            <button onMouseDown={emptyList} onClick={onClickFilter} className="primary-btn">
              {loading ? <Spinner /> : 'اعمال فیلتر'}
            </button>
            <button onMouseDown={emptyList} onClick={onClickNoFilter} className="primary-btn-outlined">
              {loading ? <Spinner /> : 'حذف فیلتر'}
            </button>
          </div>
        </div>
      </div>

      <div className="filter-ovely">.</div>
      <div className="bottom-sheet">
        <div className="container-16">
          <div className="sort-title">
            <h4>مرتب‌سازی بر اساس</h4>
            <img src={require(`@src/scss/images/icons/${color}-close-btn.svg`)} />
          </div>
          <form>
            <div className="acc-item">
              <label>جدیدترین درخواست</label>
              <input type="radio" name="fav_language" value="HTML" />
            </div>

            <div className="acc-item">
              <label>قدیمی‌ترین درخواست</label>
              <input type="radio" name="fav_language" value="CSS" />
            </div>

            <div className="acc-item">
              <label>جدیدترین تاریخ ویرایش</label>
              <input type="radio" name="fav_language" value="JavaScript" />
            </div>
            <div className="acc-item">
              <label>قدیمی‌ترین تاریخ ویرایش</label>
              <input type="radio" name="fav_language" value="JavaScript" />
            </div>
          </form>
          <div className="container-16">
            <button className="primary-btn"> اعمال مرتب‌سازی</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Filter;
