import { RewardDocument } from '../models/Reward';

export const formatReward = ({ _id, createdAt, updatedAt, title, description }: RewardDocument) => ({
  id: _id,
  title,
  description,
  metadata: {
    createdAt,
    updatedAt,
  },
});
