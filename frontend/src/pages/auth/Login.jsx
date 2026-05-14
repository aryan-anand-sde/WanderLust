import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "../../api/authApi";

// Zod Validation Schema
const loginSchema = z.object({
  username: z
    .string()
    .nonempty({ message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters long" }),
  password: z
    .string()
    .nonempty({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const Login = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setServerError("");
      const response = await loginUser(data);
      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setServerError(
        error.response?.data?.message || "Invalid username or password",
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-4xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-(--color3) to-(--color5)"></div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-(--color1) mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-500 font-medium">
          Please enter your details to sign in.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg font-medium text-sm flex items-start">
          <svg
            className="w-5 h-5 mr-2 mt-0.5 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Username Field */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            {...register("username")}
            className={`w-full p-4 rounded-xl border-2 outline-none transition-colors font-medium bg-gray-50 text-gray-800 
              ${
                errors.username
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-(--color3)"
              }`}
          />
          {errors.username && (
            <p className="mt-2 text-sm text-red-500 font-medium flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            className={`w-full p-4 rounded-xl border-2 outline-none transition-colors font-medium bg-gray-50 text-gray-800
              ${
                errors.password
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-(--color3)"
              }`}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-500 font-medium flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-linear-to-r from-(--color1) to-(--color2) text-white font-black py-4 rounded-xl shadow-[0_10px_25px_-5px_rgba(28,77,141,0.5)] transition-all transform hover:-translate-y-1 hover:shadow-[0_15px_30px_-5px_rgba(28,77,141,0.6)] text-lg disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
