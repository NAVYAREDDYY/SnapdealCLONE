import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const VendorRoute = ({ children }) => {
  const user = useSelector((state) => state.user.currentUser);
  const role = user?.user?.role || user?.role;
  if (!user || role !== 'vendor') {
    return <Navigate to="/vendor" />;
  }
  return children;
};

export default VendorRoute;


