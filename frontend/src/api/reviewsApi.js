import api from "./axiosInstance";

const addReview = (listingId, reviewData) =>
  api.post(`/listings/${listingId}/reviews`, reviewData);
const deleteReview = (listingId, reviewId) =>
  api.delete(`/listings/${listingId}/reviews/${reviewId}`);

export { addReview, deleteReview };
