import React from "react";
import Card from "../../components/Card";
import { getAllListings } from "../../api/listings";

const ListingsIndex = () => {
  const [listings, setListings] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllListings();
        setListings(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          Explore <span className="text-blue-600">Popular Stays</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {listings && listings.length > 0 ? (
          listings.map((listing) => (
            <Card key={listing._id} listing={listing} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <div className="inline-flex p-4 rounded-full bg-blue-50 mb-4 text-blue-600">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl text-gray-800 font-bold mb-2">
              No listings found
            </h3>
            <p className="text-gray-500 max-w-md">
              We couldn't find any stays matching your criteria right now. Check
              back soon for new amazing places!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingsIndex;
