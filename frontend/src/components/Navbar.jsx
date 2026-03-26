import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, User, ChevronDown, Home, Info, Network, Target, MessageSquare, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const isLandingPage = location.pathname === '/';

  const navLinks = [
    { href: '#home', label: 'Home', icon: Home, show: isLandingPage },
    { href: '#about', label: 'About', icon: Info, show: isLandingPage },
    { href: '#network', label: 'Network', icon: Network, show: isLandingPage },
    { href: '#objectives', label: 'Objectives', icon: Target, show: isLandingPage },
    { href: '#contact', label: 'Feedback', icon: MessageSquare, show: isLandingPage },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100' 
          : 'bg-white/90 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
              <span className="text-white text-xl">🍱</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-base tracking-tight">
                No Food Waste
              </h1>
              <p className="text-[10px] font-medium text-gray-500 tracking-wider">
                Zero Waste Zero Hunger Mission
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.show && (
                <a 
                  key={link.href}
                  href={link.href}
                  className="group relative px-2 py-2 text-base font-medium text-gray-700 hover:text-orange-600 transition-colors duration-200"
                >
                  <span className="flex items-center gap-1.5">
                    {link.label}
                  </span>
                  <span className="absolute inset-x-2 bottom-0 h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </a>
              )
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800">{user.name || user.username}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button
                        onClick={() => { navigate('/dashboard'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-base text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </button>
                      <div className="border-t border-gray-100 my-1.5" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-base text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2.5 text-base font-medium text-gray-700 hover:text-orange-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/volunteer/register"
                  className="px-6 py-2.5 text-base font-medium text-gray-700 hover:text-orange-600 transition-colors"
                >
                  Join as Volunteer
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              {navLinks.map((link) => (
                link.show && (
                  <a 
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                )
              ))}
            </div>
            
            {user ? (
              <div className="border-t border-gray-100 mt-4 pt-4 space-y-1">
                <button 
                  onClick={() => { navigate('/dashboard'); setMenuOpen(false); }} 
                  className="w-full flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button 
                  onClick={() => { handleLogout(); setMenuOpen(false); }} 
                  className="w-full flex items-center gap-3 px-4 py-3 text-base text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
                <Link 
                  to="/login" 
                  onClick={() => setMenuOpen(false)}
                  className="block text-center px-4 py-3 text-base text-gray-700 font-medium hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/volunteer/register" 
                  onClick={() => setMenuOpen(false)}
                  className="block text-center px-4 py-3 text-base text-gray-700 font-medium hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  Join as Volunteer
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}