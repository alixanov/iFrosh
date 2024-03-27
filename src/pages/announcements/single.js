import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "./style.css";
import * as icons from "../../assets/svgs";
import { Card } from "../../components/card";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Single = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const swiperRef = useRef(null);
  const thumbsRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataSingle, setDataSingle] = useState({
    announcement: {},
    similar: [],
  });
  const [open, setOpen] = useState(false);
  const slideToIndex = useCallback((index) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
    if (thumbsRef.current && thumbsRef.current.swiper) {
      thumbsRef.current.swiper.slideTo(index);
    }
  }, []);
  const handleChange = ({ activeIndex }) => {
    slideToIndex(activeIndex);
    setActiveIndex(activeIndex);
  };

  const icon = {
    1: <icons.Gas />,
    2: <icons.Water />,
    3: <icons.Electric />,
    4: <icons.Wifi />,
    5: <icons.AirCondition />,
    6: <icons.Refrigerator />,
    7: <icons.TvIcon />,
    8: <icons.Washing />,
  };

  const config = useMemo(
    () => ({
      id: searchParams.get("_a_id"),
      edit: searchParams.get("edit"),
      token: Cookies.get("token"),
    }),
    [searchParams]
  );
  useEffect(() => {
    if (config.edit && !config.token) {
      navigate("/auth");
      Cookies.remove("token");
    }
    if (!config.id) navigate(-1);
  }, [config, navigate]);

  useEffect(() => {
    if (!config?.id) return;
    setLoading(true);
    axios
      .get(`https://api.frossh.uz/api/announcement/get-by-id/${config?.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
      .then(({ data }) => {
        setLoading(false);
        setDataSingle(data?.result);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [config?.id, navigate]);

  const sliderData = useMemo(
    () => dataSingle?.announcement?.images,
    [dataSingle?.announcement?.images]
  );
  return (
    <div className="container single announcements">
      {loading ? (
        <icons.LoadingIcon />
      ) : (
        <>
          <h2 className="title">{dataSingle?.announcement?.address}</h2>
          <div className="row single-row">
            <div className="space">
              <div className={`slider ${open ? "open" : ""}`}>
                <button onClick={() => setOpen(false)} className="closer">
                  <icons.Exit />
                </button>
                <Swiper
                  ref={swiperRef}
                  onSlideChange={handleChange}
                  onClick={() => setOpen(!open)}
                  className="top-slider"
                  spaceBetween={35}
                >
                  {sliderData?.map((slide) => (
                    <SwiperSlide key={slide?.id}>
                      <img
                        className="single-img"
                        src={`https://api.frossh.uz/${slide?.path}`}
                        alt="img-slide"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <Swiper
                  ref={thumbsRef}
                  onSlideChange={handleChange}
                  className="thumbs-container"
                  slidesPerView={"auto"}
                  spaceBetween={35}
                >
                  {sliderData?.map((slide, i) => (
                    <SwiperSlide
                      className="slide-item-1"
                      key={slide?.id}
                      onClick={() => handleChange({ activeIndex: i })}
                    >
                      <img
                        className={activeIndex === i ? "active" : undefined}
                        src={`https://api.frossh.uz/${slide?.path}`}
                        alt="img-thumb"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="progressbar">
                  <div
                    className="filled"
                    style={{
                      "--percent": `${
                        (activeIndex + 1) * (100 / sliderData?.length)
                      }%`,
                    }}
                  ></div>
                  <p className="absolute-center">
                    {activeIndex + 1}/{sliderData?.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="between">
              <div className="user-info">
                <div className="avatar">
                  {dataSingle?.announcement?.user?.image ? (
                    <img
                      src={`https://picsum.photos/100/100`}
                      alt="user-avatar"
                      className="single-img-small"
                    />
                  ) : (
                    `${
                      dataSingle?.announcement?.user?.first_name?.charAt(0) ||
                      ""
                    }${
                      dataSingle?.announcement?.user?.last_name?.charAt(0) || ""
                    }`
                  )}
                </div>
                <div className="column">
                  <h3 className="h3">
                    {`${dataSingle?.announcement?.user?.first_name || ""} ${
                      dataSingle?.announcement?.user?.last_name || ""
                    }`}
                  </h3>
                  <span>
                    Sizning hisob raqamingiz:{" "}
                    {dataSingle?.announcement?.user_id}
                  </span>
                  <a
                    href={`tel:${dataSingle?.announcement?.user?.phone_number}`}
                  >
                    {dataSingle?.announcement?.user?.phone_number}
                  </a>
                </div>
              </div>
              <h3 className="h3">Narx</h3>
              <ul className="values">
                <li>
                  <span>{dataSingle?.announcement?.price_m2}</span> UZS/
                  {dataSingle?.announcement?.calculation_method}
                </li>
                <li>
                  <span>{dataSingle?.announcement?.price} </span>UZS
                </li>
              </ul>
              <h3 className="h3">Oldindan to’lov</h3>
              <ul className="values">
                <li>
                  {dataSingle?.announcement?.advance
                    ? dataSingle?.announcement?.advance_month + " oylik"
                    : "Yo’q"}
                </li>
              </ul>
              <ul className="options">
                {dataSingle?.announcement?.room_floor && (
                  <li>
                    <icons.Floor />
                    <span className="h3">
                      {dataSingle?.announcement?.room_floor}-qavat
                    </span>
                  </li>
                )}
                {dataSingle?.announcement?.room_count && (
                  <li>
                    <icons.Room />
                    <span className="h3">
                      {dataSingle?.announcement?.room_count} xona
                    </span>
                  </li>
                )}
                {dataSingle?.announcement?.m2 && (
                  <li>
                    <icons.Quadrad />
                    <span className="h3">
                      {dataSingle?.announcement?.m2} m²
                    </span>
                  </li>
                )}
                {/* {dataSingle?.announcement?.m2 && (
              <li>
                <icons.Home />
                <span className="h3">6 sotix</span>
              </li>
            )} */}
              </ul>
            </div>
          </div>
          <div className="more-infos">
            <ul>
              <li className="caption">Qo’shimcha :</li>
              <li className="comment">
                {dataSingle?.announcement?.description || "Ma’lumot yo’q"}
              </li>
            </ul>
            <ul className="values">
              <li className="caption">Umumiy ma’lumot</li>
              <li>
                <p>Xonalar soni</p>
                <p>{dataSingle?.announcement?.room_count}</p>
              </li>
              <li>
                <p>Umumiy joy</p>
                <p>{dataSingle?.announcement?.m2}m²</p>
              </li>
              <li>
                <p>Narxini kelishiladimi</p>
                <p>{dataSingle?.announcement?.bargain ? "Ha" : "Yo'q"}</p>
              </li>
              {/* <li>
                <p>Tamir</p>
                <p>Evro</p>
              </li>
              <li>
                <p>Dush</p>
                <p>Bor</p>
              </li>
              <li>
                <p>Balkon</p>
                <p>Bor</p>
              </li>
              <li>
                <p>Oynadan korinish</p>
                <p>Hovli</p>
              </li>
              <li>
                <p>Lift</p>
                <p>Bor</p>
              </li> */}
              <li>
                <p>Qurilgan yil</p>
                <p>{dataSingle?.announcement?.construction_year}</p>
              </li>
            </ul>
            <ul className="values">
              <li className="caption">Qo’shimcha qulayliklar</li>
              {dataSingle?.announcement?.amenities?.map((item) => (
                <li key={item?.id}>
                  {icon[item?.id] ? icon[item?.id] : null}
                  <span>{item?.name_uz}</span>
                </li>
              ))}
              {/*<li>
            <icons.Gas />
            <span>Gaz</span>
          </li>
          <li>
            <icons.Water />
            <span>Suv</span>
          </li>
          <li>
            <icons.Electric />
            <span>Elektr energiya</span>
          </li>
          <li>
            <icons.Wifi />
            <span>Internet</span>
          </li>
          <li>
            <icons.AirCondition />
            <span>Konditsioner</span>
          </li>
          <li>
            <icons.Refrigerator />
            <span>Muzlatgich</span>
          </li>
          <li>
            <icons.TvIcon />
            <span>Televizor</span>
          </li>
          <li>
            <icons.Washing />
            <span>Kiryuvish mashinasi</span>
          </li>*/}
            </ul>
          </div>

          <iframe
            className="iframe"
            title="Announcement location"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyD4-Tql8MsjYikxxPerVehVN4lf95zzgHg&center=${dataSingle?.announcement?.latitude},${dataSingle?.announcement?.longitude}&zoom=15`}
          ></iframe>
          {dataSingle?.similar?.length ? (
            <>
              <h3 className="title">O’xshash e’lonlar</h3>
              <div className="row similar">
                {dataSingle?.similar?.map((slide) => (
                  <Card key={slide?.id} item={slide} />
                ))}
              </div>
            </>
          ) : null}
        </>
      )}
    </div>
  );
};

export default Single;
