import { CoordinateLongitudeLatitude } from 'haversine';

const MAX_POINTS = 50;

const formatter = ({ latitude, longitude, session }: any) => ({
  latitude,
  longitude,
  session,
});

const getInterval = (totalItems: number) => (item: any, index: number) => {
  const denominator = totalItems / MAX_POINTS;

  return !Number.isInteger(index / denominator);
};

export const formatCoordinatesToHeatMap = (coordinates: CoordinateLongitudeLatitude[]) => {
  return coordinates.map(formatter).reduce((accum: any, item) => {
    if (accum[item.session]) {
      return {
        ...accum,
        [item.session]: [...accum[item.session], item],
      };
    }

    return { ...accum, [item.session]: [item] };
  }, {});
};
