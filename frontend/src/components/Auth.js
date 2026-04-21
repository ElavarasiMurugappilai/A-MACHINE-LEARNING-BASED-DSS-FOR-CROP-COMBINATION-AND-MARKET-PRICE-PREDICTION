import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LockKeyhole, Eye, EyeOff, Loader2, Sprout, Mail, Leaf, TrendingUp, BarChart3 } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const url = isLogin ? 'http://localhost:5000/login' : 'http://localhost:5000/signup';
    const body = isLogin ? { email, password } : { username, email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setIsLoading(false);

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('username', data.username);
          navigate('/home');
        } else {
          setIsLogin(true);
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setIsLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen" style={{ backgroundColor: '#F5F7F6' }}>
      {/* Left side - Branding */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <Sprout size={50} style={{ color: '#2E7D32' }} />
          <div>
            <h1 className="text-4xl md:text-5xl font-bold" style={{ color: '#1B4332' }}>AgroVision AI</h1>
            <p className="text-lg" style={{ color: '#4F6F52' }}>From Soil to Profit – Smarter Farming Starts Here</p>
          </div>
        </div>
        <p className="text-xl text-center mb-8 max-w-md" style={{ color: '#4F6F52' }}>
          AI-powered crop recommendations and market forecasting for modern farmers
        </p>
        <div className="hidden md:block w-full max-w-md">
          <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-lg p-6 shadow-lg border" style={{ borderColor: '#DDE7E1' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full p-2" style={{ backgroundColor: '#A5D6A7' }}>
                <Leaf size={20} style={{ color: '#2E7D32' }} />
              </div>
              <h3 className="font-semibold" style={{ color: '#1B4332' }}>Smart Crop Advisor</h3>
            </div>
            <p style={{ color: '#4F6F52' }} className="mb-4 pl-10">Get personalized crop suggestions based on your soil, climate, and market conditions</p>

            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full p-2" style={{ backgroundColor: '#A5D6A7' }}>
                <TrendingUp size={20} style={{ color: '#2E7D32' }} />
              </div>
              <h3 className="font-semibold" style={{ color: '#1B4332' }}>AI Market Forecasting</h3>
            </div>
            <p style={{ color: '#4F6F52' }} className="pl-10">Advanced analytics to forecast market prices for your crops</p>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center mt-8 md:mt-0 animate-fade-in">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white backdrop-blur-lg rounded-xl shadow-2xl p-8 border"
          style={{ borderColor: '#DDE7E1' }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold" style={{ color: '#1B4332' }}>
              {isLogin ? 'Welcome Back' : 'Join AgroVision AI'}
            </h2>
            <p style={{ color: '#4F6F52' }} className="mt-2">
              {isLogin ? 'Log in to access your dashboard' : 'Create an account to get started'}
            </p>
          </div>

          {!isLogin && (
            <div className={`mb-5 transform transition-all duration-300 ${focused === 'username' ? 'scale-102' : ''}`}>
              <label className="text-sm font-medium flex items-center gap-2 mb-1" style={{ color: '#1B4332' }}>
                <User size={16} style={{ color: '#2E7D32' }} /> Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused('')}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                  style={{ backgroundColor: '#F5F7F6', borderColor: '#DDE7E1' }}
                />
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#2E7D32' }} />
              </div>
            </div>
          )}

          <div className={`mb-5 transform transition-all duration-300 ${focused === 'email' ? 'scale-102' : ''}`}>
            <label className="text-sm font-medium flex items-center gap-2 mb-1" style={{ color: '#1B4332' }}>
              <Mail size={16} style={{ color: '#2E7D32' }} /> Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                style={{ backgroundColor: '#F5F7F6', borderColor: '#DDE7E1' }}
              />
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#2E7D32' }} />
            </div>
          </div>

          <div className={`mb-5 transform transition-all duration-300 ${focused === 'password' ? 'scale-102' : ''}`}>
            <label className="text-sm font-medium flex items-center gap-2 mb-1" style={{ color: '#1B4332' }}>
              <LockKeyhole size={16} style={{ color: '#2E7D32' }} /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                required
                className="w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                style={{ backgroundColor: '#F5F7F6', borderColor: '#DDE7E1' }}
              />
              <LockKeyhole size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#2E7D32' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-green-800"
                style={{ color: '#2E7D32' }}
              >
                {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-5 text-center border" style={{ borderColor: '#DDE7E1' }}>
              {error}
            </div>
          )}

          <div className="mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-white"
              style={{ backgroundColor: '#2E7D32' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : isLogin ? (
                'Log In'
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p style={{ color: '#4F6F52' }}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setPassword('');
                  setError('');
                }}
                className="font-semibold hover:underline focus:outline-none"
                style={{ color: '#2E7D32' }}
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>

          {isLogin && (
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-sm hover:underline focus:outline-none"
                style={{ color: '#4F6F52' }}
              >
                Forgot password?
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;