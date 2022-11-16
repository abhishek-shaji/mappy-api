import { ProfileStatisticsDocument } from '../models/ProfileStatistics';

export const formatProfileStatistics = ({
  _id,
  distanceTravelled,
  caloriesBurned,
  currentStreak,
  maxStreak,
}: ProfileStatisticsDocument) => ({
  id: _id,
  distanceTravelled,
  caloriesBurned,
  currentStreak,
  maxStreak,
});
