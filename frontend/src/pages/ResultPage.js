import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sprout,
  Leaf,
  TrendingUp,
  Calculator,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  RotateCcw,
  DollarSign,
  Target,
  Award,
  ChevronRight,
  BarChart3
} from "lucide-react";

const ResultPage = () => {
  const location = useLocation();
  const prediction = location.state?.prediction;
  const navigate = useNavigate();

  const [profitData, setProfitData] = useState({
    area: '',
    yield: '',
    marketPrice: '',
    cultivationCost: ''
  });
  const [estimatedProfit, setEstimatedProfit] = useState(null);

  const calculateProfit = () => {
    const area = parseFloat(profitData.area) || 0;
    const yieldPerArea = parseFloat(profitData.yield) || 0;
    const marketPrice = parseFloat(profitData.marketPrice) || 0;
    const cultivationCost = parseFloat(profitData.cultivationCost) || 0;

    const totalYield = area * yieldPerArea;
    const totalRevenue = totalYield * marketPrice;
    const totalCost = area * cultivationCost;
    const profit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    setEstimatedProfit({ totalYield, totalRevenue, totalCost, profit, profitMargin });
  };

  if (!prediction) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4" style={{ backgroundColor: '#F5F7F6' }}>
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md border" style={{ borderColor: '#DDE7E1' }}>
          <div className="p-4 rounded-full mx-auto mb-4 w-fit" style={{ backgroundColor: '#FFF5F5' }}>
            <AlertTriangle size={48} style={{ color: '#DC2626' }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1B4332' }}>No Prediction Data</h2>
          <p className="mb-6" style={{ color: '#4F6F52' }}>Sorry, we couldn't find any prediction data for your query.</p>
          <button
            onClick={() => navigate("/soil-details")}
            className="px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
            style={{ backgroundColor: '#2E7D32' }}
          >
            Try Another Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#F5F7F6' }}>
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sprout size={32} style={{ color: '#2E7D32' }} />
          <div className="text-center">
            <h1 className="text-2xl font-bold" style={{ color: '#1B4332' }}>AgroVision AI</h1>
            <p className="text-sm" style={{ color: '#4F6F52' }}>Smart Crop Advisor Results</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center border" style={{ borderColor: '#DDE7E1' }}>
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full" style={{ backgroundColor: '#A5D6A7' }}>
              <CheckCircle size={48} style={{ color: '#2E7D32' }} />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1B4332' }}>AI Analysis Complete!</h1>
          <p className="text-lg" style={{ color: '#4F6F52' }}>Your personalized crop recommendations are ready</p>
          <div className="h-1 w-32 mx-auto mt-4" style={{ backgroundColor: '#2E7D32' }}></div>
        </div>

        {prediction.error ? (
          <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: '#DDE7E1' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF5F5' }}>
                <AlertTriangle size={24} style={{ color: '#DC2626' }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: '#1B4332' }}>Analysis Error</h3>
                <p style={{ color: '#DC2626' }}>{prediction.error}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Main Crop Recommendation */}
            <div className="bg-white rounded-xl shadow-lg p-8 border" style={{ borderColor: '#DDE7E1' }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#A5D6A7' }}>
                  <Award size={24} style={{ color: '#2E7D32' }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#1B4332' }}>Primary Crop Recommendation</h2>
                  <p style={{ color: '#4F6F52' }}>Based on your soil analysis and weather conditions</p>
                </div>
              </div>
              <div className="flex items-center justify-center p-8 rounded-lg" style={{ backgroundColor: '#A5D6A7' }}>
                <div className="text-center">
                  <div className="p-4 rounded-full mx-auto mb-4 w-fit" style={{ backgroundColor: '#2E7D32' }}>
                    <Leaf size={32} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{prediction.main_crop}</h3>
                  <p className="text-white opacity-90">Optimal choice for your conditions</p>
                </div>
              </div>
            </div>

            {/* Sub-Crops */}
            <div className="bg-white rounded-xl shadow-lg p-8 border" style={{ borderColor: '#DDE7E1' }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#A5D6A7' }}>
                  <Target size={24} style={{ color: '#2E7D32' }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#1B4332' }}>Compatible Sub-Crops</h2>
                  <p style={{ color: '#4F6F52' }}>Additional crops that complement your primary choice</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {prediction.sub_crops.map((crop, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border hover:shadow-md transition-all duration-300" style={{ borderColor: '#DDE7E1' }}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: '#A5D6A7' }}>
                        <CheckCircle size={20} style={{ color: '#2E7D32' }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold" style={{ color: '#1B4332' }}>{crop.sub_crop}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(100 - crop.distance)}%`, backgroundColor: '#2E7D32' }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium" style={{ color: '#4F6F52' }}>
                            {(100 - crop.distance).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profit Estimator */}
            <div className="bg-white rounded-xl shadow-lg p-8 border" style={{ borderColor: '#DDE7E1' }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#A5D6A7' }}>
                  <Calculator size={24} style={{ color: '#2E7D32' }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#1B4332' }}>Profit Estimator</h2>
                  <p style={{ color: '#4F6F52' }}>Calculate potential profitability for your recommended crops</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {[
                  { label: 'Land Area (acres/hectares)', key: 'area', placeholder: 'Enter area' },
                  { label: 'Expected Yield (kg per acre/hectare)', key: 'yield', placeholder: 'Enter expected yield' },
                  { label: 'Market Price (₹ per kg)', key: 'marketPrice', placeholder: 'Enter market price' },
                  { label: 'Cultivation Cost (₹ per acre/hectare)', key: 'cultivationCost', placeholder: 'Enter cultivation cost' }
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1B4332' }}>{field.label}</label>
                    <input
                      type="number"
                      placeholder={field.placeholder}
                      value={profitData[field.key]}
                      onChange={(e) => setProfitData({ ...profitData, [field.key]: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      style={{ backgroundColor: '#F5F7F6', borderColor: '#DDE7E1' }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-center mb-6">
                <button
                  onClick={calculateProfit}
                  className="px-8 py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  style={{ backgroundColor: '#2E7D32' }}
                >
                  <Calculator size={20} />
                  Calculate Profit
                </button>
              </div>

              {estimatedProfit && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border" style={{ borderColor: '#DDE7E1' }}>
                  <h3 className="text-xl font-bold mb-4 text-center" style={{ color: '#1B4332' }}>Profit Analysis</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Yield', value: `${estimatedProfit.totalYield.toFixed(1)} kg`, icon: <Target size={24} style={{ color: '#2E7D32' }} /> },
                      { label: 'Revenue', value: `₹${estimatedProfit.totalRevenue.toFixed(0)}`, icon: <DollarSign size={24} style={{ color: '#2E7D32' }} /> },
                      { label: 'Costs', value: `₹${estimatedProfit.totalCost.toFixed(0)}`, icon: <TrendingUp size={24} style={{ color: '#2E7D32' }} /> },
                      { label: 'Net Profit', value: `₹${estimatedProfit.profit.toFixed(0)}`, sub: `(${estimatedProfit.profitMargin.toFixed(1)}% margin)`, icon: <Award size={24} style={{ color: estimatedProfit.profit > 0 ? '#2E7D32' : '#DC2626' }} />, bg: estimatedProfit.profit > 0 ? '#A5D6A7' : '#FFF5F5' }
                    ].map((item, i) => (
                      <div key={i} className="text-center">
                        <div className="p-3 rounded-lg mb-2 mx-auto w-fit" style={{ backgroundColor: item.bg || '#A5D6A7' }}>
                          {item.icon}
                        </div>
                        <p className="text-sm" style={{ color: '#4F6F52' }}>{item.label}</p>
                        <p className="text-lg font-bold" style={{ color: '#1B4332' }}>{item.value}</p>
                        {item.sub && <p className={`text-sm ${estimatedProfit.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>{item.sub}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Warnings */}
            {prediction.warnings && (
              <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: '#DDE7E1' }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF9C4' }}>
                    <AlertTriangle size={24} style={{ color: '#F59E0B' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: '#1B4332' }}>Important Considerations</h3>
                    <p style={{ color: '#4F6F52' }}>{prediction.warnings}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: '#DDE7E1' }}>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
                  style={{ backgroundColor: '#F5F7F6', color: '#4F6F52', border: '1px solid #DDE7E1' }}
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
                <button
                  onClick={() => navigate("/soil-details")}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
                  style={{ backgroundColor: '#A5D6A7', color: '#1B4332' }}
                >
                  <RotateCcw size={18} />
                  New Analysis
                </button>
                <button
                  onClick={() => navigate("/price-prediction", { state: { crops: { main: prediction.main_crop, subs: prediction.sub_crops } } })}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: '#2E7D32' }}
                >
                  <BarChart3 size={18} />
                  Market Forecast
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultPage;