import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole
}) => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If no user is logged in, redirect to login
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }

    // Wait for userData to load
    if (!userData) {
      return;
    }

    // Check role requirements
    if (requiredRole && userData.role !== requiredRole) {
      navigate('/unauthorized', { replace: true });
      return;
    }

    // If no specific role is required and user is authenticated,
    // allow access (no redirect needed)
  }, [currentUser, userData, requiredRole, navigate]);

  // Render children if user is authenticated and has correct role (if required)
  if (!currentUser) {
    return null;
  }

  if (requiredRole && userData?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;