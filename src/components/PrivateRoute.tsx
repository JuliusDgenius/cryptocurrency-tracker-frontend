import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const PrivateRoute = () => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // While checking auth, render nothing or a loading indicator
        return <div>Loading authentication...</div>; // Return null
    }

    // Now that isLoading is false, safely check user state
    return user ? (
    <Outlet />
) : <Navigate to='/login' state={{ from: location }} replace />;
};