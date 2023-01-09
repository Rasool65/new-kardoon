import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { APIURL_GET_GUARANTEE_INFO } from '@src/configs/apiConfig/apiUrls';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { IGuaranteeInfoList, IGuaranteeResultModel } from '@src/models/output/guarantee/IGuaranteeResultModel';
import { useParams } from 'react-router-dom';
import { DateHelper } from '@src/utils/dateHelper';
import ReactToPrint from 'react-to-print';
import LoadingComponent from '@src/components/spinner/LoadingComponent';

const Guarantee: FunctionComponent<IPageProps> = (props) => {
  const httpRequest = useHttpRequest();
  const [loading, setLoading] = useState<boolean>();
  const [guarantee, setGuarantee] = useState<IGuaranteeResultModel>();
  const factorRef = useRef(null);
  const { id } = useParams();

  const GetGuaranteeInfo = () => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<IGuaranteeResultModel>>(`${APIURL_GET_GUARANTEE_INFO}?UserUniqueGuid=${id}`)
      .then((result) => {
        setGuarantee(result.data.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    GetGuaranteeInfo();
  }, []);

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="gold-card">
          {/* <!-- Body className gold-card | silver-card | bronze-card --> */}
          <div ref={factorRef} style={{ direction: 'rtl' }}>
            <div className="warranty-card">
              <div className="tl-footage gold">
                <img src={require('@src/scss/images/TL.png')} alt="" />
              </div>
              <div className="tl-footage silver">
                <img src={require('@src/scss/images/TL-silver.png')} alt="" />
              </div>
              <div className="tl-footage bronze">
                <img src={require('@src/scss/images/TL-bronze.png')} alt="" />
              </div>
              {/* <!-- <div className="br-footage"><img src="./assets/img/BR.png" alt=""></div> --> */}
              <div className="warranty-content">
                <div className="badge gold">
                  <span className="warranty-status" id="gold">
                    GOLD
                  </span>
                  <img src={require('@src/scss/images/badge.png')} alt="" />
                  <span>12</span>
                  <label htmlFor="">Mount</label>
                </div>

                {/* <div className="badge silver">
                <span className="warranty-status" id="gold">
                  SILVER
                </span>
                <img src={require('@src/scss/images/badge-silver.png')} alt="" />
                <span>12</span>
                <label htmlFor="">Mount</label>
              </div> */}

                {/* <div className="badge bronze">
                <span className="warranty-status" id="gold">
                  BRONZE
                </span>
                <img src={require('@src/scss/images/badge-bronze.png')} alt="" />
                <span>12</span>
                <label htmlFor="">Mount</label>
              </div> */}

                <a href="https://kardoon.ir/" className="warranty-logo">
                  <img src={require('@src/scss/images/Kardoon-guarantee-logo.svg')} alt="" />
                </a>
                <div>
                  <div className="warranty-page-title">کارت گارانتی کاردون</div>
                  {/* <img src={require('@src/scss/images/warranty-title.png')} className="warranty-title" alt="" /> */}
                </div>

                <h3 className="title">اطلاعات مشتری</h3>
                <div className="warranty-customer-data">
                  <p id="username">
                    نام و نام خانوادگی : <span> {guarantee?.consumerInfo?.consumerFullName}</span>
                  </p>
                  <p id="personal-id">
                    کد ملی : <span> {guarantee?.consumerInfo?.nationalCode} </span>
                  </p>
                  <p id="phone-number">
                    شماره تماس : <span>{guarantee?.consumerInfo?.contactNumber} </span>
                  </p>
                  <p id="address">
                    آدرس : <span> {guarantee?.consumerInfo?.address}</span>
                  </p>
                </div>
                <h3 className="title">شرایط گارانتی</h3>
                <p style={{ color: 'black', textAlign: 'justify' }}>
                  مشتری گرامی؛ از حسن اعتماد شما به کاردون متشکریم. این ضمانتنامه به مدت دوارده ماه از تاریخ صدور تاریخ مشخص شده
                  معتبر است. موارد ضمانت شده شامل کلیه هزینه های اجرت تشخیص ایراد و برطرف نمودن آن،ایاب و ذهاب(محدوده شهری)،تعویض
                  قطعه فنی بوده و شامل هزینه های مربوط به قطعات و لوازم جانبی نمی باشد در صورت مخدوش شدن هولوگرام الصاقی روی محصول
                  و یا دستکاری توسط افراد غیرمجاز این ضمانتنامه از درجه اعتبار ساقط خواهد شد.
                </p>

                <div className="product-list">
                  <div className="warranty-data">
                    <h3 className="title">اطلاعات محصولات</h3>

                    <table className="warranty-table">
                      <thead>
                        <tr>
                          <th>ردیف</th>
                          <th>نام کالا</th>
                          <th>مدل</th>
                          <th>سریال</th>
                          <th> شماره برچسب</th>
                          <th>تاریخ نگارش</th>
                          <th>تاریخ اعتبار</th>
                          <th>نام کارشناس</th>
                          <th>شماره بیمه</th>
                        </tr>
                      </thead>

                      {guarantee?.guaranteeInfoList &&
                        guarantee.guaranteeInfoList.length > 0 &&
                        guarantee.guaranteeInfoList.map((product: IGuaranteeInfoList, index: number) => {
                          return (
                            <tbody>
                              <tr>
                                <>
                                  <td data-label="ردیف">{index + 1}</td>
                                  <td data-label="نام کالا">{product.productTitle}</td>
                                  <td data-label="مدل">{product.model}</td>
                                  <td data-label="سریال">{product.serialNumber}</td>
                                  <td data-label="شماره برچسب">{product.labelNumber}</td>
                                  <td data-label="تاریخ نگارش">{DateHelper.isoDateTopersian(product.warrantyStartDate)}</td>
                                  <td data-label="تاریخ اعتبار">{DateHelper.isoDateTopersian(product.warrantyEndDate)}</td>
                                  <td data-label="نام کارشناس">{product.technicianFullName}</td>
                                  <td data-label="شماره بیمه">{product.requestNumber}</td>
                                </>
                              </tr>
                            </tbody>
                          );
                        })}
                    </table>
                  </div>

                  <div className="footer">
                    <div>
                      <svg width="20px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                      </svg>{' '}
                      <span>شهران جنوبی، خیابان اردوشاهی ،کوچه رز، کوچه رضوان، پلاک 1، ساختمان مشتریان گلدیران، طبقه پنج</span>
                    </div>

                    <a href="tel:+982147100" style={{ width: '30%' }}>
                      <svg
                        version="1.1"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        viewBox="0 0 53.942 53.942"
                      >
                        <path
                          d="M53.364,40.908c-2.008-3.796-8.981-7.912-9.288-8.092c-0.896-0.51-1.831-0.78-2.706-0.78c-1.301,0-2.366,0.596-3.011,1.68
                                 c-1.02,1.22-2.285,2.646-2.592,2.867c-2.376,1.612-4.236,1.429-6.294-0.629L17.987,24.467c-2.045-2.045-2.233-3.928-0.632-6.291
                                 c0.224-0.309,1.65-1.575,2.87-2.596c0.778-0.463,1.312-1.151,1.546-1.995c0.311-1.123,0.082-2.444-0.652-3.731
                                 c-0.173-0.296-4.291-7.27-8.085-9.277c-0.708-0.375-1.506-0.573-2.306-0.573c-1.318,0-2.558,0.514-3.49,1.445L4.7,3.986
                                 c-4.014,4.013-5.467,8.562-4.321,13.52c0.956,4.132,3.742,8.529,8.282,13.068l14.705,14.705c5.746,5.746,11.224,8.66,16.282,8.66
                                 c0,0,0,0,0.001,0c3.72,0,7.188-1.581,10.305-4.698l2.537-2.537C54.033,45.163,54.383,42.833,53.364,40.908z"
                        />
                        <g></g>
                      </svg>
                      <span>02147100</span>
                    </a>

                    <a href="https://kardoon.ir/" style={{ width: '30%' }}>
                      <svg
                        width="12px"
                        height="12px"
                        viewBox="0 0 12 12"
                        enable-background="new 0 0 12 12"
                        id=""
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g>
                          <path
                            d="M3.7796631,8.75C4.1953125,10.6790771,5.0326538,12,6,12s1.8046875-1.3209229,2.2203369-3.25H3.7796631z"
                            fill="#ffffff"
                          />
                          <path
                            d="M9.2371216,3.25h2.0916748c-0.664978-1.2857056-1.779541-2.2975464-3.1375122-2.8312378   C8.6710815,1.1671753,9.0209351,2.1549683,9.2371216,3.25z"
                            fill="#ffffff"
                          />
                          <path
                            d="M8.3912964,4.25H3.6087036C3.5383911,4.803833,3.5,5.3909912,3.5,6s0.0383911,1.196167,0.1087036,1.75   h4.7825928C8.4616089,7.196167,8.5,6.6090088,8.5,6S8.4616089,4.803833,8.3912964,4.25z"
                            fill="#ffffff"
                          />
                          <path
                            d="M9.5,6c0,0.5882568-0.0372925,1.1765137-0.1055298,1.75h2.3445435C11.9077148,7.196167,12,6.6090088,12,6   s-0.0922852-1.196167-0.2609863-1.75H9.3944702C9.4627075,4.8234863,9.5,5.4117432,9.5,6z"
                            fill="#ffffff"
                          />
                          <path
                            d="M8.2203369,3.25C7.8046875,1.3209229,6.9673462,0,6,0S4.1953125,1.3209229,3.7796631,3.25H8.2203369z"
                            fill="#ffffff"
                          />
                          <path
                            d="M2.7628784,8.75H0.6712036c0.664978,1.2857056,1.779541,2.2975464,3.1375122,2.8312378   C3.3289185,10.8328247,2.9790649,9.8450317,2.7628784,8.75z"
                            fill="#ffffff"
                          />
                          <path
                            d="M2.5,6c0-0.5882568,0.0372925-1.1765137,0.1055298-1.75H0.2609863C0.0922852,4.803833,0,5.3909912,0,6   s0.0922852,1.196167,0.2609863,1.75h2.3445435C2.5372925,7.1765137,2.5,6.5882568,2.5,6z"
                            fill="#ffffff"
                          />
                          <path
                            d="M9.2371216,8.75c-0.2161865,1.0950317-0.56604,2.0828247-1.0458374,2.8312378   C9.5492554,11.0475464,10.6638184,10.0357056,11.3287964,8.75H9.2371216z"
                            fill="#ffffff"
                          />
                          <path
                            d="M2.7628784,3.25c0.2161865-1.0950317,0.56604-2.0828247,1.0458374-2.8312378   C2.4507446,0.9524536,1.3361816,1.9642944,0.6712036,3.25H2.7628784z"
                            fill="#ffffff"
                          />
                        </g>
                      </svg>
                      <span>www.kardoon.ir</span>
                    </a>

                    <a href="mailto:info@kardoon.ir" style={{ width: '30%' }}>
                      <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        viewBox="0 0 330.001 330.001"
                      >
                        <g id="XMLID_348_">
                          <path
                            id="XMLID_350_"
                            d="M173.871,177.097c-2.641,1.936-5.756,2.903-8.87,2.903c-3.116,0-6.23-0.967-8.871-2.903L30,84.602
                                    L0.001,62.603L0,275.001c0.001,8.284,6.716,15,15,15L315.001,290c8.285,0,15-6.716,15-14.999V62.602l-30.001,22L173.871,177.097z"
                          />
                          <polygon id="XMLID_351_" points="165.001,146.4 310.087,40.001 19.911,40 	" />
                        </g>
                      </svg>
                      <span>info@kardoon.ir</span>
                    </a>
                  </div>
                </div>

                <a href="">
                  <img src={require('@src/scss/images/qr-code.png')} className="qr-image" alt="" />
                </a>
              </div>
            </div>
          </div>
          <div className="print-btn-box text-center">
            <ReactToPrint
              // pageStyle={'@page {size: 90mm 200mm;}'}
              trigger={() => <button className="print-btn"> چاپ رسید</button>}
              content={() => factorRef.current}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Guarantee;
