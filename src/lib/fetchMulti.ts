// Deprecated: replaced by server-side `/api/search` route.
export const fetchByTitle = async () => {
  throw new Error("fetchMulti is deprecated. Use /api/search or useFindByTitle hook.");
};