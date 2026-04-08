import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Pages
import LandingPage from './pages/LandingPage';
import LoginPortal from './pages/LoginPortal';
import AdminLogin from './pages/auth/AdminLogin';
import EmployeeLogin from './pages/auth/EmployeeLogin';
import DriverLogin from './pages/auth/DriverLogin';
import VolunteerRegister from './pages/auth/VolunteerRegister';
import VolunteerLogin from './pages/auth/VolunteerLogin';
import DonorLogin from './pages/auth/DonorLogin';

// Admin Pages
import RegisterUser from './pages/admin/RegisterUser';
import UserManagement from './pages/admin/UserManagement';
import AdminDashboard from './pages/admin/AdminDashboard';

// Role Dashboards
import Dashboard from './pages/Dashboard'; // smart router
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import DriverDashboard from './pages/driver/DriverDashboard';
import DonorDashboard from './pages/donor/DonorDashboard';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';

// Protected route wrapper
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
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

      {/* Dashboard smart router (redirects by role) */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* Role-specific dashboards */}
      <Route path="/dashboard/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/employee" element={<ProtectedRoute roles={['employee', 'admin']}><EmployeeDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/driver" element={<ProtectedRoute roles={['driver']}><DriverDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/donor" element={<ProtectedRoute roles={['donor']}><DonorDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/volunteer" element={<ProtectedRoute roles={['volunteer']}><VolunteerDashboard /></ProtectedRoute>} />

      {/* Admin management */}
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