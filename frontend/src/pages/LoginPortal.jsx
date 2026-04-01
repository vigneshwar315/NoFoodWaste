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
  Info,
  Phone,
  Mail
} from 'lucide-react';
import Navbar from '../components/Navbar';

const roles = [
  {
    key: 'admin',
    icon: Shield,
    title: 'Admin',
    subtitle: 'NGO Head',
    desc: 'Full system control, user management, and analytics dashboard access.',
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    accentBg: 'bg-teal-600',
    borderColor: 'border-teal-100',
    link: '/login/admin',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-700',
    accent: 'text-teal-600',
  },
  {
    key: 'employee',
    icon: Users,
    title: 'Employee',
    subtitle: 'Sub Admin',
    desc: 'Handle donor calls, create donation requests, and manage operations.',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    accentBg: 'bg-blue-600',
    borderColor: 'border-blue-100',
    link: '/login/employee',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    accent: 'text-blue-600',
  },
  {
    key: 'driver',
    icon: Car,
    title: 'Driver',
    subtitle: 'Delivery Partner',
    desc: 'Accept delivery tasks, track live location, and optimize routes.',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    accentBg: 'bg-orange-600',
    borderColor: 'border-orange-100',
    link: '/login/driver',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
    accent: 'text-orange-600',
  },
  {
    key: 'volunteer',
    icon: Heart,
    title: 'Volunteer',
    subtitle: 'Community Helper',
    desc: 'Assist in deliveries and respond to nearby requests.',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    accentBg: 'bg-green-600',
    borderColor: 'border-green-100',
    link: '/login/volunteer',
    badgeBg: 'bg-green-50',
    badgeText: 'text-green-700',
    accent: 'text-green-600',
    registerLink: '/volunteer/register',
  },
  {
    key: 'donor',
    icon: Gift,
    title: 'Donor',
    subtitle: 'Food Donor',
    desc: 'Donate surplus food and track donations in real-time.',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    accentBg: 'bg-rose-600',
    borderColor: 'border-rose-100',
    link: '/login/donor',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    accent: 'text-rose-600',
  },
];

export default function LoginPortal() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* Navbar */}
      <Navbar />

      {/* Main Content (FIXED spacing for navbar) */}
      <main className="mt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Hero Section */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 border border-orange-100 px-4 py-2 rounded-full text-xs font-semibold mb-5 tracking-wide">
              <Sparkles className="w-4 h-4" />
              Zero Waste · Zero Hunger Mission
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-3 tracking-tight">
              Welcome Back
            </h1>

            <div className="w-16 h-1 bg-orange-500 mx-auto mb-5 rounded-full" />

            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Select your role to access your dashboard and continue making a difference in the community
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            {roles.map((role, index) => {
              const Icon = role.icon;

              return (
                <Link
                  key={role.key}
                  to={role.link}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Top Accent Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${role.accentBg} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />

                  <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between mb-5">

                      {/* Icon */}
                      <div className={`w-14 h-14 ${role.iconBg} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-7 h-7 ${role.iconColor}`} />
                      </div>

                      {/* Badge */}
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${role.badgeBg} ${role.badgeText} border ${role.borderColor}`}>
                        {role.subtitle}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                      {role.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 min-h-[60px]">
                      {role.desc}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className={`${role.accent} text-sm font-semibold flex items-center gap-2`}>
                        Sign In
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>

                      {role.registerLink && (
                        <Link
                          to={role.registerLink}
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-500 text-xs hover:text-gray-700 flex items-center gap-1"
                        >
                          Register
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

            {/* Info Card */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-100 p-6">
              <div className="flex gap-4">
                <Info className="w-6 h-6 text-teal-600 mt-1" />
                <div>
                  <h4 className="text-gray-900 font-semibold mb-2">
                    Important Information
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    Drivers and Employees are registered by Admin. Volunteers can self-register.
                  </p>
                  <Link to="/volunteer/register" className="text-teal-600 text-sm font-medium">
                    Become a Volunteer →
                  </Link>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex gap-4">
                <Phone className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <h4 className="text-gray-900 font-semibold mb-2">
                    Need Assistance?
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Our support team is available 24/7.
                  </p>
                  <a href="mailto:support@nofoodwaste.org" className="text-orange-600 text-sm">
                    <Mail className="inline w-4 h-4 mr-1" />
                    support@nofoodwaste.org
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-xs">
              © 2024 No Food Waste Foundation. Together we can achieve zero hunger.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}