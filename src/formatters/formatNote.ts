import { NoteDocument } from '../models/Note';

export const formatNote = ({
  _id,
  text,
  point: {
    coordinates: [longitude, latitude],
  },
}: NoteDocument) => {
  return {
    id: _id,
    text,
    coordinates: {
      latitude,
      longitude,
    },
  };
};
