import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const roles = [
  {
    key: 'admin',
    icon: '👑',
    title: 'Admin',
    subtitle: 'NGO Head',
    desc: 'Full system control, user management, analytics',
    color: 'from-teal-600 to-teal-800',
    border: 'border-teal-200 hover:border-teal-400',
    link: '/login/admin',
    badge: 'bg-teal-100 text-teal-700',
  },
  {
    key: 'employee',
    icon: '👨‍💼',
    title: 'Employee',
    subtitle: 'Sub Admin',
    desc: 'Handle donor calls, create donation requests',
    color: 'from-blue-500 to-blue-700',
    border: 'border-blue-200 hover:border-blue-400',
    link: '/login/employee',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    key: 'driver',
    icon: '🚗',
    title: 'Driver',
    subtitle: 'Delivery Partner',
    desc: 'Accept tasks, live location tracking, pickup & delivery',
    color: 'from-orange-500 to-orange-700',
    border: 'border-orange-200 hover:border-orange-400',
    link: '/login/driver',
    badge: 'bg-orange-100 text-orange-700',
  },
  {
    key: 'volunteer',
    icon: '🤝',
    title: 'Volunteer',
    subtitle: 'Community Helper',
    desc: 'Assist in deliveries, nearby requests, serve community',
    color: 'from-green-500 to-green-700',
    border: 'border-green-200 hover:border-green-400',
    link: '/login/volunteer',
    badge: 'bg-green-100 text-green-700',
    registerLink: '/volunteer/register',
  },
  {
    key: 'donor',
    icon: '❤️',
    title: 'Donor',
    subtitle: 'Food Donor',
    desc: 'Donate surplus food, real-time tracking, OTP login',
    color: 'from-rose-500 to-rose-700',
    border: 'border-rose-200 hover:border-rose-400',
    link: '/login/donor',
    badge: 'bg-rose-100 text-rose-700',
  },
];

export default function LoginPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <span>🍱</span> No Food Waste Management System
            </div>
            <h1 className="text-4xl font-black text-teal-900 mb-3">Welcome Back!</h1>
            <p className="text-gray-500 text-lg">Select your role to continue</p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {roles.map((role) => (
              <Link
                key={role.key}
                to={role.link}
                className={`group bg-white rounded-2xl border-2 ${role.border} p-6 transition-all duration-300 card-hover flex flex-col`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {role.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-black text-gray-800 text-xl">{role.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${role.badge}`}>
                    {role.subtitle}
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">{role.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-orange-500 font-semibold text-sm group-hover:underline">Login →</span>
                  {role.registerLink && (
                    <Link
                      to={role.registerLink}
                      onClick={(e) => e.stopPropagation()}
                      className="text-green-600 text-xs font-medium hover:underline"
                    >
                      Register instead
                    </Link>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom note */}
          <p className="text-center text-gray-400 text-sm mt-10">
            Drivers & Employees are registered by the Admin only.{' '}
            <Link to="/volunteer/register" className="text-orange-500 hover:underline font-semibold">
              Volunteers can self-register here.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
