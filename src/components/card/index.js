import React, { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Close, Eye, Pen, Reload, Star } from "../../assets/svgs";
import { useStoreState } from "../../redux/selectors";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";

export const Card = ({ item, editable = false }) => {
  const user = useStoreState("user");
  const swiperRef = useRef(null);
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(item?.is_favorite);
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
        {isFavorite ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className={`favorite-icon`}
            onClick={() => {
              axios
                .get(
                  `https://api.frossh.uz/api/announcement/favorite/${item?.id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${user?.token}`,
                    },
                  }
                )
                .then((_) => {
                  toast.success(
                    t(
                      isFavorite
                        ? "announcement_unfavorite"
                        : "announcement_favorite"
                    )
                  );
                  setIsFavorite(!isFavorite);
                })
                .catch((err) => {
                  console.log(err);
                  toast.error(t("announcement_favorite_error"));
                });
            }}
          >
            <path d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"></path>
          </svg>
        ) : (
          <Star
            className={`favorite-icon`}
            onClick={() => {
              axios
                .get(
                  `https://api.frossh.uz/api/announcement/favorite/${item?.id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${user?.token}`,
                    },
                  }
                )
                .then((_) => {
                  toast.success(
                    t(
                      isFavorite
                        ? "announcement_unfavorite"
                        : "announcement_favorite"
                    )
                  );
                  setIsFavorite(!isFavorite);
                })
                .catch((err) => {
                  console.log(err);
                  toast.error(t("announcement_favorite_error"));
                });
            }}
          />
        )}
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
            pagination={{ clickable: true, dynamicBullets: true }}
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
          {item?.room_floor ? (
            <p>
              {item?.room_floor}-{t("qavat")}{" "}
            </p>
          ) : null}
          <p>{item?.space_size}m²</p>
        </div>
        <p className="address">{item?.address}</p>
      </Link>

      {/* status pending overlay */}
      {!item?.is_active ? (
        overlay
      ) : item?.is_rejected ? (
        <div className="overlay pending-status">
          <Close />
          <p
            style={{
              padding: "0 10px",
              color: "red",
              backgroundColor: "white",
              borderRadius: "5px",
              marginTop: "10px",
            }}
          >
            {item?.rejection_reason}
          </p>
        </div>
      ) : editable ? (
        <Link to={`/announcement/${item?.id}/edit`} className="edit-btn">
          <Pen />
        </Link>
      ) : null}
    </div>
  );
};
