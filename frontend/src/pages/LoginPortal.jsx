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
    accentBg: 'bg-teal-600',
    borderColor: 'border-teal-200',
    hoverBorder: 'hover:border-teal-500',
    link: '/login/admin',
    badge: 'bg-teal-50 text-teal-700 border border-teal-200',
    accent: 'text-teal-600',
    divider: 'border-teal-100',
  },
  {
    key: 'employee',
    icon: Users,
    title: 'Employee',
    subtitle: 'Sub Admin',
    desc: 'Handle donor calls, create donation requests, and manage operations',
    color: 'from-blue-500 to-blue-700',
    accentBg: 'bg-blue-600',
    borderColor: 'border-blue-200',
    hoverBorder: 'hover:border-blue-500',
    link: '/login/employee',
    badge: 'bg-blue-50 text-blue-700 border border-blue-200',
    accent: 'text-blue-600',
    divider: 'border-blue-100',
  },
  {
    key: 'driver',
    icon: Car,
    title: 'Driver',
    subtitle: 'Delivery Partner',
    desc: 'Accept delivery tasks, live location tracking, pickup & delivery management',
    color: 'from-orange-500 to-orange-700',
    accentBg: 'bg-orange-500',
    borderColor: 'border-orange-200',
    hoverBorder: 'hover:border-orange-500',
    link: '/login/driver',
    badge: 'bg-orange-50 text-orange-700 border border-orange-200',
    accent: 'text-orange-500',
    divider: 'border-orange-100',
  },
  {
    key: 'volunteer',
    icon: Heart,
    title: 'Volunteer',
    subtitle: 'Community Helper',
    desc: 'Assist in deliveries, respond to nearby requests, serve your community',
    color: 'from-green-500 to-green-700',
    accentBg: 'bg-green-600',
    borderColor: 'border-green-200',
    hoverBorder: 'hover:border-green-500',
    link: '/login/volunteer',
    badge: 'bg-green-50 text-green-700 border border-green-200',
    accent: 'text-green-600',
    divider: 'border-green-100',
    registerLink: '/volunteer/register',
  },
  {
    key: 'donor',
    icon: Gift,
    title: 'Donor',
    subtitle: 'Food Donor',
    desc: 'Donate surplus food, track donations in real-time, secure OTP login',
    color: 'from-rose-500 to-rose-700',
    accentBg: 'bg-rose-500',
    borderColor: 'border-rose-200',
    hoverBorder: 'hover:border-rose-500',
    link: '/login/donor',
    badge: 'bg-rose-50 text-rose-700 border border-rose-200',
    accent: 'text-rose-500',
    divider: 'border-rose-100',
  },
];

export default function LoginPortal() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />

      <div className="pt-32 pb-24 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 border border-orange-200 px-5 py-2 text-xs font-semibold mb-8 tracking-[0.12em] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              No Food Waste Management System
            </div>
            <h1
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-5 tracking-tight"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: '-0.02em' }}
            >
              Welcome Back
            </h1>
            <div className="w-16 h-px bg-orange-400 mx-auto mb-6" />
            <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed font-light">
              Select your role to access your dashboard and continue making a difference
            </p>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
            {roles.map((role, index) => {
              const Icon = role.icon;
              const isHovered = hoveredCard === index;
              return (
                <Link
                  key={role.key}
                  to={role.link}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`group relative bg-white p-8 transition-all duration-300 hover:bg-gray-50 hover:shadow-lg`}
                  style={{ borderRadius: 0 }}
                >
                  {/* Top accent line on hover */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 ${role.accentBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className="flex flex-col h-full">
                    {/* Icon & Badge */}
                    <div className="flex items-start justify-between mb-8">
                      <div className={`w-14 h-14 ${role.accentBg} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300`}
                           style={{ borderRadius: 0 }}>
                        <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                      </div>
                      <span className={`text-[10px] font-semibold px-2.5 py-1 ${role.badge} tracking-[0.1em] uppercase`}
                            style={{ borderRadius: 0 }}>
                        {role.subtitle}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-gray-900 text-2xl mb-1 tracking-tight"
                      style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 600 }}
                    >
                      {role.title}
                    </h3>

                    {/* Thin divider */}
                    <div className={`w-8 h-px ${role.accentBg} mb-4 opacity-60`} />

                    {/* Description */}
                    <p className="text-gray-500 text-sm leading-relaxed flex-1 font-light mb-8">
                      {role.desc}
                    </p>

                    {/* Action Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className={`${role.accent} text-xs font-semibold tracking-[0.1em] uppercase flex items-center gap-2 group-hover:gap-3 transition-all duration-300`}>
                        Sign In
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>

                      {role.registerLink && (
                        <Link
                          to={role.registerLink}
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 text-xs font-semibold tracking-[0.08em] uppercase hover:text-gray-600 flex items-center gap-1 transition-colors duration-200"
                        >
                          Register
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Info Box */}
          <div className="mt-16 bg-white border border-gray-200 p-8" style={{ borderRadius: 0 }}>
            <div className="flex items-start gap-5">
              <div className="w-10 h-10 bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0"
                   style={{ borderRadius: 0 }}>
                <Info className="w-5 h-5 text-teal-600" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h4
                  className="text-gray-900 text-base mb-2"
                  style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 600 }}
                >
                  Important Information
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 font-light">
                  Drivers and Employees are registered by the Admin only. Volunteers can self-register through our portal.
                </p>
                <Link
                  to="/volunteer/register"
                  className="inline-flex items-center gap-2 text-teal-600 text-xs font-semibold tracking-[0.1em] uppercase hover:text-teal-700 transition-colors"
                >
                  Become a Volunteer today
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-gray-400 text-xs tracking-wide mt-12 font-light">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@nofoodwaste.org" className="text-orange-500 hover:underline">
              support@nofoodwaste.org
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}