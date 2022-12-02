import { RootStateType } from '@src/redux/Store';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

interface WhyKardoonProps {}

const WhyKardoon: FunctionComponent<WhyKardoonProps> = () => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  return (
    <>
      <section className="why-kardoon">
        <div className="container">
          <div className="why-kardoon-box">
            <h4 className="srvice-title">چرا کاردون را انتخاب کنم؟</h4>
            <div className="why-kardoon-items">
              <div className="why-kardoon-item">
                <div className="icon-box">
                  <img
                    src={require(`@src/scss/images/icons/${color}-vector3449-ka5.svg`)}
                    alt="Vector3449"
                    className="why-icon"
                  />
                </div>
                <p>پشتیبانی موثر</p>
              </div>

              <div className="why-kardoon-item border-x">
                <div className="icon-box">
                  <img
                    src={require(`@src/scss/images/icons/${color}-vector3449-0x3e.svg`)}
                    alt="Vector3449"
                    className="home-vector52"
                  />
                </div>
                <p>نیروهای متخصص</p>
              </div>

              <div className="why-kardoon-item">
                <div className="icon-box">
                  <img
                    src={require(`@src/scss/images/icons/${color}-vector3449-uo2i.svg`)}
                    alt="Vector3449"
                    className="home-vector51"
                  />
                </div>
                <p>تضمین کیفیت</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyKardoon;
