export const formatFile = ({ _id, createdAt, location, filename }: any) => ({
  id: _id,
  location,
  filename,
  metadata: {
    createdAt,
  },
});
