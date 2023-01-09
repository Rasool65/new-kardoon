import { yupResolver } from '@hookform/resolvers/yup';
import {
  APIURL_GET_CATEGORIES,
  APIURL_GET_DEVICE_TYPE_WITH_PARENT_INFO,
  APIURL_GET_SERVICES,
  APIURL_POST_REQUEST_TECHNICIAN,
} from '@src/configs/apiConfig/apiUrls';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { useToast } from '@src/hooks/useToast';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { IProductsResultModel } from '@src/models/output/products/IProductsResultModel';
import { IServicesResultModel } from '@src/models/output/services/IServicesResultModel';
import { RootStateType } from '@src/redux/Store';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, FormFeedback, Input } from 'reactstrap';
import Select from 'react-select';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import {
  AddTechnicianSubRequestModelSchema,
  ITechnicianSubRequestModel,
} from '@src/models/input/technicianRequest/ITechnicianSubRequestModel';

interface SubRequestProps {}

const SubRequest: FunctionComponent<SubRequestProps> = () => {
  let newCategory: any[];
  let newProducts: any[];
  const toast = useToast();
  // const { t }: any = useTranslation();
  const { state }: any = useLocation();
  const httpRequest = useHttpRequest();

  const [loading, setLoading] = useState<boolean>(false);
  const [services, setServices] = useState<any>();
  const [categories, setCategories] = useState<any>();
  const [products, setProducts] = useState<any>();
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<number>();
  const userData = useSelector((state: RootStateType) => state.authentication.userData);

  const GetServices = () => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<IServicesResultModel>>(`${APIURL_GET_SERVICES}?CityId=${userData?.profile.residenceCityId}`)
      .then((result) => {
        setServices(result.data.data);
        setLoading(false);
      });
  };
  const GetCategoryList = (serviceTypeId: number) => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<any>>(
        `${APIURL_GET_CATEGORIES}?CityId=${userData?.profile.residenceCityId}&ServiceTypeId=${serviceTypeId}`
      )
      .then((result) => {
        if (result.data.data) {
          newCategory = [];
          for (var i = 0; i < result.data.data.length; i++) {
            newCategory.push({ value: result.data.data[i].id, label: result.data.data[i].name });
          }
        }
        setCategories(newCategory);
        setLoading(false);
      });
  };
  const GetProducts = (productCategoryId: number, serviceTypeId: number) => {
    setLoading(true),
      httpRequest
        .getRequest<IOutputResult<IProductsResultModel[]>>(
          `${APIURL_GET_DEVICE_TYPE_WITH_PARENT_INFO}?CityId=${userData?.profile.residenceCityId}&ProductCategoryId=${productCategoryId}&ServiceTypeId=${serviceTypeId}`
        )
        .then((result) => {
          if (result.data.data) {
            newProducts = [];
            for (var i = 0; i < result.data.data.length; i++) {
              newProducts.push({ value: result.data.data[i].id, label: result.data.data[i].title });
            }
          }

          setProducts(newProducts);
          setLoading(false);
        });
  };

  const {
    register,
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ITechnicianSubRequestModel>({ mode: 'onChange', resolver: yupResolver(AddTechnicianSubRequestModelSchema) });

  const resetForm = () => {
    reset({
      productGroup: { label: '', value: 0 },
      serviceTypeId: { label: '', value: 0 },
      productCategoryId: { label: '', value: 0 },
      requestDescription: '',
    });
  };
  const onSubmit = (data: ITechnicianSubRequestModel) => {
    setLoading(true);
    const body = {
      requestNumber: state.requestNumber,
      technicianId: Number(userData?.userId),
      serviceTypeId: data.serviceTypeId.value,
      productCategoryId: data.productCategoryId.value,
      requestDescription: data.requestDescription,
    };

    !loading &&
      httpRequest
        .postRequest<IOutputResult<any>>(`${APIURL_POST_REQUEST_TECHNICIAN}`, body)
        .then((result) => {
          result.data.isSuccess ? (toast.showSuccess(result.data.message), resetForm()) : toast.showError(result.data.message);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
  };

  useEffect(() => {
    GetServices();
  }, []);

  return (
    <>
      <div className="mission-details">
        <div className="container">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="card mt-4">
              <div className="section-1">
                <div className="details-bar">
                  <p className="m-1">شماره درخواست :</p>
                  <p className="m-1 p-2">{state.requestNumber}</p>
                </div>

                <div className="details-bar">
                  <p className="m-1">نام مشتری :</p>
                  <p className="m-1">{state.consumerFullName}</p>
                </div>

                <div className="details-bar">
                  <p className="m-1">آدرس:</p>
                  <p className="m-1">{state.consumerAddress}</p>
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-md-4">
                  <Controller
                    name="serviceTypeId"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select
                          isClearable
                          isLoading={loading}
                          options={services}
                          className=""
                          placeholder={'نوع خدمت'}
                          {...field}
                          onChange={(e: any) => {
                            setValue('productCategoryId', { value: 0, label: '' });
                            setValue('productGroup', { value: undefined, label: '' });
                            field.onChange(e);
                            setCategories(null);
                            e.value && GetCategoryList(e?.value), setCategoryId(e?.value);
                          }}
                        />
                        <FormFeedback className="d-block">{errors?.serviceTypeId?.value?.message}</FormFeedback>
                      </>
                    )}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <Controller
                    name="productGroup"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select
                          isClearable
                          isLoading={loading}
                          options={categories}
                          className=""
                          placeholder={'گروه محصول'}
                          {...field}
                          onChange={(e: any) => {
                            setValue('productCategoryId', { value: 0, label: '' });
                            field.onChange(e);
                            GetProducts(e.value, categoryId!);
                          }}
                        />
                        <FormFeedback className="d-block">{errors?.productCategoryId?.value?.message}</FormFeedback>
                      </>
                    )}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <Controller
                    name="productCategoryId"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select
                          isClearable
                          isLoading={loading}
                          options={products}
                          className=""
                          placeholder={'نوع محصول'}
                          {...field}
                          onChange={(e: any) => {
                            field.onChange(e);
                          }}
                        />
                        <FormFeedback className="d-block">{errors?.productCategoryId?.value?.message}</FormFeedback>
                      </>
                    )}
                  />
                </div>

                <div className="col-12">
                  <Controller
                    name="requestDescription"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Input
                          type="textarea"
                          placeholder={'توضیحات درخواست'}
                          autoComplete="off"
                          invalid={errors?.requestDescription && true}
                          {...field}
                        />
                        <FormFeedback>{errors?.requestDescription?.message}</FormFeedback>
                      </>
                    )}
                  />
                </div>
                {/* formGenerator here*/}
              </div>

              <Button type="submit" className="btn-info btn green-btn w-100 mt-4">
                {loading ? <LoadingComponent /> : 'ثبت ریز درخواست'}
              </Button>
            </div>
          </Form>
        </div>
      </div>

      {/* <ConfirmModal
        confirmModalVisible={confirmModalVisible}
        accept={() => {
          setConfirmModalVisible(false), handleSubmit(onSubmit);
        }}
        reject={() => {
          setConfirmModalVisible(false);
        }}
      /> */}
    </>
  );
};

export default SubRequest;
