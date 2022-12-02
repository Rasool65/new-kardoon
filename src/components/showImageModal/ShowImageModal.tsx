import { FunctionComponent } from 'react';

interface ShowImageModalProps {
  src?: string;
  display: boolean;
  handleDisplay: any;
}

const ShowImageModal: FunctionComponent<ShowImageModalProps> = ({ display, src, handleDisplay }) => {
  return (
    <>
      <div onClick={handleDisplay} className={`modal pointer ${display && 'd-block'}`}>
        <div className="modal-content">
          <img src={src} alt="" />
        </div>
      </div>
    </>
  );
};

export default ShowImageModal;
