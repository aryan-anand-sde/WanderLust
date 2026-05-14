import React from "react";
import "./DatePickerComponent.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerComponent = React.forwardRef(function DatePickerComponent(
  {
    selected,
    onChange,
    placeholderText,
    minDate,
    maxDate,
    selectsStart,
    selectsEnd,
    startDate,
    endDate,
  },
  ref,
) {
  return (
    <div className="custom-datepicker-container">
      <DatePicker
        ref={ref}
        selected={selected}
        onChange={onChange}
        placeholderText={placeholderText || "Add date"}
        minDate={minDate}
        maxDate={maxDate}
        selectsStart={selectsStart}
        selectsEnd={selectsEnd}
        startDate={startDate}
        endDate={endDate}
        className="w-full bg-transparent text-gray-800 font-bold outline-none placeholder-gray-400 cursor-pointer"
        dateFormat="MMM d, yyyy"
      />
    </div>
  );
});

DatePickerComponent.displayName = "DatePickerComponent";

export default DatePickerComponent;
