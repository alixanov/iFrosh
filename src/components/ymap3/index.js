import React, { useState, useEffect } from "react";
import { YMaps, Map, Placemark } from "react-yandex-maps";

const GeocoderMap = ({ address, setValue }) => {
  const placemarkOptions = {
    iconLayout: "default#image",
    iconImageHref: require("../../assets/images/placemark.png"),
    iconImageSize: [150, 150],
    iconImageOffset: [-75, -75],
  };
  const [coordinates, setCoordinates] = useState([
    40.981272082081325, 71.60873464660148,
  ]);

  useEffect(() => {
    if (address) {
      if (!window.ymaps) return;
      window.ymaps.ready(function () {
        window.ymaps.geocode(address).then((results) => {
          const firstGeoObject = results.geoObjects.get(0);
          const coords = firstGeoObject.geometry.getCoordinates();
          setCoordinates(coords);
        });
      });
    }
  }, [address]);

  const handleMapChange = (event) => {
    const newCenter = event.get("newCenter");
    setCoordinates(newCenter);
    if (!window.ymaps) return;
    window.ymaps.geocode(newCenter).then(
      function (res) {
        const address = res.geoObjects.get(0).properties.get("text");
        setValue("address", address);
        setValue("latitude", newCenter[0]);
        setValue("longitude", newCenter[1]);
      },
      function (err) {
        console.log("Xatolik:", err.message);
      }
    );
  };

  return (
    <YMaps>
      <Map
        state={{ center: coordinates, zoom: 20 }}
        width="100%"
        height="400px"
        instanceRef={(ref) => {
          if (ref) {
            ref.events.add("boundschange", handleMapChange);
          }
        }}
      >
        <Placemark
          geometry={coordinates}
          options={placemarkOptions}
          properties={{
            hintContent: "Bu yerda hint",
            balloonContent: "Bu yerda balon matni",
          }}
        />
      </Map>
    </YMaps>
  );
};

export default GeocoderMap;
