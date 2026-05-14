import React from "react";

const Card = ({ listing }) => {
  return (
    <div
      key={listing._id}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col transform hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-4/3">
        <img
          src={listing.image?.url || listing.image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col grow">
        <div className="flex justify-between items-start mb-2">
          <h3
            className="text-lg font-bold text-gray-900 truncate pr-2"
            title={listing.title}
          >
            {listing.title}
          </h3>
        </div>

        <p className="text-gray-500 text-sm flex items-center mb-4">
          <svg
            className="w-4 h-4 mr-1.5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate">
            {listing.location}, {listing.country}
          </span>
        </p>

        {/* Price and Action */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">
              Price
            </span>
            <span className="text-lg font-bold text-blue-600">
              ₹{listing.price?.toLocaleString("en-IN") || listing.price}{" "}
              <span className="text-sm text-gray-500 font-normal">/ night</span>
            </span>
          </div>

          <a
            href={`/listings/${listing._id}`}
            className="bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm"
          >
            View
          </a>
        </div>
      </div>
    </div>
  );
};

export default Card;
