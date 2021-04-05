import Prismic from "prismic-javascript";

export const apIEndpoint =
  "https://devcommercerocketseat1223.cdn.prismic.io/api/v2";

export const client = (req = null) => {
  const options = req ? { req } : null;
  return Prismic.client(apIEndpoint, options);
};
