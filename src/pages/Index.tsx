
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect from root to the login page
  return <Navigate to="/login" replace />;
};

export default Index;
