import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronLeft, ChevronRight, ArrowRight, Award, Users, Truck, Heart, Globe, TrendingUp, Sparkles, Clock, Shield, Users2, Leaf } from 'lucide-react';

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

// Impact metrics data
const impactMetrics = [
  { value: '2.5M+', label: 'Meals Saved', icon: <Heart className="w-6 h-6" />, color: 'from-rose-400 to-rose-500' },
  { value: '500+', label: 'Active Volunteers', icon: <Users className="w-6 h-6" />, color: 'from-blue-400 to-blue-500' },
  { value: '150+', label: 'Partner Agencies', icon: <Globe className="w-6 h-6" />, color: 'from-emerald-400 to-emerald-500' },
  { value: '50K+', label: 'Beneficiaries', icon: <Users2 className="w-6 h-6" />, color: 'from-orange-400 to-orange-500' },
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

        {/* ─── Impact Metrics Section ───────────────────────────────────────────────────── */}
        <section className="py-16 bg-gradient-to-br from-white to-gray-50 -mt-20 relative z-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {impactMetrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${metric.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}>
                    {metric.icon}
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">{metric.value}</div>
                  <div className="text-gray-500 text-sm uppercase tracking-wide">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Objectives Section ───────────────────────────────────────────────────── */}
        <section className="py-28 bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900" id="objectives">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 text-sm font-medium tracking-wide">OUR APPROACH</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                Our Mission in Action
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-500 mx-auto rounded-full"></div>
              <p className="text-teal-200 text-lg mt-6 max-w-2xl mx-auto">
                A three-pillar strategy to create a sustainable, hunger-free future
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
              {[
                {
                  title: 'Aware',
                  icon: <Globe className="w-12 h-12 text-orange-400" />,
                  desc: 'Mobilize people to minimize their food wastage through widespread awareness programs across the country by Food Recovery Agencies.',
                  color: 'from-orange-500/20 to-orange-600/10',
                  features: ['Community Outreach', 'Educational Programs', 'Digital Campaigns']
                },
                {
                  title: 'Recover',
                  icon: <Truck className="w-12 h-12 text-orange-400" />,
                  desc: 'Facilitate collection of surplus food from events, hotels, households, and redirect it to hunger spots efficiently.',
                  color: 'from-orange-500/20 to-orange-600/10',
                  features: ['Smart Logistics', 'Real-time Tracking', 'Quality Assurance']
                },
                {
                  title: 'Redistribute',
                  icon: <Heart className="w-12 h-12 text-orange-400" />,
                  desc: 'Ensure safe, timely food delivery to beneficiaries following FSSAI guidelines (4-hour food validity window).',
                  color: 'from-orange-500/20 to-orange-600/10',
                  features: ['Safe Delivery', 'Beneficiary Network', 'Impact Monitoring']
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-orange-400/50 transition-all duration-500 hover:transform hover:-translate-y-3 group"
                >
                  <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                  <h3 className="text-2xl font-bold text-orange-400 mb-4 text-center">{item.title}</h3>
                  <p className="text-teal-100 leading-relaxed text-center mb-6">{item.desc}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {item.features.map((feature, fIdx) => (
                      <span key={fIdx} className="text-xs bg-white/10 rounded-full px-3 py-1 text-teal-200">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── News Ticker ─────────────────────────────────────────────────────────── */}
        <div className="bg-amber-50 border-y border-amber-200 py-4 overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap animate-marquee">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="text-sm text-teal-800 flex items-center gap-3">
                <span className="text-orange-500 text-lg">✦</span> {item}
              </span>
            ))}
          </div>
        </div>

        {/* ─── Action Cards Section ─────────────────────────────────────────────────── */}
        <section className="py-28 bg-white" id="network">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Register Banner */}
            <div className="bg-gradient-to-r from-orange-100 via-amber-50 to-orange-100 rounded-2xl p-10 mb-24 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-orange-200">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Join Our Growing Network</h3>
                <p className="text-gray-700 text-lg">Surplus Food Distribution Agencies across India — become part of our movement</p>
              </div>
              <Link
                to="/volunteer/register"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-10 py-4 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap text-lg"
              >
                REGISTER NOW →
              </Link>
            </div>

            {/* Two Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="group bg-gradient-to-br from-gray-50 to-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100">
                <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-500"></div>
                <div className="p-12 text-center">
                  <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-500">🏢</div>
                  <h3 className="text-2xl font-bold text-orange-500 mb-4">Food Donating Agencies</h3>
                  <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                    Restaurants, hotels, caterers, and households with surplus food can register and donate instantly or schedule future donations.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    <span className="text-xs bg-orange-100 text-orange-700 rounded-full px-3 py-1">Instant Donation</span>
                    <span className="text-xs bg-orange-100 text-orange-700 rounded-full px-3 py-1">Schedule Pickup</span>
                    <span className="text-xs bg-orange-100 text-orange-700 rounded-full px-3 py-1">Tax Benefits</span>
                  </div>
                  <Link
                    to="/login/donor"
                    className="inline-flex items-center gap-3 text-orange-500 font-semibold hover:text-orange-600 transition-colors group-hover:gap-4 text-lg"
                  >
                    Learn more <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
              <div className="group bg-gradient-to-br from-gray-50 to-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100">
                <div className="h-2 bg-gradient-to-r from-teal-400 to-teal-500"></div>
                <div className="p-12 text-center">
                  <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-500">📍</div>
                  <h3 className="text-2xl font-bold text-teal-600 mb-4">Food Donation Points</h3>
                  <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                    Hunger spots and beneficiary centers managed by the NGO admin where collected food is delivered by our driver/volunteer network.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    <span className="text-xs bg-teal-100 text-teal-700 rounded-full px-3 py-1">Network of 150+ Points</span>
                    <span className="text-xs bg-teal-100 text-teal-700 rounded-full px-3 py-1">Regular Distribution</span>
                  </div>
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
        <section className="py-28 bg-gray-50" id="about">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Mission Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-6 text-center">What Is Our Mission</h3>
                <p className="text-blue-100 text-lg leading-relaxed mb-8 text-center">
                  Our No Food Waste NGO has been formed to help solve India's food waste and hunger crisis by working with various partner organizations, Food Recovery Agencies, volunteers, and donors. We ensure no edible food goes to waste.
                </p>
                <div className="flex justify-center">
                  <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold px-8 py-3 rounded-full transition-all inline-flex items-center justify-center gap-2">
                    READ MORE <ArrowRight size={18} />
                  </button>
                </div>
              </div>
              {/* Why Food Waste Card */}
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-6 text-center">Why Prevention Matters</h3>
                <p className="text-emerald-100 text-lg leading-relaxed mb-8 text-center">
                  1.3 metric gigatons of edible food is wasted every year and at least 795 million people are undernourished worldwide. More than a third of all the food produced never reaches a table.
                </p>
                <div className="flex justify-center">
                  <button className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-bold px-8 py-3 rounded-full transition-all inline-flex items-center justify-center gap-2">
                    READ MORE <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Stats Bubbles Section ───────────────────────────────────────────────── */}
        <section className="py-28 bg-white" id="stats">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-orange-100 rounded-full px-4 py-2 mb-6">
                <Leaf className="w-4 h-4 text-orange-500" />
                <span className="text-orange-600 text-sm font-medium tracking-wide">IMPACT NUMBERS</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Surplus Food Sharing
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-teal-600 mx-auto rounded-full mb-6"></div>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Coalition of Partners To Prevent Food Waste And Food Loss
              </p>
            </div>

            {/* Stats Bubbles */}
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-10 lg:gap-14 mb-28">
              {statsBubbles.map((b, i) => (
                <div
                  key={i}
                  className={`${b.color} w-36 h-36 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full flex flex-col items-center justify-center text-white text-center p-4 shadow-2xl hover:scale-110 transition-all duration-500 cursor-default animate-float backdrop-blur-sm`}
                  style={{ animationDelay: b.delay }}
                >
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">{b.stat}</span>
                  <span className="text-xs sm:text-sm leading-tight mt-3 px-2 font-medium opacity-95">{b.label}</span>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-12 border-l-8 border-orange-500 shadow-xl">
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
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-20">
              {[
                { label: 'Partners', color: 'bg-gradient-to-r from-orange-500 to-orange-600', link: '/login' },
                { label: 'Donors', color: 'bg-gradient-to-r from-emerald-500 to-emerald-600', link: '/login/donor' },
                { label: 'Beneficiaries', color: 'bg-gradient-to-r from-sky-500 to-sky-600', link: '/' },
                { label: 'Volunteers', color: 'bg-gradient-to-r from-amber-500 to-amber-600', link: '/volunteer/register' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.link}
                  className={`${item.color} hover:brightness-110 text-white font-semibold px-10 py-4 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base inline-flex items-center justify-center gap-2`}
                >
                  {item.label}
                  <ArrowRight size={16} className="opacity-80" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How It Works ─────────────────────────────────────────────────────────── */}
        <section className="py-28 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-teal-100 rounded-full px-4 py-2 mb-6">
                <Clock className="w-4 h-4 text-teal-600" />
                <span className="text-teal-600 text-sm font-medium tracking-wide">SIMPLE PROCESS</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-teal-800 mb-6">
                How It Works
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full mb-8"></div>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                A seamless 4-step process to save food and fight hunger with our streamlined system
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
                    bgColor: 'from-blue-50 to-blue-100',
                    detail: '24/7 Support'
                  },
                  { 
                    step: '02', 
                    icon: '✅', 
                    title: 'Validation', 
                    desc: 'Food quantity (minimum 30 people) and 4-hour FSSAI validity checked',
                    color: 'from-emerald-500 to-emerald-600',
                    bgColor: 'from-emerald-50 to-emerald-100',
                    detail: 'Quality Assured'
                  },
                  { 
                    step: '03', 
                    icon: '🚗', 
                    title: 'Driver Assigned', 
                    desc: 'Nearest available driver is automatically assigned for efficient pickup',
                    color: 'from-purple-500 to-purple-600',
                    bgColor: 'from-purple-50 to-purple-100',
                    detail: 'Real-time Tracking'
                  },
                  { 
                    step: '04', 
                    icon: '🏘️', 
                    title: 'Delivered', 
                    desc: 'Food delivered to nearest hunger spot. Zero waste achieved!',
                    color: 'from-orange-500 to-orange-600',
                    bgColor: 'from-orange-50 to-orange-100',
                    detail: 'Impact Reported'
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
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                          {s.desc}
                        </p>
                        <span className="text-xs text-teal-600 font-medium bg-teal-50 rounded-full px-3 py-1">
                          {s.detail}
                        </span>
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
            <div className="text-center mt-20">
              <div className="inline-flex items-center gap-3 bg-orange-100 px-8 py-4 rounded-full shadow-md">
                <span className="text-orange-600 font-semibold text-lg">Join our efficient food rescue system</span>
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Final CTA Section ────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-r from-orange-600 to-orange-500 py-28 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">Ready to Make a Difference?</h2>
            <p className="text-orange-100 text-xl mb-16 max-w-3xl mx-auto text-lg leading-relaxed">
              Join our network of volunteers, donors, and drivers making every meal count.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/volunteer/register"
                className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-12 py-5 rounded-full transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg inline-flex items-center justify-center gap-2"
              >
                Join as Volunteer
                <Users2 className="w-5 h-5" />
              </Link>
              <Link
                to="/login/donor"
                className="border-2 border-white text-white hover:bg-white/10 font-bold px-12 py-5 rounded-full transition-all text-lg inline-flex items-center justify-center gap-2"
              >
                Donate Food Now
                <Heart className="w-5 h-5" />
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
            transform: translateY(-12px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}