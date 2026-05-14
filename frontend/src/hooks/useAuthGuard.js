import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useAuthGuard = ({
  require = "loggedIn",
  listing = null,
  loading = false,
}) => {
  const navigate = useNavigate();
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    // Don't run while data is still being fetched
    if (loading) return;

    if (require === "loggedIn") {
      if (!user) {
        toast.error("Please log in to continue.", { toastId: "auth-loggedin" });
        navigate("/login");
      }
    } else if (require === "hostOnly") {
      if (!user) {
        toast.error("Please log in to continue.", { toastId: "auth-loggedin" });
        navigate("/login");
      } else if (user.role !== "host") {
        toast.warn("Only registered hosts can access this page.", {
          toastId: "auth-host",
        });
        navigate("/");
      }
    } else if (require === "ownerOnly") {
      if (!user) {
        toast.error("Please log in to continue.", { toastId: "auth-loggedin" });
        navigate("/login");
      } else if (user.role !== "host") {
        toast.warn("Only registered hosts can access this page.", {
          toastId: "auth-host",
        });
        navigate("/");
      } else if (listing && listing.owner) {
        const ownerId = listing.owner?._id || listing.owner;
        if (String(ownerId) !== String(user._id)) {
          toast.error("You are not the owner of this listing.", {
            toastId: "auth-owner",
          });
          navigate(`/listings/${listing._id}`);
        }
      }
    }
  }, [require, user, listing, loading, navigate]);

  let isAuthorized = false;

  if (!loading) {
    if (require === "loggedIn") {
      isAuthorized = !!user;
    } else if (require === "hostOnly") {
      isAuthorized = !!user && user.role === "host";
    } else if (require === "ownerOnly") {
      if (!!user && user.role === "host") {
        if (!listing) {
          isAuthorized = true;
        } else {
          const ownerId = listing.owner?._id || listing.owner;
          isAuthorized = String(ownerId) === String(user._id);
        }
      }
    }
  }

  return { user, isAuthorized };
};

export default useAuthGuard;
