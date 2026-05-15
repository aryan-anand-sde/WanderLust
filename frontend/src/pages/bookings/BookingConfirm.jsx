import React from "react";
import { toast } from "react-toastify";
import { createBooking } from "../../api/bookings";
import { useLocation, useNavigate, Link } from "react-router-dom";

const format = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const nights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  return Math.max(
    1,
    Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)),
  );
};

const BookingConfirm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;

  if (!state?.listing) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
        <p className="text-2xl font-black text-gray-400 mb-4">
          No booking details found.
        </p>
        <Link
          to="/"
          className="text-(--color1) font-bold underline underline-offset-4"
        >
          Back to listings
        </Link>
      </div>
    );
  }

  const { listing, checkIn, checkOut, guests } = state;
  const nightCount = nights(checkIn, checkOut);
  const baseFare = listing.price * nightCount;
  const serviceFee = Math.round(listing.price * nightCount * 0.01);
  const total = baseFare + serviceFee;

  const [booked, setBooked] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [bookingRef, setBookingRef] = React.useState(null);

  const handleConfirm = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to book.");
      navigate("/login");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createBooking(listing._id, {
        checkIn,
        checkOut,
        guests,
      });
      setBookingRef(res.data.booking);
      setBooked(true);
      toast.success("🎉 Booking confirmed!");
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Booking failed. Please try different dates.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (booked) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-4xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] border border-gray-100 p-10 max-w-lg w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-green-400 to-emerald-500" />
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            You&apos;re all set!
          </h2>
          <p className="text-gray-500 font-medium mb-1">{listing.title}</p>
          <p className="text-gray-400 text-sm mb-6">
            {format(checkIn)} → {format(checkOut)} · {nightCount} night
            {nightCount !== 1 ? "s" : ""}
          </p>
          {bookingRef && (
            <p className="text-xs text-gray-300 font-mono mb-8 bg-gray-50 rounded-xl px-3 py-2 inline-block">
              Ref: {bookingRef._id}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/mybookings"
              className="bg-(--color1) text-white font-black px-6 py-3.5 rounded-xl hover:bg-(--color2) transition-all"
            >
              My Bookings
            </Link>
            <Link
              to="/"
              className="bg-gray-100 text-gray-700 font-bold px-6 py-3.5 rounded-xl hover:bg-gray-200 transition-all"
            >
              Explore More
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
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
        Back to listing
      </button>

      <h1 className="text-3xl sm:text-4xl font-black text-(--color1) mb-8 tracking-tight">
        Confirm your reservation
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
            <h2 className="text-xl font-black text-gray-800 mb-5 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-(--color5) flex items-center justify-center text-(--color1) font-black text-sm">
                1
              </span>
              Your details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">
                  Full Name
                </label>
                <div className="w-full p-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 font-semibold text-gray-700 cursor-not-allowed">
                  {currentUser?.name || "—"}
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">
                  Username
                </label>
                <div className="w-full p-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 font-semibold text-gray-700 cursor-not-allowed">
                  @{currentUser?.username || "—"}
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">
                  Email
                </label>
                <div className="w-full p-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 font-semibold text-gray-700 cursor-not-allowed">
                  {currentUser?.email || "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Trip details */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
            <h2 className="text-xl font-black text-gray-800 mb-5 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-(--color5) flex items-center justify-center text-(--color1) font-black text-sm">
                2
              </span>
              Your trip
            </h2>
            <div className="space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">
                    Dates
                  </p>
                  <p className="font-bold text-gray-800">
                    {format(checkIn)} → {format(checkOut)}
                  </p>
                  <p className="text-sm text-gray-400 font-medium mt-0.5">
                    {nightCount} night{nightCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">
                    Guests
                  </p>
                  <p className="font-bold text-gray-800">
                    {guests.adults} adult{guests.adults !== 1 ? "s" : ""}
                    {guests.kids > 0 &&
                      `, ${guests.kids} kid${guests.kids !== 1 ? "s" : ""}`}
                    {guests.infants > 0 &&
                      `, ${guests.infants} infant${guests.infants !== 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex items-start gap-3">
            <svg
              className="w-5 h-5 mt-0.5 shrink-0 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-black text-amber-800 text-sm mb-1">
                Cancellation policy
              </p>
              <p className="text-amber-700 text-sm font-medium leading-relaxed">
                You can cancel your booking from &quot;My Bookings&quot; at any
                time. Refund policies vary by listing.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden sticky top-8">
            <div className="relative h-52 bg-gray-100 overflow-hidden">
              <img
                src={
                  listing.image?.url ||
                  "https://images.unsplash.com/photo-1502672260266-1c1f0808249d?auto=format&fit=crop&w=800&q=80"
                }
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-5 text-white">
                <p className="font-black text-lg leading-tight">
                  {listing.title}
                </p>
                <p className="text-white/80 text-sm font-medium">
                  {listing.location}, {listing.country}
                </p>
              </div>
            </div>

            <div className="p-7">
              <h3 className="font-black text-gray-800 text-lg mb-5">
                Price details
              </h3>
              <div className="space-y-3 text-gray-600 font-medium">
                <div className="flex justify-between">
                  <span>
                    ₹{listing.price?.toLocaleString("en-IN")} × {nightCount}{" "}
                    night{nightCount !== 1 ? "s" : ""}
                  </span>
                  <span>₹{baseFare.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    Service fee{" "}
                    <span className="text-xs text-gray-400 font-semibold">
                      (1%)
                    </span>
                  </span>
                  <span>₹{serviceFee.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <hr className="my-5 border-gray-100" />
              <div className="flex justify-between items-center text-xl font-black text-(--color1)">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>

              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="mt-7 w-full bg-linear-to-r from-(--color1) to-(--color2) text-white font-black py-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(28,77,141,0.5)] transition-all transform hover:-translate-y-1 hover:shadow-[0_15px_30px_-5px_rgba(28,77,141,0.6)] text-lg disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
              >
                {submitting ? "Confirming…" : "Confirm & Book"}
              </button>
              <p className="text-center text-xs font-semibold text-gray-400 mt-3">
                You won&apos;t be charged yet — this is just a reservation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirm;
