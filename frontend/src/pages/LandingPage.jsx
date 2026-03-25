import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

// Hero slides data
const heroSlides = [
  {
    bg: 'from-orange-600/80 to-orange-400/60',
    image: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=1920&q=80',
    title: 'SAVE FOOD,\nSHARE FOOD',
    subtitle: 'This initiative brings together all stakeholders of the community to prevent food being lost or wasted throughout its supply chain.',
  },
  {
    bg: 'from-teal-800/80 to-teal-600/60',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1920&q=80',
    title: 'ZERO HUNGER,\nZERO WASTE',
    subtitle: 'Every meal saved is a step towards ending hunger. Join our network of donors, volunteers, and drivers making a difference daily.',
  },
  {
    bg: 'from-orange-700/80 to-amber-500/60',
    image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1920&q=80',
    title: 'END HUNGER\nTODAY',
    subtitle: '1.3 billion tonnes of food is wasted annually while 800 million people go hungry. Be the change.',
  },
];

// Stats bubbles data
const statsBubbles = [
  { color: 'bg-green-500', size: 'w-32 h-32 sm:w-36 sm:h-36 lg:w-44 lg:h-44', stat: '196M', label: 'Under-nourished people in India', delay: '0s' },
  { color: 'bg-yellow-500', size: 'w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36', stat: '25%', label: 'Hungry people worldwide live in India', delay: '0.4s' },
  { color: 'bg-blue-500', size: 'w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40', stat: '10%', label: "World's total food production is by India", delay: '0.8s' },
  { color: 'bg-orange-400', size: 'w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32', stat: '33%', label: 'Children under 5 are stunted', delay: '0.2s' },
  { color: 'bg-red-500', size: 'w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36', stat: '31.1', label: 'India\'s Global Hunger Index score', delay: '0.6s' },
  { color: 'bg-purple-500', size: 'w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32', stat: '40%', label: 'Food produced never reaches the table', delay: '1s' },
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
    <div className="min-h-screen scroll-mt-16" id="home">
      <Navbar />

      <main className="pt-16">
      {/* ─── Hero Carousel ─────────────────────────────────────────────────────── */}
      <section className="relative h-[calc(90vh-4rem)] min-h-[500px] overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img
              src={slide.image}
              alt="hero"
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`} />
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 flex items-center h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6 fade-in-up whitespace-pre-line drop-shadow-lg">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed max-w-xl">
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#about" className="bg-teal-800 hover:bg-teal-900 text-white font-bold px-8 py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl">
                  Know More
                </a>
                <Link to="/login/donor" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2">
                  Donate Food <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-teal-800/80 hover:bg-teal-900 text-white p-3 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-teal-800/80 hover:bg-teal-900 text-white p-3 transition-colors">
          <ChevronRight size={24} />
        </button>

        {/* Slide Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-orange-400 w-8' : 'bg-white/60'}`}
            />
          ))}
        </div>
      </section>

      {/* ─── Objectives Section ──────────────────────────────────────────────────── */}
      <section className="bg-teal-900 text-white py-12 scroll-mt-20" id="objectives">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black tracking-widest uppercase mb-6">Objectives</h2>
          <div className="space-y-4 text-teal-100">
            <p><span className="font-bold italic text-orange-400">Aware:</span> Mobilize people to minimize their food wastage through widespread awareness programs across the country by Food Recovery Agencies.</p>
            <p><span className="font-bold italic text-orange-400">Recover:</span> Facilitate collection of surplus food from events, hotels, households, and redirect it to hunger spots efficiently.</p>
            <p><span className="font-bold italic text-orange-400">Redistribute:</span> Ensure safe, timely food delivery to beneficiaries following FSSAI guidelines (4-hour food validity window).</p>
          </div>
          </div>
        </div>
      </section>

      {/* ─── News Ticker ─────────────────────────────────────────────────────────── */}
      <div className="bg-orange-50 border-y border-orange-200 py-3 overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap marquee-animate">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="text-sm text-teal-800 flex items-center gap-2">
              <span className="text-orange-500">»</span> {item}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Action Cards + Register Banner ──────────────────────────────────────── */}
      <section className="py-16 bg-white scroll-mt-20" id="network">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Register CTA Banner */}
          <div className="bg-orange-100 border border-orange-300 rounded-xl p-5 text-center mb-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="text-gray-700 font-semibold">Surplus Food Distribution Agencies across India — become part of our network</span>
            <Link to="/volunteer/register" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-full text-sm transition-colors whitespace-nowrap">
              REGISTER NOW
            </Link>
          </div>

          {/* Two cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200 card-hover h-full flex flex-col">
              <div className="text-5xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-orange-500 mb-3">Food Donating Agencies</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed max-w-prose mx-auto">
                Restaurants, hotels, caterers, and households with surplus food can register and donate instantly or schedule future donations.
              </p>
              <Link to="/login/donor" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors inline-block">
                Learn more
              </Link>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200 card-hover h-full flex flex-col">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-orange-500 mb-3">Food Donation Points</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed max-w-prose mx-auto">
                Hunger spots and beneficiary centers managed by the NGO admin where collected food is delivered by our driver/volunteer network.
              </p>
              <a href="#network" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors inline-block">
                Learn more
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── IFSA + Why Food Waste section ────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 scroll-mt-20" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Blue card */}
            <div className="bg-blue-500 text-white rounded-3xl p-8 text-center card-hover h-full flex flex-col">
              <h3 className="font-black text-xl uppercase tracking-wide mb-4">What Is Our Mission</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6 max-w-prose mx-auto">
                Our No Food Waste NGO has been formed to help solve India's food waste and hunger crisis by working with various partner organizations, Food Recovery Agencies, volunteers, and donors. We ensure no edible food goes to waste.
              </p>
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-500 font-bold px-6 py-2 rounded-full text-sm transition-all mt-auto mx-auto">
                READ MORE
              </button>
            </div>
            {/* Green card */}
            <div className="bg-emerald-500 text-white rounded-3xl p-8 text-center card-hover h-full flex flex-col">
              <h3 className="font-black text-xl uppercase tracking-wide mb-4">Why Is Prevention of Food Waste Important</h3>
              <p className="text-emerald-100 text-sm leading-relaxed mb-6 max-w-prose mx-auto">
                1.3 metric gigatons of edible food is wasted every year and at least 795 million people are undernourished worldwide. More than a third of all the food produced on our planet never reaches a table.
              </p>
              <button className="border-2 border-white text-white hover:bg-white hover:text-emerald-500 font-bold px-6 py-2 rounded-full text-sm transition-all mt-auto mx-auto">
                READ MORE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bubbles Section ───────────────────────────────────────────────── */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-orange-500 uppercase tracking-wide">Surplus Food Sharing</h2>
            <p className="text-gray-600 mt-2">Coalition of Partners To Prevent Food Waste And Food Loss</p>
          </div>

          {/* Bubbles grid */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-10">
            {statsBubbles.map((b, i) => (
              <div
                key={i}
                className={`${b.color} ${b.size} rounded-full flex flex-col items-center justify-center text-white text-center p-3 sm:p-4 float-anim cursor-default`}
                style={{ animationDelay: b.delay }}
              >
                <span className="text-2xl font-black leading-tight">{b.stat}</span>
                <span className="text-[11px] sm:text-xs leading-snug mt-1 px-2">{b.label}</span>
              </div>
            ))}
          </div>

          {/* Info box */}
          <div className="bg-orange-200 rounded-xl p-6 text-orange-900 text-sm leading-relaxed">
            <div className="max-w-5xl mx-auto">
              <p className="mb-2">
                India's primary issue is lack of cold chains and adequate storage facilities leading to a large amount of loss along the supply chain. This, coupled with rising incomes and lack of awareness on the issue of food waste, plays an important role in India's contribution to environmental degradation today.
              </p>
              <p>
                Not only do we need to put surplus food back into the food chain but we also need to secure food for future generations at a low environmental cost.
              </p>
            </div>
          </div>

          {/* Role badges row */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { label: 'Partners', color: 'bg-orange-500', link: '/login' },
              { label: 'Donors', color: 'bg-green-500', link: '/login/donor' },
              { label: 'Beneficiaries', color: 'bg-blue-500', link: '/' },
              { label: 'Volunteers', color: 'bg-yellow-500', link: '/volunteer/register' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.link}
                className={`${item.color} hover:opacity-90 text-white font-bold px-8 py-3 rounded-full text-sm transition-all shadow-md hover:shadow-lg`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-teal-800 uppercase tracking-wide">How It Works</h2>
            <p className="text-gray-500 mt-2">A simple 4-step process to save food and fight hunger</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '1', icon: '📞', title: 'Donor Calls', desc: 'Donor contacts us or uses the app to register surplus food.' },
              { step: '2', icon: '✅', title: 'Validation', desc: 'Food quantity (min 30 people) and 4-hour FSSAI validity checked.' },
              { step: '3', icon: '🚗', title: 'Driver Assigned', desc: 'Nearest available driver is auto-assigned for pickup.' },
              { step: '4', icon: '🏘️', title: 'Delivered', desc: 'Food delivered to nearest hunger spot. Zero waste!' },
            ].map((s) => (
              <div key={s.step} className="text-center p-6 rounded-2xl border border-gray-100 hover:border-orange-200 card-hover relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-black text-sm">
                  {s.step}
                </div>
                <div className="text-4xl mb-3 mt-2">{s.icon}</div>
                <h3 className="font-bold text-teal-800 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─────────────────────────────────────────────────────────── */}
      <section className="bg-orange-gradient py-16 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black mb-4">Ready to Make a Difference?</h2>
          <p className="text-orange-100 text-lg mb-8">Join our network of volunteers, donors, and drivers making every meal count.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/volunteer/register" className="bg-white text-orange-500 hover:bg-orange-50 font-bold px-8 py-4 rounded-full transition-all shadow-lg">
              Join as Volunteer
            </Link>
            <Link to="/login/donor" className="border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-4 rounded-full transition-all">
              Donate Food Now
            </Link>
          </div>
          </div>
        </div>
      </section>

      <Footer />
      </main>
    </div>
  );
}
