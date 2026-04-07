import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Phone, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function DonorLogin() {
  const { sendOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1=phone, 2=otp
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState(''); // shown in dev mode

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) return toast.error('Enter valid 10-digit Indian mobile number');
    try {
      setLoading(true);
      const data = await sendOTP(phone);
      toast.success('OTP sent successfully!');
      if (data.otp) {
        setDevOtp(data.otp); // dev mode: show OTP
        toast(`Dev Mode OTP: ${data.otp}`, { icon: '🔑', duration: 10000 });
      }
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return toast.error('Enter valid 6-digit OTP');
    try {
      setLoading(true);
      await verifyOTP(phone, otp);
      toast.success('OTP Verified! Welcome, Donor 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-900 via-rose-800 to-pink-900 px-4">

      <div className="w-full max-w-lg">

        {/* Back */}
        <Link
          to="/login"
          className="flex items-center gap-2 text-sm text-white/80 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg px-12 py-12">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-rose-100">
              <span className="text-2xl">❤️</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Donor Login
          </h1>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-rose-500' : 'text-gray-300'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
              <span className="text-sm font-semibold">Mobile</span>
            </div>
            <div className={`flex-1 h-0.5 max-w-12 ${step >= 2 ? 'bg-rose-500' : 'bg-gray-200'}`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-rose-500' : 'text-gray-300'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
              <span className="text-sm font-semibold">Verify OTP</span>
            </div>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-7">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">+91</span>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full h-13 pl-14 pr-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    maxLength={10}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-13 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white rounded-md text-sm font-medium transition flex items-center justify-center gap-2"
              >
                {loading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><Phone size={16} /> Send OTP</>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-7">
              <p className="text-gray-500 text-sm text-center">
                OTP sent to <span className="font-bold text-gray-800">+91 {phone}</span>
                <button type="button" onClick={() => { setStep(1); setOtp(''); }} className="text-rose-500 ml-2 text-xs hover:underline">Change</button>
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter 6-digit OTP</label>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full h-13 px-4 border border-gray-300 rounded-md text-center text-2xl tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                  maxLength={6}
                />
              </div>
              {devOtp && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-xs text-yellow-800">
                  🔑 <strong>Dev Mode OTP:</strong> {devOtp} (remove in production)
                </div>
              )}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full h-13 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white rounded-md text-sm font-medium transition flex items-center justify-center gap-2"
              >
                {loading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><ShieldCheck size={16} /> Verify &amp; Login</>}
              </button>
            </form>
          )}

        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          OTP-based secure login with your mobile
        </p>

      </div>
    </div>
  );
}
