import { Navigate } from "react-router-dom";
import { getItem, IS_AUTHENTICATED, USER_ROLE } from "../../utils/helper";

const PrivateRoute = ({ allowedRoles, children }) => {
//   const isAuthenticated = getItem(IS_AUTHENTICATED) === "true";
  const isAuthenticated = false;
  const role = (getItem(USER_ROLE) || "").toUpperCase().trim();
  if (!isAuthenticated) {
    return <Navigate to="/account-manager/login" replace />;
  }

//   if (!allowedRoles.includes(role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

  return children;
};

export default PrivateRoute;
