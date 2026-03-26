import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronLeft, ChevronRight, ArrowRight, Award, Users, Truck, Heart, Globe, TrendingUp } from 'lucide-react';

// Hero slides data
const heroSlides = [
  {
    bg: 'from-teal-700/85 to-teal-700/70',
    image: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=1920&q=80',
    title: 'SAVE FOOD,\nSHARE FOOD',
    subtitle: 'This initiative brings together all stakeholders of the community to prevent food being lost or wasted throughout its supply chain.',
  },
  {
    bg: 'from-teal-900/85 to-teal-700/70',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1920&q=80',
    title: 'ZERO HUNGER,\nZERO WASTE',
    subtitle: 'Every meal saved is a step towards ending hunger. Join our network of donors, volunteers, and drivers making a difference daily.',
  },
  {
    bg: 'from-teal-800/85 to-teal-600/70',
    image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1920&q=80',
    title: 'END HUNGER\nTODAY',
    subtitle: '1.3 billion tonnes of food is wasted annually while 800 million people go hungry. Be the change.',
  },
];

// Stats bubbles data
const statsBubbles = [
  { color: 'bg-emerald-500', stat: '196M', label: 'Under-nourished people in India', delay: '0s' },
  { color: 'bg-amber-500', stat: '25%', label: 'Hungry people worldwide live in India', delay: '0.2s' },
  { color: 'bg-sky-500', stat: '10%', label: "World's total food production by India", delay: '0.4s' },
  { color: 'bg-orange-500', stat: '33%', label: 'Children under 5 are stunted', delay: '0.1s' },
  { color: 'bg-rose-500', stat: '31.1', label: "India's Global Hunger Index score", delay: '0.3s' },
  { color: 'bg-violet-500', stat: '40%', label: 'Food never reaches the table', delay: '0.5s' },
];

