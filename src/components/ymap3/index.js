import React, { useState, useEffect } from 'react';
import { YMaps, Map, Placemark } from 'react-yandex-maps';

const GeocoderMap = ({ address }) => {
  const placemarkOptions = {
    iconLayout: 'default#image',
    iconImageHref: require('../../assets/images/placemark.png'), // Iconingizning manzili
    iconImageSize: [150, 150], // Iconning o'lchamlari
    iconImageOffset: [-75, -75], // Iconning joylashuvini sozlash
  };
  const [coordinates, setCoordinates] = useState([40.98, 71.58]); // Moskva koordinatalari

  useEffect(() => {
    if (address) {
      ymaps.geocode(address).then(results => {
        const firstGeoObject = results.geoObjects.get(0);
        const coords = firstGeoObject.geometry.getCoordinates();
        setCoordinates(coords);
      });
    }
  }, [address]);

  return (
    <YMaps>
      <Map state={{ center: coordinates, zoom: 15 }} width="100%" height="400px">
        <Placemark geometry={coordinates}  options={placemarkOptions} 
          properties={{
            hintContent: 'Bu yerda hint',
            balloonContent: 'Bu yerda balon matni',
          }} />
      </Map>
    </YMaps>
  );
};

export default GeocoderMap;
