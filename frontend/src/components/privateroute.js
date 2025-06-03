import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser} from './utils.js';

const PrivateRoute = ({ children, role }) => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  else if (role && currentUser.role !== role) {
    return <Navigate to={`/dashboard-${currentUser.role}`} />;
  }

  return children;
};

export default PrivateRoute;
