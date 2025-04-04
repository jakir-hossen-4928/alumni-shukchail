
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
      navigate('/login');
      return;
    }
    
    // If a specific role is required and the user doesn't have it, redirect
    if (requiredRole && userData?.role !== requiredRole) {
      navigate('/unauthorized');
      return;
    }
  }, [currentUser, userData, requiredRole, navigate]);
  
  // If checks pass, render the children
  return currentUser ? <>{children}</> : null;
};

export default ProtectedRoute;
