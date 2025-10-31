// Deprecated: client-side TMDB helpers have been replaced by server routes.
// Use `/api/search` (server) or the `useFindByTitle` hook instead.
export const fetchByTitle = async () => {
  throw new Error("fetchByTitle is deprecated. Use /api/search or useFindByTitle hook.");
};