// News ticker items
const tickerItems = [
  'A Memorandum of Understanding has been signed for creation of a Resource Centre for implementation of the Save Food Share Food initiative.',
  'FSSAI guidelines: Food is valid for 4 hours from preparation time under proper storage.',
  'Join our network of 500+ volunteers helping deliver food across the city every day.',
  'Become a Food Donating Agency and reduce your surplus food wastage today.',
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);

  return (
    <div className="min-h-screen bg-white" id="home">
      <Navbar />

      <main>
        {/* ─── Hero Carousel ─────────────────────────────────────────────────────────── */}
        <section className="relative h-screen max-h-[900px] min-h-[700px] overflow-hidden">
          {/* Background Slides */}
          {heroSlides.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-1500 ease-out ${i === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
                }`}
            >
              <img
                src={slide.image}
                alt="hero"
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`} />
              {/* Overlay Pattern */}
              <div className="absolute inset-0 bg-black/10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>
          ))}

          {/* Content */}
          <div className="relative z-20 flex items-center h-full">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
              <div className="max-w-4xl lg:max-w-6xl">
                <div className="space-y-8">
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] whitespace-pre-line drop-shadow-2xl animate-fadeInUp text-left">
                    {heroSlides[currentSlide].title}
                  </h1>
                  <p className="text-white/95 text-lg md:text-xl lg:text-2xl leading-relaxed max-w-4xl drop-shadow-lg animate-fadeInUp animation-delay-200 text-left">
                    {heroSlides[currentSlide].subtitle}
                  </p>
                  <div className="flex flex-wrap gap-6 animate-fadeInUp animation-delay-400 justify-start">
                    <a
                      href="#objectives"
                      className="group bg-teal-800 hover:bg-teal-900 text-white font-semibold px-12 py-5 rounded-full transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 text-lg inline-flex items-center justify-center gap-3"
                    >
                      Know More
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                    <Link
                      to="/login/donor"
                      className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-12 py-5 rounded-full transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 text-lg inline-flex items-center gap-3"
                    >
                      Donate Food
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Carousel Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
            aria-label="Next slide"
          >
            <ChevronRight size={32} />
          </button>

          {/* Enhanced Slide Dots */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-4">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-3 rounded-full transition-all duration-500 ${i === currentSlide
                  ? 'bg-orange-500 w-12 shadow-lg shadow-orange-500/50'
                  : 'bg-white/50 hover:bg-white/80 w-3'
                  }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* ─── Objectives Section ───────────────────────────────────────────────────── */}
        <section className="py-24 bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900" id="objectives">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                Objectives
              </h2>
              <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
              <p className="text-teal-200 text-lg mt-6 max-w-2xl mx-auto">
                Our three-pillar approach to fighting food waste and hunger
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  title: 'Aware',
                  icon: <Globe className="w-12 h-12 text-orange-400" />,
                  desc: 'Mobilize people to minimize their food wastage through widespread awareness programs across the country by Food Recovery Agencies.',
                  color: 'from-orange-500/20 to-orange-600/10'
                },
                {
                  title: 'Recover',
                  icon: <Truck className="w-12 h-12 text-orange-400" />,
                  desc: 'Facilitate collection of surplus food from events, hotels, households, and redirect it to hunger spots efficiently.',
                  color: 'from-orange-500/20 to-orange-600/10'
                },
                {
                  title: 'Redistribute',
                  icon: <Heart className="w-12 h-12 text-orange-400" />,
                  desc: 'Ensure safe, timely food delivery to beneficiaries following FSSAI guidelines (4-hour food validity window).',
                  color: 'from-orange-500/20 to-orange-600/10'
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-orange-400/50 transition-all duration-300 hover:transform hover:-translate-y-2 text-center"
                >
                  <div className="mb-6 flex justify-center">{item.icon}</div>
                  <h3 className="text-2xl font-bold text-orange-400 mb-4">{item.title}</h3>
                  <p className="text-teal-100 leading-relaxed text-center">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── News Ticker ─────────────────────────────────────────────────────────── */}
        <div className="bg-amber-50 border-y border-amber-200 py-3 overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap animate-marquee">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="text-sm text-teal-800 flex items-center gap-3">
                <span className="text-orange-500 text-lg">✦</span> {item}
              </span>
            ))}
          </div>
        </div>

        {/* ─── Action Cards Section ─────────────────────────────────────────────────── */}
        <section className="py-24 bg-white" id="network">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Register Banner */}
            <div className="bg-gradient-to-r from-orange-100 to-amber-50 rounded-2xl p-8 mb-20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Join Our Network</h3>
                <p className="text-gray-700">Surplus Food Distribution Agencies across India — become part of our movement</p>
              </div>
              <Link
                to="/volunteer/register"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full transition-all shadow-md hover:shadow-lg whitespace-nowrap"
              >
                REGISTER NOW →
              </Link>
            </div>

            {/* Two Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="group bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="h-3 bg-orange-500"></div>
                <div className="p-12 text-center">
                  <div className="text-7xl mb-8">🏢</div>
                  <h3 className="text-2xl font-bold text-orange-500 mb-6">Food Donating Agencies</h3>
                  <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                    Restaurants, hotels, caterers, and households with surplus food can register and donate instantly or schedule future donations.
                  </p>
                  <Link
                    to="/login/donor"
                    className="inline-flex items-center gap-3 text-orange-500 font-semibold hover:text-orange-600 transition-colors group-hover:gap-4 text-lg"
                  >
                    Learn more <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
              <div className="group bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="h-3 bg-teal-500"></div>
                <div className="p-12 text-center">
                  <div className="text-7xl mb-8">📍</div>
                  <h3 className="text-2xl font-bold text-teal-600 mb-6">Food Donation Points</h3>
                  <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                    Hunger spots and beneficiary centers managed by the NGO admin where collected food is delivered by our driver/volunteer network.
                  </p>
                  <a
                    href="#network"
                    className="inline-flex items-center gap-3 text-teal-600 font-semibold hover:text-teal-700 transition-colors group-hover:gap-4 text-lg"
                  >
                    Learn more <ArrowRight size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Mission & Impact Section ─────────────────────────────────────────────── */}
        <section className="py-24 bg-gray-50" id="about">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Mission Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-500 text-center">
                <div className="flex justify-center mb-6">
                  <Award className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">What Is Our Mission</h3>
                <p className="text-blue-100 text-lg leading-relaxed mb-8">
                  Our No Food Waste NGO has been formed to help solve India's food waste and hunger crisis by working with various partner organizations, Food Recovery Agencies, volunteers, and donors. We ensure no edible food goes to waste.
                </p>
                <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold px-8 py-3 rounded-full transition-all inline-flex items-center justify-center">
                  READ MORE
                </button>
              </div>
              {/* Why Food Waste Card */}
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-500 text-center">
                <div className="flex justify-center mb-6">
                  <TrendingUp className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">Why Prevention Matters</h3>
                <p className="text-emerald-100 text-lg leading-relaxed mb-8">
                  1.3 metric gigatons of edible food is wasted every year and at least 795 million people are undernourished worldwide. More than a third of all the food produced never reaches a table.
                </p>
                <button className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-bold px-8 py-3 rounded-full transition-all inline-flex items-center justify-center">
                  READ MORE
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Stats Bubbles Section ───────────────────────────────────────────────── */}
        <section className="py-24 bg-white" id="stats">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-orange-500 mb-4">
                Surplus Food Sharing
              </h2>
              <div className="w-24 h-1 bg-teal-600 mx-auto rounded-full mb-6"></div>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Coalition of Partners To Prevent Food Waste And Food Loss
              </p>
            </div>

            {/* Stats Bubbles */}
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 lg:gap-12 mb-20">
              {statsBubbles.map((b, i) => (
                <div
                  key={i}
                  className={`${b.color} w-32 h-32 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-full flex flex-col items-center justify-center text-white text-center p-3 shadow-xl hover:scale-110 transition-all duration-300 cursor-default animate-float`}
                  style={{ animationDelay: b.delay }}
                >
                  <span className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">{b.stat}</span>
                  <span className="text-xs sm:text-sm leading-tight mt-2 px-1 font-medium">{b.label}</span>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="bg-amber-50 rounded-3xl p-12 border-l-8 border-orange-500 shadow-lg">
              <div className="max-w-5xl mx-auto">
                <p className="text-gray-700 text-lg leading-relaxed mb-6 text-center">
                  India's primary issue is lack of cold chains and adequate storage facilities leading to a large amount of loss along the supply chain. This, coupled with rising incomes and lack of awareness on the issue of food waste, plays an important role in India's contribution to environmental degradation today.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed text-center">
                  Not only do we need to put surplus food back into the food chain but we also need to secure food for future generations at a low environmental cost.
                </p>
              </div>
            </div>

            {/* Role Badges */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-16">
              {[
                { label: 'Partners', color: 'bg-orange-500', link: '/login' },
                { label: 'Donors', color: 'bg-emerald-500', link: '/login/donor' },
                { label: 'Beneficiaries', color: 'bg-sky-500', link: '/' },
                { label: 'Volunteers', color: 'bg-amber-500', link: '/volunteer/register' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.link}
                  className={`${item.color} hover:brightness-110 text-white font-semibold px-8 py-3 rounded-full transition-all shadow-md hover:shadow-lg text-base inline-flex items-center justify-center`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How It Works ─────────────────────────────────────────────────────────── */}
        <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-teal-800 mb-6">
                How It Works
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full mb-8"></div>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                A simple 4-step process to save food and fight hunger with our streamlined system
              </p>
            </div>
            
            {/* Process Flow */}
            <div className="relative">
              {/* Connection Line */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 -translate-y-1/2 z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative z-10">
                {[
                  { 
                    step: '01', 
                    icon: '📞', 
                    title: 'Donor Calls', 
                    desc: 'Donor contacts us or uses the app to register surplus food donations',
                    color: 'from-blue-500 to-blue-600',
                    bgColor: 'from-blue-50 to-blue-100'
                  },
                  { 
                    step: '02', 
                    icon: '✅', 
                    title: 'Validation', 
                    desc: 'Food quantity (minimum 30 people) and 4-hour FSSAI validity checked',
                    color: 'from-emerald-500 to-emerald-600',
                    bgColor: 'from-emerald-50 to-emerald-100'
                  },
                  { 
                    step: '03', 
                    icon: '🚗', 
                    title: 'Driver Assigned', 
                    desc: 'Nearest available driver is automatically assigned for efficient pickup',
                    color: 'from-purple-500 to-purple-600',
                    bgColor: 'from-purple-50 to-purple-100'
                  },
                  { 
                    step: '04', 
                    icon: '🏘️', 
                    title: 'Delivered', 
                    desc: 'Food delivered to nearest hunger spot. Zero waste achieved!',
                    color: 'from-orange-500 to-orange-600',
                    bgColor: 'from-orange-50 to-orange-100'
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="relative group"
                  >
                    {/* Step Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100">
                      {/* Step Number Badge */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className={`bg-gradient-to-r ${s.color} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {s.step}
                        </div>
                      </div>
                      
                      {/* Icon Container */}
                      <div className={`bg-gradient-to-br ${s.bgColor} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:shadow-lg transition-all duration-300`}>
                        <span className="text-3xl filter drop-shadow-sm">{s.icon}</span>
                      </div>
                      
                      {/* Content */}
                      <div className="text-center">
                        <h3 className="font-bold text-xl text-gray-800 mb-4 group-hover:text-teal-700 transition-colors duration-300">
                          {s.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                    
                    {/* Arrow Connector (Mobile) */}
                    {idx < 3 && (
                      <div className="lg:hidden flex justify-center my-4">
                        <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bottom CTA */}
            <div className="text-center mt-16">
              <div className="inline-flex items-center gap-3 bg-orange-100 px-6 py-3 rounded-full">
                <span className="text-orange-600 font-semibold">Join our efficient food rescue system</span>
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Final CTA Section ────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-r from-orange-600 to-orange-500 py-24 text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">Ready to Make a Difference?</h2>
            <p className="text-orange-100 text-xl mb-16 max-w-3xl mx-auto text-lg leading-relaxed">
              Join our network of volunteers, donors, and drivers making every meal count.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/volunteer/register"
                className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-12 py-4 rounded-full transition-all shadow-xl hover:shadow-2xl text-lg inline-flex items-center justify-center"
              >
                Join as Volunteer
              </Link>
              <Link
                to="/login/donor"
                className="border-2 border-white text-white hover:bg-white/10 font-bold px-12 py-4 rounded-full transition-all text-lg inline-flex items-center justify-center"
              >
                Donate Food Now
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          display: inline-flex;
          width: max-content;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}