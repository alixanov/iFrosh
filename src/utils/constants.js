export const themeColors = {
  palette: {
    primary: '#73AF00',
    secondary: '#5D6661',
    black: '#363636',
    light: '#E7E7E7',
    dimmed: '#B7C9B3'
  },
  alert: {
    success: '#2ECC71',
    error: '#E74C3C',
    warn: '#F39C12',
    info: '#3498DB'
  }
};

export const getUrlCoorDinateFromGeoName = (name) =>
  `https://api.opencagedata.com/geocode/v1/json?q=${encodeURI(name)}&key=03c48dae07364cabb7f121d8c1519492&no_annotations=1&language=uz`;
