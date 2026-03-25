import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Phone, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-rose-800 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">❤️</div>
            <h1 className="text-2xl font-black">Donor Login</h1>
            <p className="text-rose-100 text-sm mt-1">OTP-based secure login with your mobile</p>
          </div>

          <div className="p-8">
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-orange-500' : 'text-gray-300'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                <span className="text-sm font-semibold">Mobile</span>
              </div>
              <div className={`flex-1 h-0.5 max-w-12 ${step >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`} />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-orange-500' : 'text-gray-300'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                <span className="text-sm font-semibold">Verify OTP</span>
              </div>
            </div>

            {step === 1 ? (
              <form onSubmit={handleSendOTP} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</span>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="form-input pl-14"
                      maxLength={10}
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Phone size={18} /> Send OTP</>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <p className="text-gray-500 text-sm text-center">
                  OTP sent to <span className="font-bold text-gray-800">+91 {phone}</span>
                  <button type="button" onClick={() => { setStep(1); setOtp(''); }} className="text-orange-500 ml-2 text-xs hover:underline">Change</button>
                </p>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Enter 6-digit OTP</label>
                  <input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="form-input text-center text-2xl tracking-widest font-bold"
                    maxLength={6}
                  />
                </div>
                {devOtp && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-xs text-yellow-800">
                    🔑 <strong>Dev Mode OTP:</strong> {devOtp} (remove in production)
                  </div>
                )}
                <button type="submit" disabled={loading || otp.length !== 6} className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><ShieldCheck size={18} /> Verify & Login</>}
                </button>
              </form>
            )}

            <div className="text-center pt-4 border-t border-gray-100 mt-4">
              <Link to="/login" className="text-orange-500 hover:underline text-sm font-medium">← Back to Login Portal</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
