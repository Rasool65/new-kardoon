import { FunctionComponent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IPageProps from '../../configs/routerConfig/IPageProps';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { APIURL_GET_HIERARCHICAL_DEVICE_TYPE } from '@src/configs/apiConfig/apiUrls';
import { useTranslation } from 'react-i18next';
import { IProductsResultModel } from './../../models/output/products/IProductsResultModel';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { URL_MAIN, URL_PROVINCE, URL_REQUEST_DETAIL } from '@src/configs/urls';
import { AccordionBody, AccordionHeader, UncontrolledAccordion } from 'reactstrap';
import PrevHeader from '@src/layout/Headers/PrevHeader';
import Footer from '@src/layout/Footer';
import LoadingComponent from '@src/components/spinner/LoadingComponent';

const Products: FunctionComponent<IPageProps> = (props) => {
  const navigate = useNavigate();
  const auth = useSelector((state: RootStateType) => state.authentication.isAuthenticate);
  const cityId = auth
    ? useSelector((state: RootStateType) => state.authentication.userData?.profile.residenceCityId)
    : localStorage.getItem('city')
    ? JSON.parse(localStorage.getItem('city')!).value
    : navigate(URL_PROVINCE);
  const [products, setProducts] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const httpRequest = useHttpRequest();
  const { t }: any = useTranslation();
  const { state }: any = useLocation();

  const GetProducts = () => {
    !!state
      ? (setLoading(true),
        httpRequest
          .getRequest<IOutputResult<IProductsResultModel[]>>(
            `${APIURL_GET_HIERARCHICAL_DEVICE_TYPE}?CityId=${cityId}&ProductCategoryId=${state.ProductCategoryId}&ServiceTypeId=${state.ServiceTypeId}`
          )
          .then((result) => {
            setProducts(result.data.data);
            setLoading(false);
          }))
      : navigate(URL_MAIN);
  };

  useEffect(() => {
    GetProducts();
  }, []);

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  const RecursiveComponent = ({ recProduct }: { recProduct: IProductsResultModel }) => {
    const hasSubProducts = recProduct.subProducts?.length! > 0;
    return (
      <>
        {hasSubProducts ? (
          <UncontrolledAccordion stayOpen>
            <AccordionHeader targetId={`${recProduct.id}`}>
              <img src={recProduct.logoUrl} /> {recProduct.name}
            </AccordionHeader>
            <AccordionBody accordionId={`${recProduct.id}`}>
              <div className="pt-3 pb-3">
                <p className="mb-0">
                  {hasSubProducts &&
                    recProduct.subProducts?.map((item: IProductsResultModel, index: number) => (
                      <RecursiveComponent recProduct={item} />
                    ))}
                </p>
              </div>
            </AccordionBody>
          </UncontrolledAccordion>
        ) : (
          <button
            className="is-child" //style button child
            onClick={() => {
              navigate(URL_REQUEST_DETAIL, {
                state: {
                  ProductId: recProduct.id,
                  ServiceTypeId: state.ServiceTypeId,
                },
              });
            }}
          >
            <img src={recProduct.logoUrl} style={{ maxWidth: '25px' }} /> {recProduct.name}
          </button>
        )}
      </>
    );
  };

  return (
    <>
      <PrevHeader />
      <Footer />
      <div>
        <div className="page-content select-product-page">
          <div className="container">
            <h4 className="mt-4">{t('PleaseSelectProduct')}</h4>
            <div className="card mt-4">
              <div className="content">
                {/* <h4>{t('SelectProduct')}</h4>
                <p>{t('PleaseSelectProduct')}</p> */}
              </div>
              {loading ? (
                <LoadingComponent />
              ) : (
                <div className=" mt-4">
                  {!!products &&
                    products.length > 0 &&
                    products.map((items: IProductsResultModel, index: number) => {
                      return (
                        <>
                          <RecursiveComponent recProduct={items} />
                        </>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
