import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  Leaf,
  TrendingUp,
  BarChart3,
  History,
  LogOut,
  Calendar,
  Zap,
  Users,
  Target,
  Award,
  ChevronRight,
  Activity
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const HomeDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const cropPerformanceData = [
    { month: 'Jan', yield: 85, profit: 1200 },
    { month: 'Feb', yield: 92, profit: 1350 },
    { month: 'Mar', yield: 78, profit: 1100 },
    { month: 'Apr', yield: 95, profit: 1450 },
    { month: 'May', yield: 88, profit: 1280 },
    { month: 'Jun', yield: 102, profit: 1580 }
  ];

  const cropDistributionData = [
    { name: 'Rice', value: 35, color: '#2E7D32' },
    { name: 'Wheat', value: 25, color: '#4CAF50' },
    { name: 'Maize', value: 20, color: '#66BB6A' },
    { name: 'Cotton', value: 15, color: '#81C784' },
    { name: 'Others', value: 5, color: '#A5D6A7' }
  ];

  const features = [
    {
      title: "Smart Crop Advisor",
      description: "Get AI-powered crop recommendations based on your soil, climate, and market conditions.",
      icon: <Leaf size={24} style={{ color: '#2E7D32' }} />,
      action: () => navigate('/soil-details'),
      color: '#A5D6A7',
      stats: "95% Accuracy"
    },
    {
      title: "AI Market Forecasting",
      description: "Advanced analytics to forecast market prices and optimize your harvest timing.",
      icon: <TrendingUp size={24} style={{ color: '#2E7D32' }} />,
      action: () => navigate('/price-prediction'),
      color: '#A5D6A7',
      stats: "30-Day Forecast"
    },
    {
      title: "Farm Insights Dashboard",
      description: "Track your farming performance, analyze trends, and make data-driven decisions.",
      icon: <BarChart3 size={24} style={{ color: '#2E7D32' }} />,
      action: () => navigate('/history'),
      color: '#A5D6A7',
      stats: "Real-time Data"
    },
    {
      title: "Soil Analysis Lab",
      description: "Comprehensive soil testing and detailed composition analysis for optimal results.",
      icon: <Activity size={24} style={{ color: '#2E7D32' }} />,
      action: () => navigate('/soil-details'),
      color: '#A5D6A7',
      stats: "15 Parameters"
    }
  ];

  const stats = [
    { label: 'Total Analyses', value: '247', icon: <Target size={20} />, change: '+12%' },
    { label: 'Success Rate', value: '94%', icon: <Award size={20} />, change: '+2%' },
    { label: 'Active Users', value: '1,234', icon: <Users size={20} />, change: '+8%' },
    { label: 'Avg. Profit Increase', value: '23%', icon: <TrendingUp size={20} />, change: '+5%' }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F7F6' }}>
      {/* Header */}
      <header className="bg-white shadow-lg border-b" style={{ borderColor: '#DDE7E1' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Sprout size={40} style={{ color: '#2E7D32' }} />
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#1B4332' }}>AgroVision AI</h1>
              <p className="text-sm" style={{ color: '#4F6F52' }}>From Soil to Profit – Smarter Farming Starts Here</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm" style={{ color: '#4F6F52' }}>Welcome back, {username}</p>
              <p className="text-xs" style={{ color: '#6B7F6B' }}>{currentTime.toLocaleTimeString()}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
              style={{ backgroundColor: '#FFF5F5', color: '#DC2626', border: '1px solid #FECACA' }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border" style={{ borderColor: '#DDE7E1' }}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={20} style={{ color: '#2E7D32' }} />
                <p style={{ color: '#4F6F52' }} className="text-sm">{formattedDate}</p>
              </div>
              <h2 className="text-4xl font-bold mb-3" style={{ color: '#1B4332' }}>
                Good {currentTime.getHours() < 12 ? 'morning' : currentTime.getHours() < 18 ? 'afternoon' : 'evening'}, {username}!
              </h2>
              <div className="h-1 w-32 mb-4" style={{ backgroundColor: '#2E7D32' }}></div>
              <p className="text-lg mb-6 max-w-2xl" style={{ color: '#4F6F52' }}>
                Your AI-powered agriculture companion is ready to help you make smarter farming decisions.
                Analyze your soil, get personalized crop recommendations, and forecast market prices with confidence.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/soil-details')}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: '#2E7D32' }}
                >
                  <Zap size={20} />
                  Start New Analysis
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => navigate('/price-prediction')}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: '#A5D6A7', color: '#1B4332' }}
                >
                  <TrendingUp size={20} />
                  View Market Forecast
                </button>
              </div>
            </div>
            <div className="hidden lg:block ml-8">
              <div className="relative">
                <div className="w-64 h-64 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A5D6A7' }}>
                  <Sprout size={80} style={{ color: '#2E7D32' }} />
                </div>
                <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2E7D32' }}>
                  <Award size={32} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300" style={{ borderColor: '#DDE7E1' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#4F6F52' }}>{stat.label}</p>
                  <p className="text-3xl font-bold mt-1" style={{ color: '#1B4332' }}>{stat.value}</p>
                  <p className="text-sm mt-1" style={{ color: '#2E7D32' }}>{stat.change} from last month</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#A5D6A7' }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: '#DDE7E1' }}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#1B4332' }}>
              <BarChart3 size={24} style={{ color: '#2E7D32' }} />
              Crop Performance Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cropPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDE7E1" />
                <XAxis dataKey="month" stroke="#4F6F52" />
                <YAxis stroke="#4F6F52" />
                <Tooltip contentStyle={{ backgroundColor: '#F5F7F6', border: '1px solid #DDE7E1', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="yield" stroke="#2E7D32" strokeWidth={3} dot={{ fill: '#2E7D32', strokeWidth: 2, r: 6 }} name="Yield (%)" />
                <Line type="monotone" dataKey="profit" stroke="#4CAF50" strokeWidth={3} dot={{ fill: '#4CAF50', strokeWidth: 2, r: 6 }} name="Profit ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: '#DDE7E1' }}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#1B4332' }}>
              <Target size={24} style={{ color: '#2E7D32' }} />
              Recommended Crop Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={cropDistributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {cropDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#F5F7F6', border: '1px solid #DDE7E1', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {cropDistributionData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm" style={{ color: '#4F6F52' }}>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Tiles */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: '#1B4332' }}>
            Explore Our AI-Powered Features
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 cursor-pointer group"
                style={{ borderColor: '#DDE7E1' }}
                onClick={feature.action}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: feature.color }}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-2" style={{ color: '#1B4332' }}>{feature.title}</h4>
                      <p style={{ color: '#4F6F52' }} className="text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#A5D6A7', color: '#1B4332' }}>
                    {feature.stats}
                  </span>
                  <span className="text-sm font-medium" style={{ color: '#2E7D32' }}>Get Started →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 border" style={{ borderColor: '#DDE7E1' }}>
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#1B4332' }}>Ready to Optimize Your Farm?</h3>
            <p className="text-lg mb-6" style={{ color: '#4F6F52' }}>
              Start with a comprehensive soil analysis and get AI-powered recommendations tailored to your conditions.
            </p>
            <button
              onClick={() => navigate('/soil-details')}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              style={{ backgroundColor: '#2E7D32' }}
            >
              <Sprout size={24} />
              Begin Your Analysis
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 py-8 border-t" style={{ borderColor: '#DDE7E1' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sprout size={32} style={{ color: '#2E7D32' }} />
            <span className="text-xl font-bold" style={{ color: '#1B4332' }}>AgroVision AI</span>
          </div>
          <p style={{ color: '#4F6F52' }}>© 2025 AgroVision AI - From Soil to Profit – Smarter Farming Starts Here</p>
        </div>
      </footer>
    </div>
  );
};

export default HomeDashboard;