import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, ArrowRight, Sparkles } from 'lucide-react';
import { BG, BLUE, GREEN, TEXT_DARK, TEXT_MID, neuEx, neuIn, neuExSm } from '../neu';

const TEMPLE_IMG = 'https://images.unsplash.com/photo-1768746382323-621bccddf7b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpbGFuZCUyMHRlbXBsZSUyMGdvbGRlbiUyMHN1bnNldCUyMHRyYXZlbHxlbnwxfHx8fDE3Nzc2MTg1MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

type LoginMethod = 'email' | 'phone' | null;

export default function LoginPage() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<LoginMethod>(null);
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!value.trim()) return;
    setSent(true);
    setTimeout(() => navigate('/onboarding/personality'), 1500);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: BG, fontFamily: 'Poppins, sans-serif' }}>
      {/* Hero Image */}
      <div className="relative flex-shrink-0 h-[42%] overflow-hidden rounded-b-[40px]" style={{ boxShadow: neuEx }}>
        <img src={TEMPLE_IMG} alt="Thailand" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} color="#F0A500" />
            <span style={{ color: '#F0A500', fontSize: 12, letterSpacing: 2 }}>DISCOVER THAILAND</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>TourTuaThai</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 }}>Your AI-powered Thai adventure awaits</p>
        </div>
      </div>

      {/* Login Panel */}
      <div className="flex-1 flex flex-col px-6 pt-8 pb-6 overflow-auto">
        <h2 style={{ color: TEXT_DARK, fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Welcome back</h2>
        <p style={{ color: TEXT_MID, fontSize: 14, marginBottom: 28 }}>No passwords. Just magic links.</p>

        {/* Method Buttons */}
        <div className="flex flex-col gap-4 mb-6">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { setMethod('email'); setSent(false); setValue(''); }}
            className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all"
            style={{
              background: BG,
              boxShadow: method === 'email' ? neuIn : neuEx,
              color: TEXT_DARK,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: BLUE, boxShadow: neuExSm }}>
              <Mail size={18} color="#fff" />
            </div>
            <div className="text-left flex-1">
              <div style={{ fontSize: 15, fontWeight: 600, color: TEXT_DARK }}>Continue with Email</div>
              <div style={{ fontSize: 12, color: TEXT_MID }}>We'll send a magic link</div>
            </div>
            <ArrowRight size={16} color={TEXT_MID} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { setMethod('phone'); setSent(false); setValue(''); }}
            className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all"
            style={{
              background: BG,
              boxShadow: method === 'phone' ? neuIn : neuEx,
              color: TEXT_DARK,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: GREEN, boxShadow: neuExSm }}>
              <Phone size={18} color="#fff" />
            </div>
            <div className="text-left flex-1">
              <div style={{ fontSize: 15, fontWeight: 600, color: TEXT_DARK }}>Continue with Phone</div>
              <div style={{ fontSize: 12, color: TEXT_MID }}>We'll send an OTP</div>
            </div>
            <ArrowRight size={16} color={TEXT_MID} />
          </motion.button>
        </div>

        {/* Input Field */}
        <AnimatePresence>
          {method && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-4"
                style={{ background: BG, boxShadow: neuIn }}
              >
                {method === 'email' ? <Mail size={16} color={TEXT_MID} /> : <Phone size={16} color={TEXT_MID} />}
                <input
                  className="flex-1 bg-transparent outline-none"
                  style={{ color: TEXT_DARK, fontSize: 14, border: 'none' }}
                  placeholder={method === 'email' ? 'your@email.com' : '+66 8X XXX XXXX'}
                  type={method === 'email' ? 'email' : 'tel'}
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  autoFocus
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleSend}
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
                style={{
                  background: sent ? GREEN : BLUE,
                  boxShadow: neuEx,
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {sent ? (
                  <>✓ {method === 'email' ? 'Magic Link Sent!' : 'OTP Sent!'}</>
                ) : (
                  <>
                    <Sparkles size={16} />
                    {method === 'email' ? 'Send Magic Link' : 'Send OTP'}
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-6 text-center" style={{ color: TEXT_MID, fontSize: 12 }}>
          By continuing, you agree to our Terms & Privacy Policy
        </div>
      </div>
    </div>
  );
}
