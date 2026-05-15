import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthGuard from "../../hooks/useAuthGuard";
import { getMyBookings } from "../../api/bookings";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const nightsBetween = (checkIn, checkOut) =>
  Math.max(
    1,
    Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)),
  );

const statusColors = {
  booked: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-600",
};

// ─── Component ───────────────────────────────────────────────────────────────
const MyBookings = () => {
  const { isAuthorized } = useAuthGuard({ require: "guestOnly" });
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isAuthorized) return;
    getMyBookings()
      .then((res) => setBookings(res.data))
      .catch(() => toast.error("Failed to load bookings."))
      .finally(() => setLoading(false));
  }, [isAuthorized]);

  // ── Auth / Loading spinner ────────────────────────────────────────────────
  if (!isAuthorized || loading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-(--color1)" />
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (bookings.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-(--color1) opacity-40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-(--color1) mb-3">
          No bookings yet
        </h2>
        <p className="text-gray-500 font-medium mb-8 max-w-sm">
          You haven't reserved any places yet. Start exploring and book your
          next adventure!
        </p>
        <Link
          to="/"
          className="bg-(--color1) text-white font-black px-8 py-3.5 rounded-xl hover:bg-(--color2) transition-all transform hover:-translate-y-1 shadow-lg"
        >
          Explore Listings
        </Link>
      </div>
    );
  }

  // ── Booking cards ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-(--color1) tracking-tight mb-1">
          My Bookings
        </h1>
        <p className="text-gray-500 font-medium">
          {bookings.length} reservation{bookings.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="space-y-5">
        {bookings.map((booking) => {
          const nights = nightsBetween(booking.checkIn, booking.checkOut);

          // ── Deleted listing placeholder ─────────────────────────────────
          if (!booking.listing) {
            return (
              <div
                key={booking._id}
                className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex items-center gap-5"
              >
                <div className="shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-400">
                  <svg
                    className="w-6 h-6"
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
                <div className="flex-1 min-w-0">
                  <p className="font-black text-amber-800 text-sm">
                    Listing no longer available
                  </p>
                  <p className="text-xs text-amber-700 font-medium mt-0.5">
                    This property has been removed by the host.
                  </p>
                  <p className="text-xs text-amber-500 font-medium mt-1">
                    {fmt(booking.checkIn)} → {fmt(booking.checkOut)} · {nights}{" "}
                    night{nights !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-amber-600 font-semibold uppercase tracking-widest">
                    Paid
                  </p>
                  <p className="font-black text-amber-800 text-lg">
                    ₹{booking.totalPrice?.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            );
          }

          // ── Normal booking card ─────────────────────────────────────────
          return (
            <Link
              key={booking._id}
              to={`/mybookings/${booking._id}`}
              state={{ booking }}
              className="group block bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-(--color5) transition-all duration-300 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Listing image */}
                <div className="sm:w-52 h-44 sm:h-auto shrink-0 bg-gray-100 overflow-hidden">
                  <img
                    src={
                      booking.listing?.image?.url ||
                      "https://images.unsplash.com/photo-1502672260266-1c1f0808249d?auto=format&fit=crop&w=400&q=80"
                    }
                    alt={booking.listing?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-xl font-black text-gray-900 group-hover:text-(--color1) transition-colors">
                          {booking.listing?.title || "Listing"}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                          <svg
                            className="w-3.5 h-3.5 text-(--color4)"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {booking.listing?.location},{" "}
                          {booking.listing?.country}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${statusColors[booking.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    {/* Date strip */}
                    <div className="flex items-center gap-3 mt-4 mb-3">
                      <div className="bg-(--color5) rounded-xl px-4 py-2 text-center">
                        <p className="text-[10px] font-black text-(--color1) uppercase tracking-widest">
                          Check-in
                        </p>
                        <p className="font-black text-(--color1)">
                          {fmt(booking.checkIn)}
                        </p>
                      </div>
                      <div className="text-gray-300 font-black text-xl">→</div>
                      <div className="bg-(--color5) rounded-xl px-4 py-2 text-center">
                        <p className="text-[10px] font-black text-(--color1) uppercase tracking-widest">
                          Check-out
                        </p>
                        <p className="font-black text-(--color1)">
                          {fmt(booking.checkOut)}
                        </p>
                      </div>
                      <div className="ml-2 text-sm font-bold text-gray-400">
                        {nights} night{nights !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
                        Total paid
                      </p>
                      <p className="text-2xl font-black text-(--color1)">
                        ₹{booking.totalPrice?.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span className="flex items-center gap-1.5 text-(--color1) font-bold text-sm group-hover:gap-3 transition-all">
                      View details
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookings;
