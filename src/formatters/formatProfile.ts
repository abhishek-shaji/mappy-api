import { ProfileDocument } from '../models/Profile';
import { formatFile } from './formatFile';

export const formatProfile = ({
  _id,
  firstname,
  lastname,
  gender,
  weight,
  height,
  color,
  createdAt,
  updatedAt,
  isInstantiated,
  picture,
  statistics: {
    caloriesBurned,
    distanceTravelled,
    maxStreak,
    currentStreak,
    countriesVisited,
    regionsVisited,
    distanceTravelledToday,
    caloriesBurnedToday,
  },
  rewards,
}: ProfileDocument) => ({
  id: _id,
  firstname,
  lastname,
  gender,
  weight,
  color,
  height,
  createdAt,
  updatedAt,
  isInstantiated,
  picture: picture ? formatFile(picture) : undefined,
  statistics: {
    caloriesBurned,
    distanceTravelled,
    maxStreak,
    currentStreak,
    countriesVisited,
    regionsVisited,
    distanceTravelledToday,
    caloriesBurnedToday,
  },
  rewards,
});
