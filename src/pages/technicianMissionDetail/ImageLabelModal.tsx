import { FunctionComponent, useState, useEffect } from 'react';
import { Button, Input } from 'reactstrap';

interface ImageLabelModalProps {
  labelModalVisible: boolean;
  closeModal: any;
  submit: any;
}

const ImageLabelModal: FunctionComponent<ImageLabelModalProps> = ({ labelModalVisible, closeModal, submit }) => {
  const [imgSrcList, setImgSrcList] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<any[]>([]);
  const [imageLabel, setImageLabel] = useState<string>('');

  const handleImageLabel = (e: string) => {
    setImageLabel(e);
  };

  const imageSelect = (e: any) => {
    const files = e.target.files;
    // const newFile: any = await addTextToImage(files[0], 'Rasool Aghajani');
    files.length > 1 ? setImageFile(files) : setImageFile([...imageFile, files[0]]);
    const reader = new FileReader();
    reader.onload = function () {
      setImgSrcList([...imgSrcList, reader.result]);
    };
    reader?.readAsDataURL(files[0]);
  };
  useEffect(() => {
    setImageLabel(''), setImageFile([]), setImgSrcList([]);
  }, [labelModalVisible]);
  return (
    <>
      <div className={`modal ${labelModalVisible ? 'd-block' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2
              className="header pointer"
              onClick={() => {
                closeModal();
              }}
            >
              X
            </h2>
            <h1 className="header">نام تصویر</h1>
          </div>
          <div className="d-flex justify-content-between">
            <p className="">توضیحاتی برای تصویر مورد نظر مشخص نمایید</p>
          </div>
          <div className="row m-2">
            <span className="upload-icons">
              {imgSrcList.length > 0 && <div className="image-preview" style={{ backgroundImage: `url(${imgSrcList[0]})` }} />}
              <Input onChange={(e) => imageSelect(e)} style={{ display: 'none' }} id="img" type="file" accept="image/*" />
            </span>
            <Input
              onChange={(e) => handleImageLabel(e.currentTarget.value)}
              type="text"
              placeholder="توضیحات تصویر را وارد نمایید"
              defaultValue={''}
              value={imageLabel}
            />
            <Button onClick={(e) => submit([imageFile[0], imageLabel])}>ثبت تصویر</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageLabelModal;
