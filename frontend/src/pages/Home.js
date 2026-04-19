import { Sprout, Leaf, TrendingUp, History, BarChart3, LineChart, Users, Target, Award, Zap } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("username");

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F7F6' }}>
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b" style={{ borderColor: '#DDE7E1' }}>
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center space-x-3">
            <Sprout size={40} style={{ color: '#2E7D32' }} />
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#1B4332' }}>AgroVision AI</h1>
              <p className="text-sm" style={{ color: '#4F6F52' }}>From Soil to Profit – Smarter Farming Starts Here</p>
            </div>
          </div>
          <div className="space-x-4">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  localStorage.removeItem("username");
                  navigate("/login");
                }}
                className="text-white px-6 py-2 rounded-full font-semibold transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                style={{ backgroundColor: '#2E7D32' }}
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2 rounded-full font-semibold transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  style={{ color: '#2E7D32', backgroundColor: '#A5D6A7' }}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="text-white px-6 py-2 rounded-full font-semibold transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105 border"
                  style={{ backgroundColor: '#2E7D32', borderColor: '#A5D6A7' }}
                >
                  Signup
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto py-20 px-4 text-center animate-fade-in">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 transform hover:scale-[1.01] transition duration-300" style={{ borderColor: '#DDE7E1', borderWidth: '1px' }}>
          <h2 className="text-5xl font-bold mb-6" style={{ color: '#1B4332' }}>
            AgroVision AI
          </h2>
          <p className="text-2xl font-semibold mb-4" style={{ color: '#2E7D32' }}>
            From Soil to Profit – Smarter Farming Starts Here
          </p>
          <p className="text-xl mb-10 leading-relaxed" style={{ color: '#4F6F52' }}>
            Empowering farmers with AI-powered crop recommendations, sub-crop suggestions, and market forecasting using advanced machine learning.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/soil-details")}
              className="text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 text-lg"
              style={{ backgroundColor: '#2E7D32' }}
            >
              Start Analysis
            </button>
            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 text-lg border-2"
              style={{ color: '#2E7D32', backgroundColor: 'white', borderColor: '#2E7D32' }}
            >
              Explore Features
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div id="features" className="container mx-auto py-12 px-4">
        <h3 className="text-3xl font-bold text-center mb-12" style={{ color: '#1B4332' }}>Our AI-Powered Solutions</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 hover:shadow-xl transition duration-300 border" style={{ borderColor: '#DDE7E1' }}>
            <div className="rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: '#A5D6A7' }}>
              <Leaf size={32} style={{ color: '#2E7D32' }} />
            </div>
            <h3 className="text-xl font-bold text-center mb-3" style={{ color: '#1B4332' }}>Smart Crop Advisor</h3>
            <p style={{ color: '#4F6F52' }} className="text-center">
              Get accurate crop suggestions based on soil metrics, weather data, and environmental factors using advanced AI algorithms.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 hover:shadow-xl transition duration-300 border" style={{ borderColor: '#DDE7E1' }}>
            <div className="rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: '#A5D6A7' }}>
              <BarChart3 size={32} style={{ color: '#2E7D32' }} />
            </div>
            <h3 className="text-xl font-bold text-center mb-3" style={{ color: '#1B4332' }}>Soil Intelligence Engine</h3>
            <p style={{ color: '#4F6F52' }} className="text-center">
              Analyze soil composition with N, P, K levels and pH values to optimize crop selection and yield potential.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 hover:shadow-xl transition duration-300 border" style={{ borderColor: '#DDE7E1' }}>
            <div className="rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: '#A5D6A7' }}>
              <TrendingUp size={32} style={{ color: '#2E7D32' }} />
            </div>
            <h3 className="text-xl font-bold text-center mb-3" style={{ color: '#1B4332' }}>AI Market Forecasting</h3>
            <p style={{ color: '#4F6F52' }} className="text-center">
              Maximize profits with real-time market price predictions using dynamic government data and time series analysis.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 hover:shadow-xl transition duration-300 border md:col-span-3" style={{ borderColor: '#DDE7E1' }}>
            <div className="rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: '#A5D6A7' }}>
              <History size={32} style={{ color: '#2E7D32' }} />
            </div>
            <h3 className="text-xl font-bold text-center mb-3" style={{ color: '#1B4332' }}>Farm Insights Dashboard</h3>
            <p style={{ color: '#4F6F52' }} className="text-center">
              Track your past analyses, monitor trends, and access historical data to make informed farming decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Stats Strip */}
      <div className="py-12 px-4" style={{ backgroundColor: '#A5D6A7' }}>
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8" style={{ color: '#1B4332' }}>Platform Performance</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition duration-300">
              <Award size={40} style={{ color: '#2E7D32' }} className="mx-auto mb-2" />
              <h4 className="text-lg font-semibold" style={{ color: '#1B4332' }}>Crop Accuracy</h4>
              <p className="text-2xl font-bold" style={{ color: '#2E7D32' }}>99.5%</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition duration-300">
              <Target size={40} style={{ color: '#2E7D32' }} className="mx-auto mb-2" />
              <h4 className="text-lg font-semibold" style={{ color: '#1B4332' }}>Sub-Crop Match Quality</h4>
              <p className="text-2xl font-bold" style={{ color: '#2E7D32' }}>97%</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition duration-300">
              <LineChart size={40} style={{ color: '#2E7D32' }} className="mx-auto mb-2" />
              <h4 className="text-lg font-semibold" style={{ color: '#1B4332' }}>Price Forecast Support</h4>
              <p className="text-2xl font-bold" style={{ color: '#2E7D32' }}>95%</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition duration-300">
              <Users size={40} style={{ color: '#2E7D32' }} className="mx-auto mb-2" />
              <h4 className="text-lg font-semibold" style={{ color: '#1B4332' }}>Farmer Decision Support</h4>
              <p className="text-2xl font-bold" style={{ color: '#2E7D32' }}>10,000+</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white py-16 px-4 shadow-inner">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-10" style={{ color: '#1B4332' }}>
            Why Choose AgroVision AI?
          </h3>

          <div className="bg-gray-50 p-8 rounded-2xl shadow-md max-w-4xl mx-auto" style={{ backgroundColor: '#F5F7F6' }}>
            <p className="text-lg leading-relaxed mb-6" style={{ color: '#4F6F52' }}>
              AgroVision AI is an intelligent agricultural support system designed to address sustainability challenges in farming. Built by engineering students from Anna University, our platform leverages cutting-edge machine learning to provide data-driven insights for crop and market decisions.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <Zap size={24} style={{ color: '#2E7D32' }} className="mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: '#1B4332' }}>AI-Powered Recommendations</h4>
                  <p style={{ color: '#4F6F52' }}>Advanced algorithms analyze soil, weather, and market data to provide personalized crop suggestions.</p>
                </div>
              </div>
              <div className="flex items-start">
                <TrendingUp size={24} style={{ color: '#2E7D32' }} className="mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: '#1B4332' }}>Market Intelligence</h4>
                  <p style={{ color: '#4F6F52' }}>Real-time price forecasting helps farmers maximize profits and minimize risks.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Leaf size={24} style={{ color: '#2E7D32' }} className="mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: '#1B4332' }}>Sustainable Farming</h4>
                  <p style={{ color: '#4F6F52' }}>Promote eco-friendly practices with companion crop suggestions and soil health optimization.</p>
                </div>
              </div>
              <div className="flex items-start">
                <BarChart3 size={24} style={{ color: '#2E7D32' }} className="mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: '#1B4332' }}>Data-Driven Insights</h4>
                  <p style={{ color: '#4F6F52' }}>Comprehensive analytics and historical tracking for informed decision-making.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-lg border-l-4" style={{ backgroundColor: '#A5D6A7', borderColor: '#2E7D32' }}>
              <p className="font-semibold" style={{ color: '#1B4332' }}>
                Join thousands of farmers making smarter, more profitable farming decisions with AgroVision AI.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4" style={{ backgroundColor: '#2E7D32' }}>
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Farm?</h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#A5D6A7' }}>
            Start your journey towards smarter farming with AI-powered insights and data-driven decisions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 text-lg"
              style={{ backgroundColor: '#FFC107', color: '#1B4332' }}
            >
              Create Account
            </button>
            <button
              onClick={() => navigate("/soil-details")}
              className="bg-transparent text-white border-2 px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition duration-300 shadow-lg text-lg border-white"
            >
              Try Without Account
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <div className="container mx-auto">
          <div className="flex justify-center items-center mb-4">
            <Sprout size={32} style={{ color: '#A5D6A7' }} className="mr-2" />
            <h2 className="text-2xl font-bold" style={{ color: '#A5D6A7' }}>AgroVision AI</h2>
          </div>
          <p style={{ color: '#DDE7E1' }}>&copy; 2025 AgroVision AI. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" style={{ color: '#A5D6A7' }} className="hover:text-white transition duration-300">Privacy Policy</a>
            <a href="#" style={{ color: '#A5D6A7' }} className="hover:text-white transition duration-300">Terms of Service</a>
            <a href="#" style={{ color: '#A5D6A7' }} className="hover:text-white transition duration-300">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;