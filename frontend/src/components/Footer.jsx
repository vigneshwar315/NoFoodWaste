import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-teal-900 text-white scroll-mt-20" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🍱</span>
              </div>
              <div>
                <div className="font-bold text-orange-400 text-sm">NO FOOD WASTE</div>
                <div className="font-bold text-white text-xs">MANAGEMENT SYSTEM</div>
              </div>
            </div>
            <p className="text-teal-200 text-sm leading-relaxed">
              Bridging the gap between surplus food and hunger. Every meal saved is a life changed.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-orange-400 mb-4 uppercase text-sm tracking-wide">Quick Links</h3>
            <ul className="space-y-2 text-teal-200 text-sm">
              <li><a href="#home" className="hover:text-orange-400 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-orange-400 transition-colors">About Us</a></li>
              <li><a href="#objectives" className="hover:text-orange-400 transition-colors">Objectives</a></li>
              <li><a href="#network" className="hover:text-orange-400 transition-colors">Network</a></li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="font-bold text-orange-400 mb-4 uppercase text-sm tracking-wide">Get Involved</h3>
            <ul className="space-y-2 text-teal-200 text-sm">
              <li><Link to="/volunteer/register" className="hover:text-orange-400 transition-colors">Register as Volunteer</Link></li>
              <li><Link to="/login/donor" className="hover:text-orange-400 transition-colors">Donate Food</Link></li>
              <li><Link to="/login" className="hover:text-orange-400 transition-colors">Partner Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-orange-400 mb-4 uppercase text-sm tracking-wide">Contact Us</h3>
            <ul className="space-y-2 text-teal-200 text-sm">
              <li className="flex items-start gap-2">
                <span>📧</span>
                <span>info@nofoodwaste.org</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📞</span>
                <span>1800-XXX-XXXX (Toll Free)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-teal-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-teal-300 text-sm">
            © 2025 No Food Waste NGO. All rights reserved.
          </p>
          <p className="text-teal-400 text-xs">
            Inspired by FSSAI Save Food Share Food Initiative
          </p>
        </div>
      </div>
    </footer>
  );
}
