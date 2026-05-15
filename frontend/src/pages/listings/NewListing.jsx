import * as z from "zod";
import React from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthGuard from "../../hooks/useAuthGuard";
import { createListing } from "../../api/listings";

const newListingSchema = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(1, { message: "Price must be a positive number" }),
  ),
  country: z.string().nonempty({ message: "Country is required" }),
  location: z.string().nonempty({ message: "Location is required" }),
  image: z.any().refine((files) => files?.length > 0, "Image is required"),
});

const NewListing = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState("");

  const { isAuthorized } = useAuthGuard({ require: "hostOnly" });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(newListingSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      country: "",
      location: "",
    },
  });

  if (!isAuthorized) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-(--color1) border-solid"></div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      setServerError("");
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("country", data.country);
      formData.append("location", data.location);
      if (data.image && data.image[0]) formData.append("image", data.image[0]);

      await createListing(formData);
      navigate("/listings");
    } catch (error) {
      console.error("Failed to create listing:", error);
      const msg =
        error.response?.data?.error ||
        "Failed to create listing. Please try again.";
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-4xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden p-8 sm:p-12">
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-(--color1) to-(--color2)"></div>

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-(--color1) tracking-tight mb-3">
            Create New Listing
          </h1>
          <p className="text-gray-500 font-medium">
            Share your wonderful space with guests from all over the world.
          </p>
        </div>

        {serverError && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl font-medium flex items-start">
            <svg
              className="w-5 h-5 mr-3 mt-0.5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Listing Title
            </label>
            <input
              type="text"
              placeholder="e.g. Cozy Cabin in the Woods"
              {...register("title")}
              className={`w-full p-4 rounded-xl border-2 outline-none transition-colors font-medium bg-gray-50 text-gray-800 ${errors.title ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-(--color1)"}`}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-500 font-medium flex items-center">
                <svg
                  className="w-4 h-4 mr-1 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Description
            </label>
            <textarea
              placeholder="Describe what makes your place special..."
              {...register("description")}
              rows="4"
              className={`w-full p-4 rounded-xl border-2 outline-none transition-colors font-medium bg-gray-50 text-gray-800 resize-none ${errors.description ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-(--color1)"}`}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-500 font-medium flex items-center">
                <svg
                  className="w-4 h-4 mr-1 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Upload Image
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className={`w-full p-4 rounded-xl border-2 border-dashed outline-none transition-colors font-medium text-gray-800 bg-gray-50 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-(--color1) hover:file:bg-blue-100 ${errors.image ? "border-red-400" : "border-gray-300 hover:border-(--color1)"}`}
              />
            </div>
            {errors.image && (
              <p className="mt-2 text-sm text-red-500 font-medium flex items-center">
                <svg
                  className="w-4 h-4 mr-1 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.image.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Price per Night
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-bold">
                  &#8377;
                </span>
                <input
                  type="number"
                  placeholder="0"
                  {...register("price")}
                  className={`w-full pl-10 p-4 rounded-xl border-2 outline-none transition-colors font-medium bg-gray-50 text-gray-800 ${errors.price ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-(--color1)"}`}
                />
              </div>
              {errors.price && (
                <p className="mt-2 text-sm text-red-500 font-medium flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Goa"
                {...register("location")}
                className={`w-full p-4 rounded-xl border-2 outline-none transition-colors font-medium bg-gray-50 text-gray-800 ${errors.location ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-(--color1)"}`}
              />
              {errors.location && (
                <p className="mt-2 text-sm text-red-500 font-medium flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Country
              </label>
              <input
                type="text"
                placeholder="e.g. India"
                {...register("country")}
                className={`w-full p-4 rounded-xl border-2 outline-none transition-colors font-medium bg-gray-50 text-gray-800 ${errors.country ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-(--color1)"}`}
              />
              {errors.country && (
                <p className="mt-2 text-sm text-red-500 font-medium flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-(--color1) to-(--color2) hover:from-(--color2) hover:to-(--color1) text-white font-black py-4 rounded-xl shadow-[0_10px_25px_-5px_rgba(28,77,141,0.5)] transition-all transform hover:-translate-y-1 hover:shadow-[0_15px_30px_-5px_rgba(28,77,141,0.6)] text-lg disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Publishing Listing...
                </>
              ) : (
                "Publish Listing"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewListing;
