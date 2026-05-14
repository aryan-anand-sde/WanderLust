import Login from "./pages/auth/Login";
import Layout from "./components/Layout";
import Signup from "./pages/auth/Signup";
import ErrorPage from "./pages/ErrorPage";
import NewListing from "./pages/listings/NewListing";
import MyListings from "./pages/listings/MyListings";
import EditListing from "./pages/listings/EditListing";
import ListingsIndex from "./pages/listings/ListingsIndex";
import DisplayListing from "./pages/listings/DisplayListing";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <ListingsIndex /> },
      { path: "/listings", element: <ListingsIndex /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      {
        path: "/listings/new",
        element: <NewListing />,
      },
      {
        path: "/listings/:id",
        element: <DisplayListing />,
      },
      {
        path: "/listings/:id/edit",
        element: <EditListing />,
      },
      { path: "/mylistings", element: <MyListings /> },
      { path: "/mybookings", element: <ListingsIndex /> },
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
