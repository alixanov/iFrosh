import axios from 'axios';
import { getUrlCoorDinateFromGeoName } from './constants';

export const headers = {
  // Origin: 'https://example.com',
  // Referer: 'https://example.com'
};

export const getCoorDinates = (name) => axios.get(getUrlCoorDinateFromGeoName(name), { headers });
