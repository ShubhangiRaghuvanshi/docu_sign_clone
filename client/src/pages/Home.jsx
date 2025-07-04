import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 px-4 py-8 relative overflow-hidden">
      {/* Geometric background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rotate-45 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-yellow-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-40 w-12 h-32 bg-white transform rotate-12"></div>
        <div className="absolute bottom-40 right-10 w-24 h-8 bg-yellow-300 transform -rotate-45"></div>
        <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-white rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-yellow-300 rotate-45"></div>
      </div>
      
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-400 to-orange-500 rounded-bl-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-400 to-pink-500 rounded-tr-full opacity-20"></div>
          
          <div className="text-center relative z-10">
            {/* Logo */}
            <div className="inline-block mb-6 relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            
            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-black text-gray-800 mb-4 leading-tight">
              Welcome to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 animate-pulse">
                DocuSign Clone
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              🚀 The most fun way to handle digital signatures! Fast, secure, and surprisingly delightful document management for the modern world.
            </p>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mb-12 max-w-lg mx-auto">
              <button 
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-rotate-1 shadow-xl hover:shadow-2xl"
                onClick={() => navigate('/login')}
              >
                🔐 Login Now
              </button>
              
              <button 
                className="flex-1 bg-white border-4 border-orange-500 text-orange-600 font-bold py-4 px-8 rounded-2xl hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 hover:rotate-1 shadow-xl hover:shadow-2xl"
                onClick={() => navigate('/register')}
              >
                ✨ Get Started
              </button>
            </div>
            
            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-rotate-1 border-l-4 border-blue-500">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="font-black text-xl text-gray-800 mb-3">📁 Upload Magic</h3>
                <p className="text-gray-600 font-medium">Drag, drop, and watch your documents come to life with our lightning-fast upload system!</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:rotate-1 border-l-4 border-green-500">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-black text-xl text-gray-800 mb-3">✍️ Sign & Share</h3>
                <p className="text-gray-600 font-medium">Signature superpowers! Sign anywhere, invite anyone, and make document collaboration awesome.</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-rotate-1 border-l-4 border-yellow-500">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="font-black text-xl text-gray-800 mb-3">📊 Track Everything</h3>
                <p className="text-gray-600 font-medium">Real-time tracking dashboard that makes monitoring your documents feel like playing a game!</p>
              </div>
            </div>
            
            {/* Fun stats section */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-black text-orange-500 mb-2">99.9%</div>
                <div className="text-sm font-bold text-gray-600 uppercase tracking-wide">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-red-500 mb-2">10M+</div>
                <div className="text-sm font-bold text-gray-600 uppercase tracking-wide">Documents</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-pink-500 mb-2">24/7</div>
                <div className="text-sm font-bold text-gray-600 uppercase tracking-wide">Support</div>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="mt-8 text-white/80 text-sm font-medium">
          &copy; {new Date().getFullYear()} DocuSign Clone. Made with ❤️ and lots of ☕
        </footer>
      </div>
    </div>
  );
};

export default Home;