import React from "react";
import { toast } from "react-toastify";
import { cancelBooking } from "../../api/bookings";
import useAuthGuard from "../../hooks/useAuthGuard";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const fmtShort = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const nightsBetween = (a, b) =>
  Math.max(1, Math.ceil((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24)));

const statusConfig = {
  booked: {
    label: "Confirmed",
    color: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-600",
    dot: "bg-red-500",
  },
};

// ─── Component ───────────────────────────────────────────────────────────────
const BookingDetail = () => {
  const { bookingId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { isAuthorized } = useAuthGuard({ require: "guestOnly" });

  // Booking can come from route state (fast path) or would need a fetch
  const [booking, setBooking] = React.useState(state?.booking || null);
  const [cancelling, setCancelling] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  // Fallback: if no state, redirect back (API fetch can be added later)
  React.useEffect(() => {
    if (!booking && bookingId) {
      toast.error("Booking details not found. Please open from My Bookings.");
      navigate("/mybookings");
    }
  }, [booking, bookingId, navigate]);

  if (!isAuthorized || !booking) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-(--color1)" />
      </div>
    );
  }

  const nights = nightsBetween(booking.checkIn, booking.checkOut);
  const baseFare = booking.totalPrice
    ? Math.round(booking.totalPrice / 1.01)
    : 0;
  const serviceFee = booking.totalPrice ? booking.totalPrice - baseFare : 0;
  const status = statusConfig[booking.status] || statusConfig.booked;
  const isCancelled = booking.status === "cancelled";

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelBooking(booking._id || bookingId);
      setBooking((prev) => ({ ...prev, status: "cancelled" }));
      toast.success("Booking cancelled successfully.");
      setShowConfirm(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to cancel booking.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back link */}
      <button
        onClick={() => navigate("/mybookings")}
        className="flex items-center gap-2 text-(--color1) font-bold mb-8 hover:underline"
      >
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to My Bookings
      </button>

      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-(--color1) tracking-tight">
            Booking Details
          </h1>
          <p className="text-gray-400 font-mono text-xs mt-1 select-all">
            Ref: {booking._id || bookingId}
          </p>
        </div>
        <span
          className={`flex items-center gap-2 font-black text-sm px-4 py-2 rounded-full ${status.color}`}
        >
          <span className={`w-2 h-2 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left column ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Listing card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative h-56 bg-gray-100 overflow-hidden">
              <img
                src={
                  booking.listing?.image?.url ||
                  "https://images.unsplash.com/photo-1502672260266-1c1f0808249d?auto=format&fit=crop&w=800&q=80"
                }
                alt={booking.listing?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-5 left-6 text-white">
                <h2 className="text-2xl font-black leading-tight">
                  {booking.listing?.title || "Listing"}
                </h2>
                <p className="text-white/80 font-medium text-sm flex items-center gap-1 mt-0.5">
                  <svg
                    className="w-3.5 h-3.5"
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
                  {booking.listing?.location}, {booking.listing?.country}
                </p>
              </div>
            </div>
            {booking.listing?._id && (
              <div className="px-6 py-4 border-t border-gray-50">
                <Link
                  to={`/listings/${booking.listing._id}`}
                  className="text-(--color1) font-bold text-sm hover:underline flex items-center gap-1"
                >
                  View listing page
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
            <h3 className="font-black text-gray-800 text-lg mb-5 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-(--color5) flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-(--color1)"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </span>
              Stay Dates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-(--color5) rounded-2xl p-4">
                <p className="text-xs font-black text-(--color1) uppercase tracking-widest mb-2">
                  Check-in
                </p>
                <p className="font-black text-gray-900 text-lg">
                  {fmtShort(booking.checkIn)}
                </p>
                <p className="text-gray-400 text-xs font-medium mt-0.5">
                  {fmt(booking.checkIn).split(",")[0]}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-black text-(--color1)">
                    {nights}
                  </div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    night{nights !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
              <div className="bg-(--color5) rounded-2xl p-4">
                <p className="text-xs font-black text-(--color1) uppercase tracking-widest mb-2">
                  Check-out
                </p>
                <p className="font-black text-gray-900 text-lg">
                  {fmtShort(booking.checkOut)}
                </p>
                <p className="text-gray-400 text-xs font-medium mt-0.5">
                  {fmt(booking.checkOut).split(",")[0]}
                </p>
              </div>
            </div>
          </div>

          {/* Guests */}
          {booking.guests && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
              <h3 className="font-black text-gray-800 text-lg mb-5 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-(--color5) flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-(--color1)"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
                Guests
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Adults", count: booking.guests.adults },
                  { label: "Kids", count: booking.guests.kids },
                  { label: "Infants", count: booking.guests.infants },
                ]
                  .filter((g) => g.count > 0)
                  .map((g) => (
                    <div
                      key={g.label}
                      className="bg-gray-50 rounded-2xl px-5 py-3 text-center border border-gray-100"
                    >
                      <p className="text-2xl font-black text-(--color1)">
                        {g.count}
                      </p>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        {g.label}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right column: Price + Actions ────────────────────────────────── */}
        <div className="space-y-5">
          {/* Price breakdown */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7 sticky top-8">
            <h3 className="font-black text-gray-800 text-lg mb-5">
              Price breakdown
            </h3>
            <div className="space-y-3 text-gray-600 font-medium text-sm">
              <div className="flex justify-between">
                <span>
                  ₹{booking.listing?.price?.toLocaleString("en-IN")} × {nights}{" "}
                  night{nights !== 1 ? "s" : ""}
                </span>
                <span>₹{baseFare.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  Service fee
                  <span className="text-xs text-gray-400">(1%)</span>
                </span>
                <span>₹{serviceFee.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <hr className="my-4 border-gray-100" />
            <div className="flex justify-between items-center text-xl font-black text-(--color1)">
              <span>Total</span>
              <span>₹{booking.totalPrice?.toLocaleString("en-IN")}</span>
            </div>

            {/* Booked on */}
            {booking.createdAt && (
              <p className="text-xs text-gray-400 font-medium mt-4">
                Booked on {fmtShort(booking.createdAt)}
              </p>
            )}
          </div>

          {/* Cancel booking */}
          {!isCancelled && (
            <div className="bg-white rounded-3xl shadow-sm border border-red-100 p-6">
              {showConfirm ? (
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-4">
                    Are you sure you want to cancel this booking? This action
                    cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancel}
                      disabled={cancelling}
                      className="flex-1 bg-red-500 text-white font-black py-3 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-60"
                    >
                      {cancelling ? "Cancelling…" : "Yes, Cancel"}
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Keep it
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full text-red-500 hover:text-red-700 font-bold text-sm flex items-center justify-center gap-2 py-2 hover:bg-red-50 rounded-xl transition-colors"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel this booking
                </button>
              )}
            </div>
          )}

          {isCancelled && (
            <div className="bg-red-50 border border-red-100 rounded-3xl p-5 text-center">
              <p className="text-red-600 font-black text-sm">
                This booking has been cancelled.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
