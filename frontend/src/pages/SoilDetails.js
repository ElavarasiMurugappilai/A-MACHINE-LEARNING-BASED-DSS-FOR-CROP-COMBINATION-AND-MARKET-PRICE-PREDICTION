import React from "react";
import { useNavigate } from "react-router-dom";
import SoilInputForm from "../components/SoilInputForm";
import WeatherSelector from "../components/WeatherSelector";
import WeatherDisplay from "../components/WeatherDisplay";
import ErrorMessage from "../components/ErrorMessage";
import useWeatherData from "../hooks/useWeatherData";
import axios from "axios";
import {
  Sprout,
  Leaf,
  Cloud,
  TestTube,
  ArrowLeft,
  ArrowRight,
  Loader2,
  HelpCircle,
  Zap,
  Info,
  CheckCircle
} from "lucide-react";

const SoilDetails = () => {
  const navigate = useNavigate();

  const [soilData, setSoilData] = React.useState({
    nitrogen: "",
    potassium: "",
    phosphorus: "",
    ph: "",
  });
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);

  const {
    weatherData,
    cumulativeRainfall,
    fetchWeather,
    setFetchWeather,
    autoFetch,
    setAutoFetch,
    pincode,
    setPincode,
    error: weatherError,
    setError: setWeatherError,
  } = useWeatherData();

  const handlePredict = async () => {
    const { nitrogen, phosphorus, potassium, ph } = soilData;

    if (!nitrogen || !phosphorus || !potassium || !ph) {
      setError("Please fill in all soil composition fields (N, P, K, pH).");
      return;
    }

    if (!fetchWeather) {
      setError("Please enable weather fetching to proceed.");
      return;
    }

    if (!weatherData) {
      setError("Weather data not available. Please check your settings and try again.");
      return;
    }

    const requestData = {
      N: Number(nitrogen),
      P: Number(phosphorus),
      K: Number(potassium),
      temperature: weatherData.current.temp || 0,
      humidity: weatherData.current.humidity || 0,
      ph: Number(ph),
      rainfall: cumulativeRainfall || 0,
    };

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", requestData);
      const prediction = response.data;
      navigate("/result", { state: { prediction } });
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to get prediction.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: "Soil Analysis", icon: <TestTube size={20} />, description: "Enter soil composition" },
    { id: 2, title: "Weather Data", icon: <Cloud size={20} />, description: "Configure weather settings" },
    { id: 3, title: "AI Prediction", icon: <Leaf size={20} />, description: "Get crop recommendations" }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F7F6' }}>
      {/* Header */}
      <header className="bg-white shadow-lg border-b" style={{ borderColor: '#DDE7E1' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Sprout size={32} style={{ color: '#2E7D32' }} />
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#1B4332' }}>AgroVision AI</h1>
              <p className="text-xs" style={{ color: '#4F6F52' }}>Smart Crop Advisor</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
            style={{ backgroundColor: '#A5D6A7', color: '#1B4332' }}
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentStep >= step.id ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                }`}>
                  <div className={`p-2 rounded-full ${
                    currentStep >= step.id ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
                  }`}>
                    {step.icon}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs opacity-75">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden" style={{ borderColor: '#DDE7E1' }}>
          <div className="px-8 py-6 border-b" style={{ backgroundColor: '#A5D6A7', borderColor: '#DDE7E1' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#2E7D32' }}>
                <Leaf size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: '#1B4332' }}>Land Analysis & Weather Configuration</h2>
                <p style={{ color: '#4F6F52' }}>Enter your soil parameters and weather data for AI-powered crop recommendations</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Soil Composition Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#A5D6A7' }}>
                  <TestTube size={24} style={{ color: '#2E7D32' }} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold" style={{ color: '#1B4332' }}>Soil Composition Analysis</h3>
                  <p style={{ color: '#4F6F52' }}>Enter your soil nutrient levels for comprehensive analysis</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 border" style={{ borderColor: '#DDE7E1' }}>
                <SoilInputForm soilData={soilData} setSoilData={setSoilData} />
              </div>
            </div>

            {/* Weather Information Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#A5D6A7' }}>
                  <Cloud size={24} style={{ color: '#2E7D32' }} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold" style={{ color: '#1B4332' }}>Weather Data Configuration</h3>
                  <p style={{ color: '#4F6F52' }}>Configure weather settings to optimize crop recommendations</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 border" style={{ borderColor: '#DDE7E1' }}>
                <WeatherSelector
                  fetchWeather={fetchWeather}
                  setFetchWeather={setFetchWeather}
                  autoFetch={autoFetch}
                  setAutoFetch={setAutoFetch}
                />
                <div className="mt-6">
                  <WeatherDisplay
                    fetchWeather={fetchWeather}
                    weatherData={weatherData}
                    cumulativeRainfall={cumulativeRainfall}
                    pincode={pincode}
                    setPincode={setPincode}
                    autoFetch={autoFetch}
                  />
                </div>
              </div>
            </div>

            <ErrorMessage error={error || weatherError} />

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: '#DDE7E1' }}>
              <button
                onClick={() => navigate('/home')}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
                style={{ backgroundColor: '#F5F7F6', color: '#4F6F52', border: '1px solid #DDE7E1' }}
              >
                <ArrowLeft size={18} />
                Back to Dashboard
              </button>

              <button
                onClick={handlePredict}
                disabled={loading}
                className="flex items-center gap-3 px-8 py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#2E7D32' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Analysis...
                  </>
                ) : (
                  <>
                    Get AI Recommendations
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Help Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: '#DDE7E1' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#A5D6A7' }}>
                <HelpCircle size={20} style={{ color: '#2E7D32' }} />
              </div>
              <h3 className="font-semibold" style={{ color: '#1B4332' }}>Soil Parameters Guide</h3>
            </div>
            <p className="text-sm" style={{ color: '#4F6F52' }}>
              Ideal N, P, K values range between 0-100. pH typically ranges from 0-14, with 7 being neutral.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: '#DDE7E1' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#A5D6A7' }}>
                <Zap size={20} style={{ color: '#2E7D32' }} />
              </div>
              <h3 className="font-semibold" style={{ color: '#1B4332' }}>Weather Integration</h3>
            </div>
            <p className="text-sm" style={{ color: '#4F6F52' }}>
              Enable auto-fetch to use your current location or enter a pincode manually for accurate weather data.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: '#DDE7E1' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#A5D6A7' }}>
                <Info size={20} style={{ color: '#2E7D32' }} />
              </div>
              <h3 className="font-semibold" style={{ color: '#1B4332' }}>Measurement Units</h3>
            </div>
            <p className="text-sm" style={{ color: '#4F6F52' }}>
              Rainfall is measured in mm. Temperature is in Celsius. Humidity is measured as a percentage.
            </p>
          </div>
        </div>

        {/* Success Tips */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border" style={{ borderColor: '#DDE7E1' }}>
          <div className="flex items-start gap-4">
            <CheckCircle size={24} style={{ color: '#2E7D32' }} className="mt-1" />
            <div>
              <h3 className="font-semibold mb-2" style={{ color: '#1B4332' }}>Pro Tips for Better Results</h3>
              <ul className="text-sm space-y-1" style={{ color: '#4F6F52' }}>
                <li>• Use recent soil test results for accurate nutrient levels</li>
                <li>• Enable weather fetching for real-time climate data</li>
                <li>• Consider seasonal variations when interpreting recommendations</li>
                <li>• Combine AI suggestions with your local farming expertise</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilDetails;