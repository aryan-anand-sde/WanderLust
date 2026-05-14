import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getListingById, deleteListing } from "../../api/listingsApi";
import { addReview, deleteReview } from "../../api/reviewsApi";
import DatePickerComponent from "../../components/DatePicker/DatePickerComponent";
import GuestSelector from "../../components/GuestSelector/GuestSelector";

const DisplayListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;

  const [listing, setListing] = React.useState(null);
  const [reviewData, setReviewData] = React.useState({
    rating: "5",
    comment: "",
  });
  const [loading, setLoading] = React.useState(true);

  // Booking dates state
  const defaultCheckIn = new Date();
  defaultCheckIn.setDate(defaultCheckIn.getDate() + 1);
  const defaultCheckOut = new Date(defaultCheckIn);
  defaultCheckOut.setDate(defaultCheckOut.getDate() + 3);

  const [checkInDate, setCheckInDate] = React.useState(defaultCheckIn);
  const [checkOutDate, setCheckOutDate] = React.useState(defaultCheckOut);

  const [guests, setGuests] = React.useState({
    adults: 1,
    kids: 0,
    infants: 0,
  });

  const checkInRef = React.useRef(null);
  const checkOutRef = React.useRef(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListingById(id);
        setListing(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReview(id, reviewData);
      const response = await getListingById(id);
      setListing(response.data);
      setReviewData({ rating: "5", comment: "" });
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Failed to add review. Make sure you are logged in.");
    }
  };

  const handleDeleteListing = async () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await deleteListing(id);
        navigate("/");
      } catch (error) {
        console.error("Error deleting listing:", error);
        alert("Failed to delete listing.");
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(id, reviewId);
        setListing((prev) => ({
          ...prev,
          reviews: prev.reviews.filter((r) => r._id !== reviewId),
        }));
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("Failed to delete review.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-(--color1)"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-gray-50 p-6 rounded-full mb-6">
          <svg
            className="w-20 h-20 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-(--color1) mb-4">
          Listing Not Found
        </h2>
        <p className="text-gray-500 text-lg mb-8 max-w-md">
          We couldn't find the place you're looking for. It might have been
          removed or the link might be broken.
        </p>
        <Link
          to="/"
          className="bg-(--color1) text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-(--color2) transition-all transform hover:-translate-y-1 shadow-[0_10px_25px_-5px_rgba(28,77,141,0.5)]"
        >
          Explore other places
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-12 font-sans text-gray-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-black text-(--color1) mb-3 tracking-tight">
          {listing.title}
        </h1>
        <div className="flex items-center text-gray-600 font-medium text-lg">
          <svg
            className="w-6 h-6 mr-1.5 text-(--color4)"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {listing.location}, {listing.country}
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] rounded-3xl overflow-hidden mb-12 shadow-2xl relative group bg-gray-100">
        <img
          src={
            listing.image?.url ||
            "https://images.unsplash.com/photo-1502672260266-1c1f0808249d?auto=format&fit=crop&w=1200&q=80"
          }
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content (Left) */}
        <div className="lg:col-span-2 space-y-12">
          {/* Host Info */}
          <section className="flex items-center space-x-6 bg-linear-to-r from-(--color5) to-transparent p-6 rounded-3xl border border-(--color5) shadow-sm">
            <div className="w-20 h-20 bg-(--color2) rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg border-4 border-white">
              {listing.owner?.name
                ? listing.owner.name.charAt(0).toUpperCase()
                : "H"}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-(--color1)">
                Hosted by {listing.owner?.name || "Unknown"}
              </h3>
              <p className="text-gray-600 font-medium mt-1">
                @{listing.owner?.username || "user"}
              </p>
              {listing.owner?.email && (
                <p className="text-(--color4) text-sm mt-0.5">
                  {listing.owner.email}
                </p>
              )}
            </div>
          </section>

          {/* Description */}
          <section>
            <h2 className="text-2xl font-bold text-(--color1) mb-5 flex items-center border-b border-gray-100 pb-3">
              <svg
                className="w-7 h-7 mr-3 text-(--color4)"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              About this place
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line bg-white p-8 rounded-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-gray-50">
              {listing.description}
            </p>
          </section>

          {/* Reviews Section */}
          <section>
            <h2 className="text-2xl font-bold text-(--color1) mb-6 flex items-center border-b border-gray-100 pb-3">
              <svg
                className="w-7 h-7 mr-3 text-(--color4)"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              Guest Reviews
            </h2>

            {listing.reviews && listing.reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listing.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-(--color4) opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-(--color3) rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-sm">
                        {review.author?.name
                          ? review.author.name.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <div>
                        <h4 className="font-bold text-(--color1) text-lg">
                          {review.author?.name || "User"}
                        </h4>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>

                    {currentUser && currentUser._id === review.author?._id && (
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="mt-5 text-xs text-red-500 hover:text-red-700 font-bold transition-colors uppercase tracking-widest bg-red-50 py-1.5 px-3 rounded-lg"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-10 rounded-3xl text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium text-lg">
                  No reviews yet. Be the first to leave one!
                </p>
              </div>
            )}

            {/* Add Review Form */}
            {currentUser && currentUser.role !== "host" && (
              <div className="mt-12 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-(--color3) to-(--color5)"></div>
                <h3 className="text-2xl font-black text-(--color1) mb-6">
                  Leave a Review
                </h3>
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                      Rating
                    </label>
                    <select
                      name="rating"
                      value={reviewData.rating}
                      onChange={handleReviewChange}
                      className="w-full sm:w-64 rounded-xl border-gray-300 shadow-sm focus:border-(--color3) focus:ring-(--color3) p-4 border-2 bg-gray-50 font-bold text-gray-700 outline-none transition-colors"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ - Amazing</option>
                      <option value="4">⭐⭐⭐⭐ - Very Good</option>
                      <option value="3">⭐⭐⭐ - Average</option>
                      <option value="2">⭐⭐ - Not Good</option>
                      <option value="1">⭐ - Terrible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                      Your Experience
                    </label>
                    <textarea
                      name="comment"
                      rows="4"
                      value={reviewData.comment}
                      onChange={handleReviewChange}
                      required
                      className="w-full rounded-xl border-gray-300 shadow-sm focus:border-(--color3) focus:ring-(--color3) p-4 border-2 bg-gray-50 placeholder-gray-400 outline-none transition-colors"
                      placeholder="What made your stay special?..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-(--color1) text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-(--color2) transition-all transform hover:-translate-y-1 shadow-[0_10px_20px_-10px_rgba(15,40,84,0.5)]"
                  >
                    Post Review
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>

        {/* Booking / Action Card (Right) */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white p-8 rounded-4xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100">
            <div className="flex items-baseline mb-8 pb-6 border-b border-gray-100">
              <span className="text-5xl font-black text-(--color1) tracking-tighter">
                &#8377;{listing.price?.toLocaleString("en-IN") || listing.price}
              </span>
              <span className="text-gray-500 font-bold ml-2 text-lg">
                / night
              </span>
            </div>

            {currentUser && currentUser._id === listing.owner?._id ? (
              <div className="mt-2 border-t-2 border-gray-100 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-(--color1)"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  Host Controls
                </h3>
                <div className="space-y-3">
                  <Link
                    to={`/listings/${listing._id}/edit`}
                    className="flex justify-between items-center w-full bg-white border-2 border-gray-200 hover:border-(--color1) text-gray-700 font-bold px-5 py-4 rounded-2xl transition-all hover:shadow-md group"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-(--color1) flex items-center justify-center mr-4 group-hover:bg-(--color1) group-hover:text-white transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          ></path>
                        </svg>
                      </div>
                      Edit Listing Details
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-(--color1) transform group-hover:translate-x-1 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </Link>

                  <button
                    className="flex justify-between items-center w-full bg-white border-2 border-gray-200 hover:border-(--color3) text-gray-700 font-bold px-5 py-4 rounded-2xl transition-all hover:shadow-md group"
                    onClick={() => alert("Analytics dashboard coming soon!")}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mr-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          ></path>
                        </svg>
                      </div>
                      Listing Performance
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-green-600 transform group-hover:translate-x-1 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>

                  <button
                    className="flex justify-between items-center w-full bg-white border-2 border-gray-200 hover:border-(--color4) text-gray-700 font-bold px-5 py-4 rounded-2xl transition-all hover:shadow-md group"
                    onClick={() => alert("Manage bookings coming soon!")}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mr-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </div>
                      Manage Bookings
                    </div>
                    <span className="bg-purple-100 text-purple-700 text-xs font-black px-2.5 py-1 rounded-lg">
                      3 NEW
                    </span>
                  </button>

                  <button
                    onClick={handleDeleteListing}
                    className="flex justify-center items-center w-full text-red-500 hover:bg-red-50 hover:text-red-600 font-bold py-3.5 rounded-2xl transition-colors mt-2 border border-transparent hover:border-red-100"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                    Permanently Delete
                  </button>
                </div>
              </div>
            ) : currentUser?.role === "host" ? (
              <div className="mt-6 border-t border-gray-100 pt-6">
                <div className="bg-blue-50 text-blue-800 p-5 rounded-2xl font-medium border border-blue-100 flex items-start">
                  <svg
                    className="w-6 h-6 mr-3 mt-0.5 shrink-0 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <p className="leading-relaxed">
                    You are viewing this listing with a Host account. To reserve
                    places, please log in or register as a Guest.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Mock Booking Info to look like a hotel site */}
                <div className="mb-8 space-y-4">
                  <div className="grid grid-cols-2 gap-0 border-2 border-gray-200 rounded-2xl overflow-hidden focus-within:border-(--color3) transition-colors">
                    <div
                      className="block p-4 bg-white border-r-2 border-gray-200 cursor-pointer hover:bg-gray-50"
                      onClick={() => checkInRef.current?.setFocus()}
                    >
                      <span className="block text-[11px] font-black text-gray-800 uppercase tracking-widest mb-1">
                        Check-in
                      </span>
                      <span className="text-sm text-gray-400 font-medium block">
                        <DatePickerComponent
                          ref={checkInRef}
                          selected={checkInDate}
                          onChange={(date) => setCheckInDate(date)}
                          selectsStart
                          startDate={checkInDate}
                          endDate={checkOutDate}
                          minDate={new Date()}
                          placeholderText="Add date"
                        />
                      </span>
                    </div>
                    <div
                      className="block p-4 bg-white cursor-pointer hover:bg-gray-50"
                      onClick={() => checkOutRef.current?.setFocus()}
                    >
                      <span className="block text-[11px] font-black text-gray-800 uppercase tracking-widest mb-1">
                        Check-out
                      </span>
                      <span className="text-sm text-gray-400 font-medium block">
                        <DatePickerComponent
                          ref={checkOutRef}
                          selected={checkOutDate}
                          onChange={(date) => setCheckOutDate(date)}
                          selectsEnd
                          startDate={checkInDate}
                          endDate={checkOutDate}
                          minDate={checkInDate || new Date()}
                          placeholderText="Add date"
                        />
                      </span>
                    </div>
                  </div>
                  <div className="border-2 border-gray-200 rounded-2xl p-4 bg-white cursor-pointer hover:bg-gray-50 focus-within:border-(--color3) transition-colors">
                    <GuestSelector guests={guests} setGuests={setGuests} />
                  </div>
                </div>

                <div className="mt-8">
                  <button className="w-full text-center bg-linear-to-r from-(--color1) to-(--color2) text-white font-black py-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(28,77,141,0.5)] transition-all transform hover:-translate-y-1 hover:shadow-[0_15px_30px_-5px_rgba(28,77,141,0.6)] text-xl">
                    Reserve
                  </button>
                  <p className="text-center text-sm font-semibold text-gray-400 mt-4">
                    You won't be charged yet
                  </p>
                </div>

                <hr className="my-6 border-gray-200" />

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-gray-600 font-medium text-lg">
                    <div className="relative group cursor-help">
                      <span className="underline decoration-dotted underline-offset-4">
                        Base fare
                      </span>
                      <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-xl pointer-events-none">
                        Nightly rate for this property
                        <div className="absolute top-full left-8 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                    <span>
                      &#8377;
                      {listing.price?.toLocaleString("en-IN") || listing.price}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 font-medium text-lg">
                    <div className="relative group cursor-help">
                      <span className="underline decoration-dotted underline-offset-4">
                        Service fee
                      </span>
                      <div className="absolute bottom-full left-0 mb-2 w-56 p-2 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-xl pointer-events-none">
                        1% platform fee to help run Wander Lust
                        <div className="absolute top-full left-8 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                    <span>&#8377;{(listing.price * 0.01).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-2xl font-black text-(--color1) pt-6 mt-6 border-t border-gray-200">
                  <span>Total</span>
                  <span>
                    &#8377;{(listing.price + listing.price * 0.01).toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayListing;
