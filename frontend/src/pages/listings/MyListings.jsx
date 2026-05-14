import React from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import useAuthGuard from "../../hooks/useAuthGuard";
import { getAllListings } from "../../api/listingsApi";

const MyListings = () => {
  const [listings, setListings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { user, isAuthorized } = useAuthGuard({ require: "hostOnly" });

  React.useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await getAllListings();
        const allListings = response.data;
        // Filter listings where owner is the current user
        const hostListings = allListings.filter((listing) => {
          const ownerId = listing.owner?._id || listing.owner;
          return ownerId === user?._id;
        });
        setListings(hostListings);
      } catch (error) {
        console.error("Error fetching listings:", error);
        toast.error("Failed to load your listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchListings();
    else setLoading(false);
  }, [user?._id]);

  if (!isAuthorized || loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] bg-gray-50/30">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-(--color1)"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-(--color1) tracking-tight">
            My Listings
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            Manage your properties and track your success.
          </p>
        </div>
        <Link
          to="/listings/new"
          className="bg-linear-to-r from-(--color1) to-(--color2) hover:from-(--color2) hover:to-(--color1) text-white px-6 py-3 rounded-xl font-bold shadow-[0_10px_20px_-5px_rgba(28,77,141,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(28,77,141,0.5)] transition-all transform hover:-translate-y-1 flex items-center shrink-0"
        >
          <svg
            className="w-5 h-5 mr-2 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Create New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white rounded-4xl shadow-sm border border-gray-100 p-12 sm:p-20 text-center">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-(--color1)">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              ></path>
            </svg>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-3">
            No listings yet
          </h3>
          <p className="text-lg text-gray-500 max-w-lg mx-auto mb-10 font-medium">
            You haven't added any properties yet. Start your hosting journey by
            creating your very first listing!
          </p>
          <Link
            to="/listings/new"
            className="inline-block bg-(--color1) hover:bg-blue-800 text-white font-bold py-4 px-10 rounded-2xl shadow-md transition-all transform hover:-translate-y-1"
          >
            Get Started
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <Link
              to={`/listings/${listing._id}`}
              key={listing._id}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgb(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={
                    listing.image?.url ||
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={listing.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl font-black text-gray-900 text-sm shadow-md flex items-center border border-white/20">
                  &#8377; {listing.price?.toLocaleString("en-IN") || "N/A"}{" "}
                  <span className="text-xs text-gray-500 font-bold ml-1">
                    / night
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col grow">
                <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-1 group-hover:text-(--color1) transition-colors tracking-tight">
                  {listing.title}
                </h3>

                <div className="flex items-center text-gray-500 text-sm mb-4 font-medium">
                  <svg
                    className="w-4 h-4 mr-1.5 shrink-0 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  <span className="truncate">
                    {listing.location}, {listing.country}
                  </span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
                  {listing.description}
                </p>

                <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between text-sm font-bold text-(--color1)">
                  <span className="uppercase tracking-wider text-xs">
                    View Details
                  </span>
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-(--color1) group-hover:text-white transition-colors duration-300">
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform"
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
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
