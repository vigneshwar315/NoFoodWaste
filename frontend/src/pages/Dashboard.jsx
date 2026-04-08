import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_ROUTES = {
  admin: '/dashboard/admin',
  employee: '/dashboard/employee',
  driver: '/dashboard/driver',
  volunteer: '/dashboard/volunteer',
  donor: '/dashboard/donor',
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role) {
      const route = ROLE_ROUTES[user.role] || '/dashboard/donor';
      navigate(route, { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
    </div>
  );
}
