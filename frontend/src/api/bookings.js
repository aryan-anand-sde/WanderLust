import api from "./axiosInstance";

const getListingBookings = (listingId) =>
  api.get(`/listings/${listingId}/bookings`);

const createBooking = (listingId, bookingData) =>
  api.post(`/listings/${listingId}/bookings`, bookingData);

const getMyBookings = () => api.get("/bookings/my");
const cancelBooking = (bookingId) => api.patch(`/bookings/${bookingId}/cancel`);

export { getListingBookings, createBooking, getMyBookings, cancelBooking };
