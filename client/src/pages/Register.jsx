import React, { useState } from 'react';
import { REGISTER_ENDPOINT } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

const Register = ({ onAuth }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(REGISTER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      if (onAuth) onAuth();
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-40 h-40 bg-pink-400 rounded-full opacity-30 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-orange-400 rounded-full opacity-30 blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-yellow-300 rounded-full opacity-20 blur-2xl animate-bounce"></div>
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl mb-4">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-2 leading-tight drop-shadow-lg text-center">
            Create Account
          </h2>
          <form className="w-full space-y-6 mt-4" onSubmit={handleSubmit}>
            <input
              className="block w-full pl-4 pr-3 py-4 border-2 border-orange-200 rounded-2xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent placeholder-gray-400 text-gray-800 font-semibold text-lg shadow-sm mb-4"
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              className="block w-full pl-4 pr-3 py-4 border-2 border-orange-200 rounded-2xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent placeholder-gray-400 text-gray-800 font-semibold text-lg shadow-sm mb-4"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <div className="relative">
              <input
                className="block w-full pl-4 pr-12 py-4 border-2 border-orange-200 rounded-2xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent placeholder-gray-400 text-gray-800 font-semibold text-lg shadow-sm"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="h-6 w-6 text-orange-400 hover:text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-orange-400 hover:text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {error && (
              <div className="flex items-center p-4 text-base text-red-700 bg-red-50 border-2 border-red-200 rounded-2xl font-semibold">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            <button
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-black py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.04] transition-all duration-200 text-xl tracking-wide"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </div>
              ) : (
                'Register'
              )}
            </button>
            <button
              type="button"
              className="w-full bg-gradient-to-r from-pink-100 to-orange-100 text-orange-600 font-bold py-3 rounded-2xl shadow hover:shadow-md hover:bg-orange-50 transition-colors text-base border-2 border-orange-200 mt-2"
              onClick={() => navigate('/')}
            >
              ← Back to Home
            </button>
            <button
              type="button"
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-3 rounded-2xl shadow hover:shadow-lg transition-colors text-base border-2 border-orange-200 mt-2"
              onClick={() => navigate('/login')}
            >
              Already have an account? Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;