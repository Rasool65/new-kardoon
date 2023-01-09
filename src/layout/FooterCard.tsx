import { RootStateType } from '@src/redux/Store';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IFooterCardModel } from './FooterCardModel';

const FooterCard: FunctionComponent<IFooterCardModel> = () => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const { t }: any = useTranslation();

  return (
    <>
      <footer className="home-footer">
        <div className="container">
          <div className="row w-100">
            <div className="col-12 col-md-5">
              <img
                src={require(`@src/scss/images/icons/${color}-Kardoon-logo-wite.svg`)}
                alt="Vector3449"
                className="footer-logo"
              />
              <ul className="links">
                <li className="about-us">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه
                  روزنامه و مجله در ستون و سطر آنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز
                </li>
              </ul>
              <div className="social-media">
                <a href="">
                  <img
                    src={require(`@src/scss/images/icons/${color}-vector3449-17wt.svg`)}
                    alt="Vector3449"
                    className="home-vector36"
                  />
                </a>
                <a href="">
                  <img
                    src={require(`@src/scss/images/icons/${color}-vector3449-svkna.svg`)}
                    alt="Vector3449"
                    className="home-vector37"
                  />
                </a>
                <a href="">
                  <img
                    src={require(`@src/scss/images/icons/${color}-akariconsinstagramfill3449-z8k.svg`)}
                    alt="akariconsinstagramfill3449"
                    className="home-akariconsinstagramfill"
                  />
                </a>
              </div>
            </div>

            <div className="col-12 col-md-3 dm-none">
              <div className="footer-tittle">پیوندها</div>
              <ul className="links">
                <li>
                  <a href="">پیوند یک</a>
                </li>
                <li>
                  <a href="">پیوند یک</a>
                </li>
                <li>
                  <a href="">پیوند یک</a>
                </li>
              </ul>
            </div>

            <div className="col-12 col-md-3">
              <div className="footer-tittle">تماس با ما</div>
              <ul className="links">
                <li>
                  <img
                    src={require(`@src/scss/images/icons/${color}-vector3449-5lc3.svg`)}
                    alt="Vector3449"
                    className="home-vector33"
                  />
                  <a href="https://goo.gl/maps/ttNeos4hBXxwjyZo9">
                    شهران جنوبی، خیابان اردوشاهی، کوچه رز، کوچه رضوان، پلاک 1، ساختمان مشتریان گلدیران، طبقه پنجم
                  </a>
                </li>
                <li>
                  <img src={require(`@src/scss/images/icons/${color}-phone-icon.svg`)} alt="VectorI344" />
                  <a href="tel:+982147100">02147100</a>
                </li>
                <li>
                  <img src={require(`@src/scss/images/icons/${color}-vector3449-mhhl.svg`)} alt="Vector3449" />
                  <a href="mailto:Info@kardoon.ir">Info@kardoon.ir</a>
                </li>
                <li>
                  <img src={require(`@src/scss/images/icons/${color}-vectordefaulti344-arh.svg`)} alt="VectorDefaultI344" />
                  <a>ارسال پیامک (300047100)</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="copy-right-bar">
          <div className="copy-right">
            <p>2022-1400</p>
            <img
              src={require(`@src/scss/images/icons/${color}-vector3449-jm4k.svg`)}
              alt="Vector3449"
              className="home-vector38"
            />
          </div>

          <div>
            <p className="all-right">تمامی حقوق برای کاردون محفوظ می باشد.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterCard;
