import { Navigate } from "react-router-dom";
import { getItem, IS_AUTHENTICATED, USER_ROLE } from "../utils/helper";

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const isAuthenticated = getItem(IS_AUTHENTICATED) === "true";
  const role = (getItem(USER_ROLE) || "").toUpperCase().trim();

  // console.log("AUTH =", isAuthenticated);
  // console.log("ROLE =", role);
  // console.log("ALLOWED =", allowedRoles);

  if (!isAuthenticated) {
    return <Navigate to="/recruit/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
