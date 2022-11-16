export const formatGeoTrackingSession = (
  { _id, startTime, endTime, createdAt, updatedAt }: any,
  locationHistory: any = [],
) => ({
  id: _id,
  startTime,
  endTime,
  createdAt,
  updatedAt,
  locationHistory,
});
