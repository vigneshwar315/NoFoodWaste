import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 text-white relative overflow-hidden" id="contact">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                <span className="text-white text-3xl">🍱</span>
              </div>
              <div className="leading-tight">
                <div className="font-bold text-orange-400 text-lg uppercase tracking-wider">NO FOOD WASTE</div>
                <div className="font-bold text-white text-sm uppercase tracking-wider opacity-90">MANAGEMENT SYSTEM</div>
              </div>
            </div>
            <p className="text-teal-200 text-base leading-relaxed">
              Bridging the gap between surplus food and hunger. Every meal saved is a life changed.
            </p>
            <div className="flex items-center gap-2 text-teal-300">
              <Heart className="w-4 h-4 text-orange-400" />
              <span className="text-sm">Making a difference, one meal at a time</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-bold text-orange-400 text-lg uppercase tracking-wider border-l-4 border-orange-400 pl-4">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="#home" className="text-teal-200 hover:text-orange-400 transition-all duration-300 inline-flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-teal-200 hover:text-orange-400 transition-all duration-300 inline-flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </a>
              </li>
              <li>
                <a href="#objectives" className="text-teal-200 hover:text-orange-400 transition-all duration-300 inline-flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Objectives
                </a>
              </li>
              <li>
                <a href="#network" className="text-teal-200 hover:text-orange-400 transition-all duration-300 inline-flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Network
                </a>
              </li>
            </ul>
          </div>

          {/* Get Involved */}
          <div className="space-y-6">
            <h3 className="font-bold text-orange-400 text-lg uppercase tracking-wider border-l-4 border-orange-400 pl-4">
              Get Involved
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/volunteer/register" className="text-teal-200 hover:text-orange-400 transition-all duration-300 inline-flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Register as Volunteer
                </Link>
              </li>
              <li>
                <Link to="/login/donor" className="text-teal-200 hover:text-orange-400 transition-all duration-300 inline-flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Donate Food
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-teal-200 hover:text-orange-400 transition-all duration-300 inline-flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Partner Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="font-bold text-orange-400 text-lg uppercase tracking-wider border-l-4 border-orange-400 pl-4">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/30 transition-colors">
                  <Mail className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <span className="text-teal-200 leading-relaxed block">info@nofoodwaste.org</span>
                  <span className="text-teal-400 text-xs">Email us anytime</span>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/30 transition-colors">
                  <Phone className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <span className="text-teal-200 leading-relaxed block">1800-XXX-XXXX</span>
                  <span className="text-teal-400 text-xs">Toll Free Number</span>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/30 transition-colors">
                  <MapPin className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <span className="text-teal-200 leading-relaxed block">India</span>
                  <span className="text-teal-400 text-xs">Serving Nationwide</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-teal-700/50 mt-20 pt-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left space-y-2">
              <p className="text-teal-300 text-base font-medium">
                © 2025 No Food Waste NGO. All rights reserved.
              </p>
              <p className="text-teal-400 text-sm">
                Inspired by FSSAI Save Food Share Food Initiative
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-teal-300 text-sm">
                <Heart className="w-4 h-4 text-orange-400" />
                <span>Made with passion for humanity</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
