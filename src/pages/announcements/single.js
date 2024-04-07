import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "./style.css";
import * as icons from "../../assets/svgs";
import { Card } from "../../components/card";
import axios from "axios";
// import Cookies from "js-cookie";
// import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Map, Placemark, YMaps } from "react-yandex-maps";
import { useStoreState } from "../../redux/selectors";

const Single = () => {
  const user = useStoreState("user");
  const {
    t,
    i18n: { language: lang },
  } = useTranslation();
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
    }),
    [searchParams]
  );

  useEffect(() => {
    if (!config?.id) return;
    setLoading(true);
    axios
      .get(`https://api.frossh.uz/api/announcement/get-by-id/${config?.id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
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
  }, [config?.id, user?.token, navigate]);

  const sliderData = useMemo(
    () => dataSingle?.announcement?.images,
    [dataSingle?.announcement?.images]
  );
  const placemarkOptions = {
    iconLayout: "default#image",
    iconImageHref: require("../../assets/images/placemark.png"),
    iconImageSize: [80, 80],
    iconImageOffset: [-40, -40],
    title: dataSingle?.announcement?.address,
  };
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
                  spaceBetween={window.innerWidth < 768 ? 10 : 35}
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
                  <a
                    href={`tel:+${dataSingle?.announcement?.user?.phone_number}`}
                  >
                    +{dataSingle?.announcement?.user?.phone_number}
                  </a>
                </div>
              </div>
              <h3 className="h3">{t("narx")}</h3>
              <ul className="values">
                <li>
                  <span>
                    {
                      dataSingle?.announcement?.[
                        `price_per_meter_${
                          user?.currency?.code?.toLowerCase() || "uzs"
                        }_formatted`
                      ]
                    }{" "}
                    {(user?.currency?.code?.toUpperCase() || "UZS") === "UZS"
                      ? "UZS"
                      : "y.e"}
                    /m²
                  </span>
                </li>
                <li>
                  <span>
                    {
                      dataSingle?.announcement?.[
                        `price_${
                          user?.currency?.code?.toLowerCase() || "uzs"
                        }_formatted`
                      ]
                    }{" "}
                    {(user?.currency?.code?.toUpperCase() || "UZS") === "UZS"
                      ? "UZS"
                      : "y.e"}
                  </span>
                </li>
              </ul>
              <h3 className="h3">{t("oldindantolov")}</h3>
              <ul className="values">
                <li>
                  {dataSingle?.announcement?.advance &&
                  dataSingle?.announcement?.advance_month
                    ? `${dataSingle?.announcement?.advance_month} oylik`
                    : t("yoq")}
                </li>
              </ul>
              <ul className="options">
                {dataSingle?.announcement?.room_floor && (
                  <li>
                    <icons.Floor />
                    <span className="h3">
                      {dataSingle?.announcement?.room_floor}-{t("qavat")}
                    </span>
                  </li>
                )}
                {dataSingle?.announcement?.room_count && (
                  <li>
                    <icons.Room />
                    <span className="h3">
                      {dataSingle?.announcement?.room_count}-{t("xona")}
                    </span>
                  </li>
                )}
                {dataSingle?.announcement?.space_size && (
                  <li>
                    <icons.Quadrad />
                    <span className="h3">
                      {dataSingle?.announcement?.space_size} m²
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="more-infos">
            <ul>
              <li className="caption">{t("extra")} :</li>
              <li className="comment">
                {dataSingle?.announcement?.description || "Ma’lumot yo’q"}
              </li>
            </ul>
            <ul className="values">
              <li className="caption"> {t("umumiy")} </li>
              <li>
                <p>{t("xonalar")}</p>
                <p>{dataSingle?.announcement?.room_count}</p>
              </li>
              <li>
                <p> {t("joy")} </p>
                <p>{dataSingle?.announcement?.space_size}m²</p>
              </li>
              <li>
                <p> {t("kelishish")} </p>
                <p>{dataSingle?.announcement?.bargain ? t("ha") : t("yoq")}</p>
              </li>

              <li>
                <p> {t("qurulganyil")} </p>
                <p>{dataSingle?.announcement?.construction_year}</p>
              </li>
            </ul>
            <ul className="values">
              <li className="caption"> {t("qoshimcha")} </li>
              {dataSingle?.announcement?.amenities?.map((item) => (
                <li key={item?.id}>
                  {icon[item?.id] ? icon[item?.id] : null}
                  <span>{item?.[`name_${lang}`]}</span>
                </li>
              ))}
            </ul>
          </div>
          <YMaps>
            <Map
              className="iframe"
              defaultState={{
                center: [
                  dataSingle?.announcement?.latitude,
                  dataSingle?.announcement?.longitude,
                ],
                zoom: 18,
              }}
              width="100%"
              height="400px"
            >
              <Placemark
                geometry={[
                  dataSingle?.announcement?.latitude,
                  dataSingle?.announcement?.longitude,
                ]}
                options={placemarkOptions}
                properties={{
                  hintContent: "Bu yerda hint",
                  balloonContent: "Bu yerda balon matni",
                }}
              />
            </Map>
          </YMaps>

          {dataSingle?.similar?.length ? (
            <>
              <h3 className="title"> {t("elonlar")} </h3>
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
