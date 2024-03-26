/* eslint-disable react/prop-types */
import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import axios from 'axios';
import { headers } from 'utils/location';

const mapStyles = {
  height: '50vh',
  width: '100%',
  borderRadius: 16
};

const MapContainer = ({ setValue, location, onSelect, setLoading }) => {
  // Function to get location name from latitude and longitude
  function getLocationName(latitude, longitude) {
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=03c48dae07364cabb7f121d8c1519492&no_annotations=1&language=uz`;
    setLoading(true);
    axios
      .get(apiUrl, { headers })
      .then(({ data }) => {
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        setLoading(false);
        if (data.status.message === 'OK') {
          console.log('Location Name:', data?.results?.[0]?.formatted);
          setValue('address', String(data?.results?.[0]?.formatted?.replace('unnamed road,', '')));
          onSelect && onSelect(data);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error fetching data:', error);
      });
  }

  return (
    <LoadScript googleMapsApiKey="AIzaSyD4-Tql8MsjYikxxPerVehVN4lf95zzgHg">
      <GoogleMap
        onClick={({ latLng }) => {
          getLocationName(latLng?.lat(), latLng?.lng());
        }}
        mapContainerStyle={mapStyles}
        zoom={13}
        center={location}
      />
    </LoadScript>
  );
};

export default MapContainer;

export const MapComponent = ({ latitude, longitude, ...props }) => {
  const [iframeSrc, setIframeSrc] = React.useState('');

  React.useEffect(() => {
    setIframeSrc(
      `https://www.google.com/maps/embed/v1/view?key=AIzaSyD4-Tql8MsjYikxxPerVehVN4lf95zzgHg&center=${latitude},${longitude}&zoom=15`
    );
  }, [latitude, longitude]);

  return (
    iframeSrc &&
    latitude &&
    longitude && <iframe title="Google Map" style={{ border: 0, ...mapStyles }} {...props} src={iframeSrc} allowFullScreen />
  );
};
