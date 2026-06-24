import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (!token || !userStr) {
        // User not logged in, redirect to login
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userStr);
        
        if (allowedRoles && !allowedRoles.includes(user.role)) {
            // User role not allowed for this route, redirect to appropriate portal
            if (user.role === "admin") {
                return <Navigate to="/admin/dashboard" replace />;
            } else {
                return <Navigate to="/dashboard" replace />;
            }
        }
    } catch (e) {
        // LocalStorage user JSON is invalid/corrupt, clear and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return <Navigate to="/login" replace />;
    }

    return children;
}

export function PublicRoute({ children }) {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user.role === "admin") {
                return <Navigate to="/admin/dashboard" replace />;
            } else {
                return <Navigate to="/dashboard" replace />;
            }
        } catch (e) {
            // ignore and allow showing page
        }
    }

    return children;
}
