import React, { useState, useEffect } from 'react';
import { YMaps, Map, Placemark } from 'react-yandex-maps';

const GeocoderMap = ({ address,setValue }) => {
  const placemarkOptions = {
    iconLayout: 'default#image',
    iconImageHref: require('../../assets/images/placemark.png'),
    iconImageSize: [150, 150],
    iconImageOffset: [-75, -75], 
  };
  const [coordinates, setCoordinates] = useState([40.98, 71.58]); 

  useEffect(() => {
    if (address) {
      ymaps.ready(function () {
        ymaps.geocode(address).then(results => {
          const firstGeoObject = results.geoObjects.get(0);
          const coords = firstGeoObject.geometry.getCoordinates();
          setCoordinates(coords);
        });
    });
    
    }
  }, [address]);

  const handleMapChange = (event) => {
    const newCenter = event.get('newCenter');
    // setCoordinates(newCenter);
    ymaps.geocode(newCenter).then(
      function (res) {
          const address = res.geoObjects.get(0).properties.get('text');
          setValue('address',address);
          setValue('latitude',newCenter[0]);
          setValue('longitude',newCenter[1]);
          setCoordinates(newCenter);

      },
      function (err) {
          console.log('Xatolik:', err);
      }
  );
  };
  

  return (
    <YMaps>
      <Map state={{ center: coordinates, zoom: 20 }} width="100%" height="400px" instanceRef={ref => {
                    if (ref) {
                        ref.events.add('boundschange', handleMapChange);
                    }
                }}>
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
