import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupUser } from "../../api/authApi";

const signupSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  username: z
    .string()
    .nonempty({ message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters long" }),
  password: z
    .string()
    .nonempty({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const SignupCard = ({ isHost, onToggleMode }) => {
  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setServerError("");
      const payload = { ...data, role: isHost ? "host" : "guest" };
      const response = await signupUser(payload);
      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
      setServerError(
        error.response?.data?.message || "Something went wrong during sign up",
      );
    }
  };

  return (
    <div className="w-full bg-white rounded-4xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden p-8 sm:p-10">
      <div
        className={`absolute top-0 left-0 w-full h-2 bg-linear-to-r ${
          isHost
            ? "from-orange-400 to-red-500"
            : "from-(--color3) to-(--color5)"
        }`}
      ></div>

      <div>
        <div className="text-center mb-6">
          <h2
            className={`text-3xl font-black mb-2 ${
              isHost ? "text-red-500" : "text-(--color1)"
            }`}
          >
            {isHost ? "Become a Host" : "Create an Account"}
          </h2>
          <p className="text-gray-500 font-medium">
            {isHost
              ? "List your property and start earning today."
              : "Join us to explore and book amazing places."}
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* Name Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              {...register("name")}
              className={`w-full p-3 rounded-xl border-2 outline-none transition-colors font-medium bg-gray-50 text-gray-800 
                ${
                  errors.name
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-(--color3)"
                }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500 font-medium flex items-center">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={`w-full p-3 rounded-xl border-2 outline-none transition-colors font-medium bg-gray-50 text-gray-800 
                ${
                  errors.email
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-(--color3)"
                }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500 font-medium flex items-center">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">
                Username
              </label>
              <input
                type="text"
                placeholder="Choose a username"
                {...register("username")}
                className={`w-full p-3 rounded-xl border-2 outline-none transition-colors font-medium bg-gray-50 text-gray-800 
                  ${
                    errors.username
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-(--color3)"
                  }`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500 font-medium flex items-center">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                {...register("password")}
                className={`w-full p-3 rounded-xl border-2 outline-none transition-colors font-medium bg-gray-50 text-gray-800
                  ${
                    errors.password
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-(--color3)"
                  }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 font-medium flex items-center">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-black py-4 mt-2 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] transition-all transform hover:-translate-y-1 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.4)] text-lg disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed ${
              isHost
                ? "bg-linear-to-r from-orange-500 to-red-600"
                : "bg-linear-to-r from-(--color1) to-(--color2)"
            }`}
          >
            {isSubmitting
              ? "Creating account..."
              : isHost
                ? "Sign Up as Host"
                : "Sign Up"}
          </button>
        </form>
      </div>

      {/* Toggle Button Container */}
      <div className="mt-6 text-center border-t border-gray-100 pt-4">
        <p className="text-gray-500 font-medium mb-1">
          {isHost
            ? "Looking for a place to stay?"
            : "Want to list your property?"}
        </p>
        <button
          type="button"
          onClick={onToggleMode}
          className={`font-bold hover:underline transition-colors outline-none focus:ring-2 focus:ring-offset-2 rounded-md ${
            isHost
              ? "text-(--color1) focus:ring-(--color1)"
              : "text-red-500 focus:ring-red-500"
          }`}
        >
          {isHost ? "Sign up as a Guest" : "Sign up as a Host"}
        </button>
      </div>
    </div>
  );
};

const Signup = () => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 perspective-[1000px]">
      <div
        className="relative w-full max-w-xl transition-transform duration-700 transform-3d"
        style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front Side: Guest */}
        <div className="relative w-full backface-hidden">
          <SignupCard isHost={false} onToggleMode={() => setIsFlipped(true)} />
        </div>

        {/* Back Side: Host */}
        <div
          className="absolute top-0 left-0 w-full h-full backface-hidden"
          style={{ transform: "rotateY(180deg)" }}
        >
          <SignupCard isHost={true} onToggleMode={() => setIsFlipped(false)} />
        </div>
      </div>
    </div>
  );
};

export default Signup;
