import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPortal from './pages/LoginPortal';
import AdminLogin from './pages/auth/AdminLogin';
import EmployeeLogin from './pages/auth/EmployeeLogin';
import DriverLogin from './pages/auth/DriverLogin';
import VolunteerRegister from './pages/auth/VolunteerRegister';
import VolunteerLogin from './pages/auth/VolunteerLogin';
import DonorLogin from './pages/auth/DonorLogin';
import RegisterUser from './pages/admin/RegisterUser';
import UserManagement from './pages/admin/UserManagement';
import Dashboard from './pages/Dashboard';

// Protected route wrapper
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPortal />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/login/employee" element={<EmployeeLogin />} />
      <Route path="/login/driver" element={<DriverLogin />} />
      <Route path="/login/volunteer" element={<VolunteerLogin />} />
      <Route path="/login/donor" element={<DonorLogin />} />
      <Route path="/volunteer/register" element={<VolunteerRegister />} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/register-user" element={<ProtectedRoute roles={['admin']}><RegisterUser /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><UserManagement /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: 'Inter, sans-serif' },
            success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
          }}
        />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;