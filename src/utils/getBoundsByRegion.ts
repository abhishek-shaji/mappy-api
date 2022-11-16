import { Region } from '../types/geolocation';

/*
 * Latitude : max/min +90 to -90
 * Longitude : max/min +180 to -180
 */
// Of course we can do it mo compact but it wait is more obvious
const calcMinLatByOffset = (lng, offset) => {
  const factValue = lng - offset;
  if (factValue < -90) {
    return (90 + offset) * -1;
  }
  return factValue;
};

const calcMaxLatByOffset = (lng, offset) => {
  const factValue = lng + offset;
  if (90 < factValue) {
    return (90 - offset) * -1;
  }
  return factValue;
};

const calcMinLngByOffset = (lng, offset) => {
  const factValue = lng - offset;
  if (factValue < -180) {
    return (180 + offset) * -1;
  }
  return factValue;
};

const calcMaxLngByOffset = (lng, offset) => {
  const factValue = lng + offset;
  if (180 < factValue) {
    return (180 - offset) * -1;
  }
  return factValue;
};

export const getBoundsByRegion = (region: Region, scale = 1) => {
  const latOffset = (region.latitudeDelta / 2) * scale;
  const lngD = region.longitudeDelta < -180 ? 360 + region.longitudeDelta : region.longitudeDelta;
  const lngOffset = (lngD / 2) * scale;

  const westLng = calcMinLngByOffset(region.longitude, lngOffset);
  const southLat = calcMinLatByOffset(region.latitude, latOffset);
  const eastLng = calcMaxLngByOffset(region.longitude, lngOffset);
  const northLat = calcMaxLatByOffset(region.latitude, latOffset);

  return [
    [westLng, southLat],
    [westLng, northLat],
    [eastLng, northLat],
    [eastLng, southLat],
    [westLng, southLat],
  ];
};
