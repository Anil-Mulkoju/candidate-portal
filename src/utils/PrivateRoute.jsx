import { Navigate, Outlet } from "react-router-dom";
import { getItem } from "./helper";

const PrivateRoute = () => {
  const isAuthenticated = getItem("isAuthenticated") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/recruit/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
