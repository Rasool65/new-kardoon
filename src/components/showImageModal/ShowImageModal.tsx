import { FunctionComponent } from 'react';

interface ShowImageModalProps {
  src?: string;
  description?: string;
  display: boolean;
  handleDisplay: any;
}

const ShowImageModal: FunctionComponent<ShowImageModalProps> = ({ display, src, handleDisplay, description }) => {
  return (
    <>
      <div onClick={handleDisplay} className={`modal pointer ${display && 'd-block'}`}>
        <div className="modal-content">
          <img src={src} alt="" />
          {description && <p className="m-2">{description}</p>}
        </div>
      </div>
    </>
  );
};

export default ShowImageModal;
