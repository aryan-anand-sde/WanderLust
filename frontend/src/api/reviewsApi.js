import api from "./axiosInstance";

const addReview = (listingId, reviewData) =>
  api.post(`/listings/${listingId}/review`, reviewData);
const deleteReview = (listingId, reviewId) =>
  api.delete(`/listings/${listingId}/review/${reviewId}`);

export { addReview, deleteReview };
