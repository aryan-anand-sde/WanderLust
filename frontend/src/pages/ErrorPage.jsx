import React from "react";
import { Link } from "react-router-dom";

const ErrorDisplay = ({ status = "404", message = "Page Not Found" }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-gray-50/30">
      <div className="max-w-md w-full text-center">
        {/* Playful Error Illustration */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          {/* Subtle animated background circles */}
          <div className="absolute inset-0 bg-(--color3) opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute inset-4 bg-(--color3) opacity-20 rounded-full"></div>
          
          {/* Confused/Compass Face SVG */}
          <svg
            className="absolute inset-0 w-full h-full text-(--color1) p-10 drop-shadow-md"
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

        {/* Giant Status Code */}
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-linear-to-b from-gray-200 to-gray-100 tracking-tighter mb-2 select-none relative z-0">
          {status}
        </h1>

        {/* Error Text Overlay */}
        <div className="relative z-10 -mt-16 mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
            Looks like you're lost.
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            {message || "We couldn't find the page you're looking for."}
          </p>
        </div>

        {/* Call to Action */}
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all transform rounded-2xl shadow-[0_10px_25px_-5px_rgba(28,77,141,0.5)] bg-linear-to-r from-(--color1) to-(--color2) hover:-translate-y-1 hover:shadow-[0_15px_30px_-5px_rgba(28,77,141,0.6)]"
        >
          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Take Me Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorDisplay;
