import api from "./axiosInstance";

const getAllListings = () => api.get("/listings");
const getListingById = (id) => api.get(`/listings/${id}`);
const deleteListing = (id) => api.delete(`/listings/${id}`);
const createListing = (formData) =>
  api.post("/listings", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
const updateListing = (id, formData) =>
  api.put(`/listings/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export {
  deleteListing,
  createListing,
  updateListing,
  getAllListings,
  getListingById,
};
