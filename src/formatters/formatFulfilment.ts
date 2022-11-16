import { FulfilmentDocument } from '../models/Fulfilment';

export const formatFulfilment = ({
  _id,
  name,
  validFrom,
  validTo,
  property,
  operator,
  target,
  reward,
}: FulfilmentDocument) => ({
  id: _id,
  name,
  validFrom,
  validTo,
  property,
  operator,
  target,
  reward,
});
