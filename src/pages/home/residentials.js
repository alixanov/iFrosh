import React, { useCallback, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Arrow } from 'assets/svgs';
import { useTranslation } from 'react-i18next';

const Residentials = () => {
  const { t } = useTranslation()
  const sliderRef = useRef();
  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  return (
    <section className="container residentials">
      <h2 className="title">{t('slider_title')}</h2>
      <div className="slide-container">
        <div className="navigations">
          <button className="prev" onClick={handlePrev}>
            <Arrow />
          </button>
          <button className="next" onClick={handleNext}>
            <Arrow />
          </button>
        </div>
        <Swiper ref={sliderRef} autoplay={{ delay: 2500 }} loop navigation={true} modules={[Autoplay, Pagination, Navigation]}>
          <SwiperSlide className="slide-item">
            <img src={require('../../assets/images/residents-slide.png')} alt="residents" />
          </SwiperSlide>
          <SwiperSlide className="slide-item">
            <img src={require('../../assets/images/residents-slide.png')} alt="residents" />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default Residentials;
