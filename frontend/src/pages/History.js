import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  BarChart3,
  History as HistoryIcon,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Activity,
  ArrowLeft,
  Filter,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const History = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedTab, setSelectedTab] = useState('overview');

  const performanceData = [
    { date: '2024-01-01', analyses: 12, accuracy: 94, profit: 25000 },
    { date: '2024-01-08', analyses: 15, accuracy: 96, profit: 32000 },
    { date: '2024-01-15', analyses: 18, accuracy: 92, profit: 28000 },
    { date: '2024-01-22', analyses: 22, accuracy: 98, profit: 45000 },
    { date: '2024-01-29', analyses: 20, accuracy: 95, profit: 38000 }
  ];

  const cropDistribution = [
    { name: 'Rice', value: 35, color: '#2E7D32' },
    { name: 'Wheat', value: 25, color: '#4CAF50' },
    { name: 'Maize', value: 20, color: '#66BB6A' },
    { name: 'Cotton', value: 15, color: '#81C784' },
    { name: 'Others', value: 5, color: '#A5D6A7' }
  ];

  const recentAnalyses = [
    { id: 1, date: '2024-01-30', time: '14:30', crop: 'Rice', location: 'Tamil Nadu', status: 'success', accuracy: 96, profit: 12500 },
    { id: 2, date: '2024-01-29', time: '11:15', crop: 'Wheat', location: 'Punjab', status: 'success', accuracy: 94, profit: 18200 },
    { id: 3, date: '2024-01-28', time: '16:45', crop: 'Maize', location: 'Maharashtra', status: 'warning', accuracy: 87, profit: 9800 },
    { id: 4, date: '2024-01-27', time: '09:20', crop: 'Cotton', location: 'Gujarat', status: 'success', accuracy: 98, profit: 22100 }
  ];

  const stats = [
    { label: 'Total Analyses', value: '247', change: '+12%', icon: <Target size={20} />, color: '#2E7D32' },
    { label: 'Success Rate', value: '94%', change: '+2%', icon: <Award size={20} />, color: '#4CAF50' },
    { label: 'Avg. Profit Increase', value: '23%', change: '+5%', icon: <TrendingUp size={20} />, color: '#66BB6A' },
    { label: 'Active Insights', value: '89', change: '+8%', icon: <Activity size={20} />, color: '#81C784' }
  ];

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#F5F7F6' }}>
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
            style={{ backgroundColor: '#F5F7F6', color: '#4F6F52', border: '1px solid #DDE7E1' }}
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <Sprout size={32} style={{ color: '#2E7D32' }} />
            <div className="text-center">
              <h1 className="text-2xl font-bold" style={{ color: '#1B4332' }}>AgroVision AI</h1>
              <p className="text-sm" style={{ color: '#4F6F52' }}>Farm Insights Dashboard</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center border" style={{ borderColor: '#DDE7E1' }}>
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full" style={{ backgroundColor: '#A5D6A7' }}>
              <BarChart3 size={48} style={{ color: '#2E7D32' }} />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#1B4332' }}>Farm Insights Dashboard</h2>
          <p className="text-lg" style={{ color: '#4F6F52' }}>
            Track your farming performance, analyze trends, and make data-driven decisions
          </p>
          <div className="h-1 w-32 mx-auto mt-4" style={{ backgroundColor: '#2E7D32' }}></div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* Period Selector */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {['7d', '30d', '90d', '1y'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedPeriod === period ? 'text-white shadow-md' : 'hover:shadow-md'
                }`}
                style={{
                  backgroundColor: selectedPeriod === period ? '#2E7D32' : '#F5F7F6',
                  color: selectedPeriod === period ? 'white' : '#4F6F52',
                  border: selectedPeriod === period ? 'none' : '1px solid #DDE7E1'
                }}
              >
                {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : period === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
              style={{ backgroundColor: '#A5D6A7', color: '#1B4332' }}
            >
              <Filter size={18} />
              Filter
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
              style={{ backgroundColor: '#A5D6A7', color: '#1B4332' }}
            >
              <Download size={18} />
              Export
            </button>
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
                  <p className="text-sm mt-1" style={{ color: stat.color }}>{stat.change} from last period</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#A5D6A7' }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 bg-white rounded-lg p-1 shadow-lg border" style={{ borderColor: '#DDE7E1' }}>
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
            { id: 'performance', label: 'Performance', icon: <TrendingUp size={18} /> },
            { id: 'history', label: 'Analysis History', icon: <HistoryIcon size={18} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                selectedTab === tab.id ? 'shadow-md' : 'hover:bg-gray-50'
              }`}
              style={{
                backgroundColor: selectedTab === tab.id ? '#2E7D32' : 'transparent',
                color: selectedTab === tab.id ? 'white' : '#4F6F52'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: '#DDE7E1' }}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#1B4332' }}>
                <TrendingUp size={24} style={{ color: '#2E7D32' }} />
                Performance Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DDE7E1" />
                  <XAxis dataKey="date" stroke="#4F6F52" />
                  <YAxis stroke="#4F6F52" />
                  <Tooltip contentStyle={{ backgroundColor: '#F5F7F6', border: '1px solid #DDE7E1', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="analyses" stroke="#2E7D32" strokeWidth={3} name="Analyses" />
                  <Line type="monotone" dataKey="accuracy" stroke="#4CAF50" strokeWidth={3} name="Accuracy (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: '#DDE7E1' }}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#1B4332' }}>
                <Target size={24} style={{ color: '#2E7D32' }} />
                Crop Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={cropDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {cropDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#F5F7F6', border: '1px solid #DDE7E1', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {cropDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm" style={{ color: '#4F6F52' }}>{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'performance' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: '#DDE7E1' }}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#1B4332' }}>
                <TrendingUp size={24} style={{ color: '#2E7D32' }} />
                Profit Analysis
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DDE7E1" />
                  <XAxis dataKey="date" stroke="#4F6F52" />
                  <YAxis stroke="#4F6F52" />
                  <Tooltip contentStyle={{ backgroundColor: '#F5F7F6', border: '1px solid #DDE7E1', borderRadius: '8px' }} />
                  <Bar dataKey="profit" fill="#2E7D32" name="Profit (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Best Performing Crop', value: 'Cotton', sub: '98% accuracy, ₹22,100 profit', icon: <Award size={32} style={{ color: '#2E7D32' }} /> },
                { title: 'Most Analyzed', value: 'Rice', sub: '35% of total analyses', icon: <Target size={32} style={{ color: '#2E7D32' }} /> },
                { title: 'Profit Growth', value: '+23%', sub: 'Compared to last month', icon: <TrendingUp size={32} style={{ color: '#2E7D32' }} /> }
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6 border text-center" style={{ borderColor: '#DDE7E1' }}>
                  <div className="p-4 rounded-full mx-auto mb-4 w-fit" style={{ backgroundColor: '#A5D6A7' }}>
                    {card.icon}
                  </div>
                  <h4 className="font-bold text-lg mb-2" style={{ color: '#1B4332' }}>{card.title}</h4>
                  <p className="text-2xl font-bold" style={{ color: '#2E7D32' }}>{card.value}</p>
                  <p className="text-sm" style={{ color: '#4F6F52' }}>{card.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border" style={{ borderColor: '#DDE7E1' }}>
              <div className="p-6 border-b" style={{ borderColor: '#DDE7E1' }}>
                <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: '#1B4332' }}>
                  <HistoryIcon size={24} style={{ color: '#2E7D32' }} />
                  Recent Analyses
                </h3>
              </div>
              <div className="divide-y" style={{ borderColor: '#DDE7E1' }}>
                {recentAnalyses.map((analysis) => (
                  <div key={analysis.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          analysis.status === 'success' ? 'bg-green-100' :
                          analysis.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          {analysis.status === 'success' ? (
                            <CheckCircle size={20} style={{ color: '#2E7D32' }} />
                          ) : (
                            <AlertCircle size={20} style={{ color: analysis.status === 'warning' ? '#F59E0B' : '#DC2626' }} />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold" style={{ color: '#1B4332' }}>{analysis.crop}</h4>
                          <p className="text-sm" style={{ color: '#4F6F52' }}>{analysis.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock size={14} style={{ color: '#4F6F52' }} />
                          <span className="text-sm" style={{ color: '#4F6F52' }}>{analysis.date} at {analysis.time}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span style={{ color: '#4F6F52' }}>Accuracy: {analysis.accuracy}%</span>
                          <span style={{ color: '#2E7D32' }}>₹{analysis.profit.toLocaleString()}</span>
                        </div>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Eye size={18} style={{ color: '#4F6F52' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                className="flex items-center gap-2 px-6 py-3 mx-auto rounded-lg font-medium transition-all duration-300 hover:shadow-md"
                style={{ backgroundColor: '#A5D6A7', color: '#1B4332' }}
              >
                <RefreshCw size={18} />
                Load More Analyses
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;