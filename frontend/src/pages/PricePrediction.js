import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PricePredictionForm from "../components/PricePredictionForm";
import PricePredictionChart from "../components/PricePredictionChart";
import PricePredictionTable from "../components/PricePredictionTable";
import FailedPredictions from "../components/FailedPredictions";
import NoPredictionsMessage from "../components/NoPredictionsMessage";
import BackToHomeButton from "../components/BackToHomeButton";
import {
  Sprout,
  TrendingUp,
  BarChart3,
  ArrowLeft,
  AlertTriangle,
  Calendar,
  IndianRupee
} from "lucide-react";

const PricePrediction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState({});
  const [failedPredictions, setFailedPredictions] = useState({});
  const [timeframe, setTimeframe] = useState("one_month");
  const [error, setError] = useState("");

  const formatChartData = () => {
    if (!predictions || Object.keys(predictions).length === 0) return [];

    const chartData = [];
    const successfulCommodities = Object.keys(predictions);
    if (successfulCommodities.length === 0) return [];

    const dates =
      predictions[successfulCommodities[0]]?.predictions[timeframe]?.dates || [];
    if (!dates.length) return [];

    dates.forEach((date, index) => {
      const dataPoint = { date };
      successfulCommodities.forEach((commodity) => {
        const prices =
          predictions[commodity]?.predictions[timeframe]?.predicted_prices || [];
        dataPoint[commodity] = prices[index] || null;
      });
      chartData.push(dataPoint);
    });

    return chartData;
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#F5F7F6' }}>
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
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
              <p className="text-sm" style={{ color: '#4F6F52' }}>AI Market Forecasting</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center border" style={{ borderColor: '#DDE7E1' }}>
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full" style={{ backgroundColor: '#A5D6A7' }}>
              <TrendingUp size={48} style={{ color: '#2E7D32' }} />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#1B4332' }}>Agricultural Market Price Forecasting</h2>
          <p className="text-lg" style={{ color: '#4F6F52' }}>
            Advanced AI analytics to predict commodity prices and optimize your harvest timing
          </p>
          <div className="h-1 w-32 mx-auto mt-4" style={{ backgroundColor: '#2E7D32' }}></div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border" style={{ borderColor: '#DDE7E1' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#A5D6A7' }}>
              <BarChart3 size={24} style={{ color: '#2E7D32' }} />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#1B4332' }}>Market Analysis Parameters</h3>
              <p style={{ color: '#4F6F52' }}>Select commodities and timeframes for price forecasting</p>
            </div>
          </div>
          <PricePredictionForm
            setPredictions={setPredictions}
            setFailedPredictions={setFailedPredictions}
            setError={setError}
            location={location}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border" style={{ borderColor: '#DDE7E1' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF5F5' }}>
                <AlertTriangle size={24} style={{ color: '#DC2626' }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: '#1B4332' }}>Analysis Error</h3>
                <p style={{ color: '#DC2626' }}>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {(Object.keys(predictions).length > 0 || Object.keys(failedPredictions).length > 0) && (
          <div className="space-y-8">
            {formatChartData().length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 border" style={{ borderColor: '#DDE7E1' }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#A5D6A7' }}>
                    <TrendingUp size={24} style={{ color: '#2E7D32' }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: '#1B4332' }}>Price Trend Analysis</h3>
                    <p style={{ color: '#4F6F52' }}>Interactive charts showing predicted price movements over time</p>
                  </div>
                </div>
                <PricePredictionChart
                  predictions={predictions}
                  timeframe={timeframe}
                  setTimeframe={setTimeframe}
                  formatChartData={formatChartData}
                />
              </div>
            )}

            {formatChartData().length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 border" style={{ borderColor: '#DDE7E1' }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#A5D6A7' }}>
                    <IndianRupee size={24} style={{ color: '#2E7D32' }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: '#1B4332' }}>Detailed Price Predictions</h3>
                    <p style={{ color: '#4F6F52' }}>Comprehensive price data with dates and forecasted values</p>
                  </div>
                </div>
                <PricePredictionTable predictions={predictions} formatChartData={formatChartData} />
              </div>
            )}

            {Object.keys(failedPredictions).length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 border" style={{ borderColor: '#DDE7E1' }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF9C4' }}>
                    <AlertTriangle size={24} style={{ color: '#F59E0B' }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: '#1B4332' }}>Prediction Issues</h3>
                    <p style={{ color: '#4F6F52' }}>Commodities that could not be analyzed</p>
                  </div>
                </div>
                <FailedPredictions failedPredictions={failedPredictions} />
              </div>
            )}

            {Object.keys(predictions).length === 0 && Object.keys(failedPredictions).length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 border text-center" style={{ borderColor: '#DDE7E1' }}>
                <NoPredictionsMessage />
              </div>
            )}

            <div className="flex justify-center">
              <BackToHomeButton />
            </div>
          </div>
        )}

        {/* Info Cards */}
        {(!Object.keys(predictions).length && !Object.keys(failedPredictions).length) && (
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              { icon: <Calendar size={20} style={{ color: '#2E7D32' }} />, title: 'Multiple Timeframes', desc: 'Get predictions for 1 month, 3 months, or 6 months ahead to plan your harvest timing.' },
              { icon: <BarChart3 size={20} style={{ color: '#2E7D32' }} />, title: 'Interactive Charts', desc: 'Visualize price trends with interactive charts and detailed data tables.' },
              { icon: <TrendingUp size={20} style={{ color: '#2E7D32' }} />, title: 'AI-Powered Accuracy', desc: 'Advanced machine learning models trained on historical market data for reliable predictions.' }
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: '#DDE7E1' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#A5D6A7' }}>
                    {card.icon}
                  </div>
                  <h3 className="font-semibold" style={{ color: '#1B4332' }}>{card.title}</h3>
                </div>
                <p className="text-sm" style={{ color: '#4F6F52' }}>{card.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PricePrediction;