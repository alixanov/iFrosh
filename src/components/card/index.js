import React, { useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Eye, Pen, Reload } from "../../assets/svgs";
import { useStoreState } from "../../redux/selectors";
import { useTranslation } from "react-i18next";

export const Card = ({ item, editable = false }) => {
  const user = useStoreState("user");
  const swiperRef = useRef(null);
  const { t } = useTranslation();
  const slideToIndex = useCallback((index) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  }, []);

  const navigation = (_, index) => (
    <button onMouseEnter={() => slideToIndex(index)} key={index}>
      {index}
    </button>
  );

  const overlay = (
    <div className="overlay pending-status">
      <Reload />
      <p> {t("tekshirilmoqda")} </p>
    </div>
  );

  return (
    <div className="card">
      <header className="card-top">
        {item?.is_top ? (
          <Link
            to={`/announcement/${item?.slug}?_a_id=${item?.id}`}
            className="badge"
          >
            <p>TOP</p>
          </Link>
        ) : null}
        <Link to={`/announcement/${item?.slug}?_a_id=${item?.id}`}>
          <div className="overlay">{item?.images?.map(navigation)}</div>
          <Swiper
            ref={swiperRef}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            loop
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
          >
            {item?.images?.map((slide) => (
              <SwiperSlide key={slide?.id}>
                <img
                  src={`https://api.frossh.uz/${slide?.path}`}
                  alt="slide-item"
                />
              </SwiperSlide>
            ))}
            <div className="bottom-infos">
              <div className="views">
                <Eye />
                <p>{item?.views_count}</p>
              </div>
            </div>
          </Swiper>
        </Link>
      </header>
      <Link
        to={`/announcement/${item?.slug}?_a_id=${item?.id}`}
        className="card-body"
      >
        <p className="pice">
          {
            item[
              `price_${user?.currency?.code?.toLowerCase() || "uzs"}_formatted`
            ]
          }{" "}
          {(user?.currency?.code?.toUpperCase() || "UZS") === "UZS"
            ? "UZS"
            : "y.e"}
        </p>
        <div className="row-info">
          <p>
            {item?.room_count}-{t("xona")}{" "}
          </p>
          {item?.room_floor && (
            <p>
              {item?.room_floor}-{t("qavat")}{" "}
            </p>
          )}
          <p>{item?.space_size}m²</p>
        </div>
        <p className="address">{item?.address}</p>
      </Link>

      {/* status pending overlay */}
      {!item.is_active
        ? overlay
        : editable && (
            <Link
              to={`/announcement/${item?.id}?edit=${item?.slug}&_a_id=${item?.id}`}
              className="edit-btn"
            >
              <Pen />
            </Link>
          )}
    </div>
  );
};
