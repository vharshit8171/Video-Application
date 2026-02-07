import { Navigate } from "react-router-dom";
import toast from 'react-hot-toast';
import {useAuthStore} from '../store/authStore.js';

const ProtectedRoute = ({ children }) => {
  const {isAuthenticated,isAuthChecked} = useAuthStore();

  if(!isAuthChecked){
    return null; // App.jsx already handles loader UI
  }

  if (!isAuthenticated) {
    toast.error("Please login to continue");
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
