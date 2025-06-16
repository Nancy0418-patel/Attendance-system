import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  console.log('PrivateRoute - token:', token ? 'exists' : 'does not exist');
  console.log('PrivateRoute - userRole:', userRole);
  console.log('PrivateRoute - allowedRoles:', allowedRoles);

  if (!token) {
    console.log('PrivateRoute - No token, redirecting to /login');
    // No token, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.log('PrivateRoute - Role not allowed, redirecting to / ', userRole, allowedRoles);
    // Authenticated but role not allowed, redirect to a forbidden page or dashboard
    // For simplicity, redirect to '/' for now, which can then handle role-specific dashboard
    return <Navigate to="/" replace />;
  }

  console.log('PrivateRoute - Access granted');
  return children;
}

export default PrivateRoute; 