
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect from root to the home page
  return <Navigate to="/" replace />;
};

export default Index;
