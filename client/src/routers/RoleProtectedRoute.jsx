import { userAuth } from '@/contextApi/AuthContext';
import Loader from '@/components/common/Loader';
import { Navigate } from 'react-router-dom';

const ADMIN_ROLES = ['admin', 'manager', 'manger'];

export default function RoleProtectedRoute({ children }) {
  const { user, isAuth, loading } = userAuth();

  if (loading) return <Loader />;
  if (!isAuth) return <Navigate to="/auth" replace />;

  const userRole = (user?.role || '').toLowerCase();
  if (!ADMIN_ROLES.includes(userRole)) {
    return <Navigate to="/drive/home" replace />;
  }

  return children;
}
