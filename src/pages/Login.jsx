import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, UserPlus, Mail, Lock, User, Sparkles, Rocket, Zap, Star } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import CosmicBackground from '../components/ui/CosmicBackground'
import { pick } from '../lib/nubCopy'

// Fun login copy
const LOGIN_HEADLINES = [
  "Welcome back, legend",
  "The chaos awaits",
  "Ready to rock?",
  "Miss us? We missed you",
  "Let's get weird",
]

const REGISTER_HEADLINES = [
  "Join the chaos",
  "Become a Nublet",
  "Enter the void",
  "Start your journey",
  "Let's get saucy",
]

const LOGIN_SUBTITLES = [
  "Your fans have been waiting (probably)",
  "The algorithm won't feed itself",
  "Time to make some questionable decisions",
  "Let's confuse the internet together",
]

const REGISTER_SUBTITLES = [
  "Fair warning: we're a little weird here",
  "Strap in, it gets chaotic",
  "No turning back now (just kidding, there's a logout button)",
  "Your content journey starts here",
]

const LOADING_MESSAGES = [
  "Summoning the otter spirits...",
  "Convincing the server you're cool...",
  "Doing authentication jazz hands...",
  "Checking if you're a robot (please don't be)...",
  "Warming up the chaos engine...",
]

// Floating icons for visual interest
const FloatingIcon = ({ icon: Icon, delay, duration, x, y, color }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.6, 0.6, 0],
      scale: [0, 1, 1, 0],
      y: [0, -30, -50, -80],
      rotate: [0, 10, -10, 0],
    }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 3 + 2,
    }}
  >
    <Icon className={`w-6 h-6 ${color}`} />
  </motion.div>
)

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [headline, setHeadline] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const { login, register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  // Update copy when switching modes
  useEffect(() => {
    setHeadline(pick(isLogin ? LOGIN_HEADLINES : REGISTER_HEADLINES))
    setSubtitle(pick(isLogin ? LOGIN_SUBTITLES : REGISTER_SUBTITLES))
  }, [isLogin])

  // Cycle loading messages
  useEffect(() => {
    if (loading) {
      setLoadingMessage(pick(LOADING_MESSAGES))
      const interval = setInterval(() => {
        setLoadingMessage(pick(LOADING_MESSAGES))
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [loading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await login(email, password)
        showToast("You're in! Let's make some noise 🎸", 'success')
      } else {
        await register(email, password, displayName)
        showToast('Welcome to the chaos! 🦦', 'success')
      }
      // Redirect to original destination or home
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch (error) {
      showToast(error.message || 'Something went wrong. Blame the gremlins.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const inputClasses = `
    w-full pl-12 pr-4 py-3.5
    bg-white/10 backdrop-blur-sm
    border-2 border-white/20 rounded-xl
    text-white placeholder-white/40
    focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30
    transition-all duration-200
  `

  const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"

  return (
    <CosmicBackground variant="portal" className="min-h-screen flex items-center justify-center p-4">
      {/* Floating decorative icons */}
      <FloatingIcon icon={Sparkles} delay={0} duration={4} x="15%" y="20%" color="text-brand-orange" />
      <FloatingIcon icon={Star} delay={1} duration={5} x="85%" y="25%" color="text-brand-pink" />
      <FloatingIcon icon={Rocket} delay={2} duration={4.5} x="10%" y="70%" color="text-brand-cyan" />
      <FloatingIcon icon={Zap} delay={0.5} duration={3.5} x="90%" y="65%" color="text-brand-orange" />
      <FloatingIcon icon={Sparkles} delay={1.5} duration={4} x="20%" y="80%" color="text-brand-pink" />
      <FloatingIcon icon={Star} delay={2.5} duration={5} x="80%" y="15%" color="text-brand-cyan" />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo & Headlines */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Animated Logo */}
          <motion.div
            className="inline-block mb-4"
            animate={{
              rotate: [0, -3, 3, -3, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-brand-orange via-brand-pink to-brand-purple rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-pink/30 border-2 border-white/20">
              <span className="text-4xl">🦦</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl font-black text-white mb-2 tracking-tight"
            key={headline}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {headline}
          </motion.h1>
          <motion.p
            className="text-white/60 text-sm"
            key={subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Tab Switcher */}
          <div className="flex mb-8 bg-white/5 rounded-xl p-1">
            <motion.button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                isLogin
                  ? 'bg-gradient-to-r from-brand-orange to-brand-pink text-white shadow-lg'
                  : 'text-white/60 hover:text-white'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                !isLogin
                  ? 'bg-gradient-to-r from-brand-orange to-brand-pink text-white shadow-lg'
                  : 'text-white/60 hover:text-white'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <UserPlus className="w-4 h-4" />
              Join
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-xs font-bold text-white/70 mb-2 uppercase tracking-wider">
                    What should we call you?
                  </label>
                  <div className="relative">
                    <User className={iconClasses} />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your legendary name"
                      className={inputClasses}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-bold text-white/70 mb-2 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className={iconClasses} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@awesome.com"
                  required
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className={iconClasses} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Your secret sauce" : "Make it spicy (6+ chars)"}
                  required
                  minLength={6}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className={`
                w-full py-4 px-6 rounded-xl font-bold text-lg
                bg-gradient-to-r from-brand-orange via-brand-pink to-brand-purple
                text-white shadow-xl shadow-brand-pink/30
                hover:shadow-2xl hover:shadow-brand-pink/40 hover:scale-[1.02]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                transition-all duration-200
                flex items-center justify-center gap-3
              `}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <motion.span
                  key={loadingMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  {loadingMessage}
                </motion.span>
              ) : isLogin ? (
                <>
                  <Rocket className="w-5 h-5" />
                  Launch Into Chaos
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Begin The Journey
                </>
              )}
            </motion.button>
          </form>

          {/* Footer note */}
          <p className="text-center text-white/40 text-xs mt-6">
            {isLogin ? (
              "Forgot your password? That's a you problem. (JK, feature coming soon)"
            ) : (
              "By joining, you agree to embrace the weird"
            )}
          </p>
        </motion.div>

        {/* Bottom branding */}
        <motion.p
          className="text-center text-white/30 text-xs mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          NubHQ • Take Weird Seriously™
        </motion.p>
      </motion.div>
    </CosmicBackground>
  )
}
