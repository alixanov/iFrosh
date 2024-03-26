import React, { useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Eye, Pen, Reload } from 'assets/svgs';


// eslint-disable-next-line react/prop-types
export const Card = ({ item, editable = false }) => {
  const swiperRef = useRef(null);
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
      <p>Tekshirilmoqda...</p>
    </div>
  );

  return (
    <div className="card">
      <header className="card-top">
        <Link to={'/top-announcements'} className="badge">
          <p>TOP</p>
        </Link>
        <Link to={`/announcement/${item}`}>
          <div className="overlay">{[1, 2, 3, 4, 5, 6].map(navigation)}</div>
          <Swiper
            ref={swiperRef}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            loop
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
          >
            {[1, 2, 3, 4, 5, 6].map((slide) => (
              <SwiperSlide key={slide}>
                <img src={'https://picsum.photos/300/' + (200 + slide + item)} alt="slide-item" />
              </SwiperSlide>
            ))}
            <div className="bottom-infos">
              <div className="views">
                <Eye />
                <p>12</p>
              </div>
            </div>
          </Swiper>
        </Link>
      </header>
      <Link to={`/announcement/${item}`} className="card-body">
        <p className="pice">40.000.000 uzs</p>
        <div className="row-info">
          <p>3 xona</p>
          <p>3-qavat</p>
          <p>120 m²</p>
        </div>
        <p className="address">Namangan viloyat, Chust shaxri, mustaqillik mahalla 123 uy.</p>
      </Link>

      {/* status pending overlay */}
      {item === 5
        ? overlay
        : editable && (
            <Link to={`/announcement?edit=${item}`} className="edit-btn">
              <Pen />
            </Link>
          )}
    </div>
  );
};
