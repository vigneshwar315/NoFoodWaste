import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  Shield, 
  Users, 
  Car, 
  Heart, 
  Gift, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import Navbar from '../components/Navbar';

const roles = [
  {
    key: 'admin',
    icon: Shield,
    title: 'Admin',
    subtitle: 'NGO Head',
    desc: 'Full system control, user management, and analytics dashboard access',
    color: 'from-teal-600 to-teal-800',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    hoverBorder: 'hover:border-teal-400',
    link: '/login/admin',
    badge: 'bg-teal-100 text-teal-700',
  },
  {
    key: 'employee',
    icon: Users,
    title: 'Employee',
    subtitle: 'Sub Admin',
    desc: 'Handle donor calls, create donation requests, and manage operations',
    color: 'from-blue-500 to-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    hoverBorder: 'hover:border-blue-400',
    link: '/login/employee',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    key: 'driver',
    icon: Car,
    title: 'Driver',
    subtitle: 'Delivery Partner',
    desc: 'Accept delivery tasks, live location tracking, pickup & delivery management',
    color: 'from-orange-500 to-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    hoverBorder: 'hover:border-orange-400',
    link: '/login/driver',
    badge: 'bg-orange-100 text-orange-700',
  },
  {
    key: 'volunteer',
    icon: Heart,
    title: 'Volunteer',
    subtitle: 'Community Helper',
    desc: 'Assist in deliveries, respond to nearby requests, serve your community',
    color: 'from-green-500 to-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    hoverBorder: 'hover:border-green-400',
    link: '/login/volunteer',
    badge: 'bg-green-100 text-green-700',
    registerLink: '/volunteer/register',
  },
  {
    key: 'donor',
    icon: Gift,
    title: 'Donor',
    subtitle: 'Food Donor',
    desc: 'Donate surplus food, track donations in real-time, secure OTP login',
    color: 'from-rose-500 to-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    hoverBorder: 'hover:border-rose-400',
    link: '/login/donor',
    badge: 'bg-rose-100 text-rose-700',
  },
];

export default function LoginPortal() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
              <Sparkles className="w-4 h-4" />
              No Food Waste Management System
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              Welcome Back!
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
              Select your role to access your dashboard and continue making a difference
            </p>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <Link
                  key={role.key}
                  to={role.link}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`group relative bg-white rounded-3xl border-2 ${role.borderColor} ${role.hoverBorder} p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden`}
                >
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon & Badge Row */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${role.badge} uppercase tracking-wider`}>
                        {role.subtitle}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-black text-gray-900 text-2xl mb-3 group-hover:text-gray-800">
                      {role.title}
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed mb-6">
                      {role.desc}
                    </p>

                    {/* Action Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-orange-500 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                        Sign In
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                      
                      {role.registerLink && (
                        <Link
                          to={role.registerLink}
                          onClick={(e) => e.stopPropagation()}
                          className="text-teal-600 text-sm font-semibold hover:text-teal-700 flex items-center gap-1 group/link"
                        >
                          Register
                          <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Decorative Corner */}
                  <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-500 blur-2xl`}></div>
                </Link>
              );
            })}
          </div>

          {/* Info Box */}
          <div className="mt-16 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8 border border-teal-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-lg mb-2">Important Information</h4>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Drivers and Employees are registered by the Admin only. Volunteers can self-register through our portal.
                </p>
                <Link 
                  to="/volunteer/register" 
                  className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition-colors"
                >
                  Become a Volunteer today
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-gray-400 text-sm mt-12">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@nofoodwaste.org" className="text-orange-500 hover:underline font-medium">
              support@nofoodwaste.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
