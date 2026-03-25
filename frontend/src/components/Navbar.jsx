import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center group-hover:bg-orange-600 transition-colors">
              <span className="text-white text-xl">🍱</span>
            </div>
            <div className="leading-tight">
              <div className="font-bold text-orange-600 text-sm uppercase tracking-wide">No Food</div>
              <div className="font-bold text-teal-800 text-sm uppercase tracking-wide">Waste NGO</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-gray-700 hover:text-orange-500 font-medium transition-colors text-sm">Home</a>
            <a href="#about" className="text-gray-700 hover:text-orange-500 font-medium transition-colors text-sm">About Us</a>
            <a href="#network" className="text-gray-700 hover:text-orange-500 font-medium transition-colors text-sm">Network</a>
            <a href="#objectives" className="text-gray-700 hover:text-orange-500 font-medium transition-colors text-sm">Objectives</a>
            <a href="#contact" className="text-gray-700 hover:text-orange-500 font-medium transition-colors text-sm">Feedback</a>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 text-gray-600 hover:text-teal-700 font-medium text-sm transition-colors"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium text-sm transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-teal-800 hover:text-orange-500 font-semibold text-sm transition-colors border border-teal-200 px-4 py-2 rounded-lg hover:border-orange-300"
                >
                  Login
                </Link>
                <Link
                  to="/volunteer/register"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  Register as Volunteer
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-orange-500"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 space-y-3 px-2">
            <a href="#home" className="block text-gray-700 hover:text-orange-500 font-medium py-2 transition-colors">Home</a>
            <a href="#about" className="block text-gray-700 hover:text-orange-500 font-medium py-2 transition-colors">About Us</a>
            <a href="#objectives" className="block text-gray-700 hover:text-orange-500 font-medium py-2 transition-colors">Objectives</a>
            {user ? (
              <>
                <button onClick={() => { navigate('/dashboard'); setMenuOpen(false); }} className="block w-full text-left text-teal-700 font-medium py-2">Dashboard</button>
                <button onClick={handleLogout} className="block w-full text-left text-red-500 font-medium py-2">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-center border border-teal-300 text-teal-800 font-semibold py-2 rounded-lg">Login</Link>
                <Link to="/volunteer/register" className="block text-center bg-orange-500 text-white font-semibold py-2 rounded-lg">Register as Volunteer</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
