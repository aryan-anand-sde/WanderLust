import React from "react";
const GuestOption = ({ title, subtitle, value, onUpdate, min }) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
    <div>
      <div className="font-bold text-gray-800">{title}</div>
      <div className="text-sm text-gray-500 font-medium">{subtitle}</div>
    </div>
    <div className="flex items-center space-x-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onUpdate("subtract");
        }}
        disabled={value <= min}
        className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-colors"
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
            strokeWidth="3"
            d="M20 12H4"
          />
        </svg>
      </button>
      <span className="w-4 text-center font-bold text-gray-800">{value}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onUpdate("add");
        }}
        className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 transition-colors"
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
            strokeWidth="3"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  </div>
);

const GuestSelector = ({ guests, setGuests }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateGuest = (type, operation) => {
    setGuests((prev) => {
      const current = prev[type];
      let newValue = current;
      if (operation === "add") {
        newValue = current + 1;
      } else if (operation === "subtract") {
        newValue = Math.max(type === "adults" ? 1 : 0, current - 1);
      }
      return { ...prev, [type]: newValue };
    });
  };

  const guestText = () => {
    const total = guests.adults + guests.kids;
    let text = `${total} guest${total > 1 ? "s" : ""}`;
    if (guests.infants > 0) {
      text += `, ${guests.infants} infant${guests.infants > 1 ? "s" : ""}`;
    }
    return text;
  };

  return (
    <div className="w-full h-full relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full flex flex-col justify-center"
      >
        <span className="block text-[11px] font-black text-gray-800 uppercase tracking-widest mb-1">
          Guests
        </span>
        <span className="text-sm text-gray-700 font-bold block truncate">
          {guestText()}
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 mt-4 w-[320px] bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100 p-6 z-50">
          <GuestOption
            title="Adults"
            subtitle="Ages 13 or above"
            value={guests.adults}
            onUpdate={(op) => updateGuest("adults", op)}
            min={1}
          />
          <GuestOption
            title="Children"
            subtitle="Ages 2-12"
            value={guests.kids}
            onUpdate={(op) => updateGuest("kids", op)}
            min={0}
          />
          <GuestOption
            title="Infants"
            subtitle="Under 2"
            value={guests.infants}
            onUpdate={(op) => updateGuest("infants", op)}
            min={0}
          />
          <div className="pt-4 flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-(--color1) font-black hover:bg-gray-50 px-4 py-2 rounded-xl transition-colors underline decoration-dotted underline-offset-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestSelector;
