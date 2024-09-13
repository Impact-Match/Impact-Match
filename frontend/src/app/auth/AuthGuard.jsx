import {Navigate, useLocation} from "react-router-dom";
// HOOK
import useAuth from "app/hooks/useAuth";
import {MatxLoading} from "app/components";

export default function AuthGuard({children}) {
    const {isAuthenticated, isInitialized} = useAuth();
    const {pathname} = useLocation();

    if (!isInitialized) {
        return <MatxLoading/>; // Show loading component or null until initialized
    }

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        console.log("Redirecting to login because user is not authenticated.");
        return <Navigate replace to="/login" state={{ from: pathname }} />;
    }

    return <>{children}</>;
}
