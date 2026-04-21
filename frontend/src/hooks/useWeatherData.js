import { useState, useEffect } from "react";
import axios from "axios";

const useWeatherData = () => {
  const [weatherData, setWeatherData]           = useState(null);
  const [cumulativeRainfall, setCumulativeRainfall] = useState(0);
  const [fetchWeather, setFetchWeather]         = useState(false);
  const [autoFetch, setAutoFetch]               = useState(false);
  const [pincode, setPincode]                   = useState("");
  const [error, setError]                       = useState("");
  const [loading, setLoading]                   = useState(false);

  const apiKey = "4fb4ab3828a77ad38f04560066b6bdd3";

  const fetchWeatherData = async (lat, lon) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m&daily=precipitation_sum&timezone=Asia/Kolkata&forecast_days=7`
      );
      const data = response.data;

      // FIX: Use current hour index instead of always index 0 (midnight)
      // Index 0 = midnight, so at 11 AM we need index 11
      const now              = new Date();
      const currentHourIndex = now.getHours(); // 0–23

      // Get temperature — try current hour first, fall back nearby hours
      let currentTemp = null;
      for (let offset = 0; offset <= 3; offset++) {
        const idx = currentHourIndex + offset;
        if (data.hourly.temperature_2m[idx] != null) {
          currentTemp = data.hourly.temperature_2m[idx];
          break;
        }
        if (currentHourIndex - offset >= 0 && data.hourly.temperature_2m[currentHourIndex - offset] != null) {
          currentTemp = data.hourly.temperature_2m[currentHourIndex - offset];
          break;
        }
      }
      // Hard fallback for Tamil Nadu if API gives nothing
      if (currentTemp == null || isNaN(currentTemp)) currentTemp = 30;

      // Get humidity — same approach
      let currentHumidity = null;
      for (let offset = 0; offset <= 3; offset++) {
        const idx = currentHourIndex + offset;
        if (data.hourly.relative_humidity_2m[idx] != null) {
          currentHumidity = data.hourly.relative_humidity_2m[idx];
          break;
        }
        if (currentHourIndex - offset >= 0 && data.hourly.relative_humidity_2m[currentHourIndex - offset] != null) {
          currentHumidity = data.hourly.relative_humidity_2m[currentHourIndex - offset];
          break;
        }
      }
      if (currentHumidity == null || isNaN(currentHumidity)) currentHumidity = 70;

      // Clamp to valid ranges
      currentTemp     = Math.max(5,  Math.min(50,  Number(currentTemp)));
      currentHumidity = Math.max(10, Math.min(100, Number(currentHumidity)));

      setWeatherData({
        current: { temp: currentTemp, humidity: currentHumidity },
        daily:   data.daily.precipitation_sum.map((rain) => ({ rain: rain || 0 })),
      });

      // Total 7-day rainfall — default 0 if null
      const totalRainfall = data.daily.precipitation_sum
        .slice(0, 7)
        .reduce((sum, rain) => sum + (rain || 0), 0);
      // Clamp to valid range
      setCumulativeRainfall(Math.max(0, Math.min(500, totalRainfall)));

      setError("");
      console.log(`Weather loaded: temp=${currentTemp}°C, humidity=${currentHumidity}%, rainfall=${totalRainfall}mm`);
    } catch (err) {
      console.error("Weather fetch error:", err.message);
      setError(`Failed to fetch weather data: ${err.message}`);
      setWeatherData(null);
      setCumulativeRainfall(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoordinatesFromPincode = async (pincode) => {
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit Indian pincode.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/geo/1.0/zip?zip=${pincode},IN&appid=${apiKey}`,
        { timeout: 5000 }
      );
      const { lat, lon } = response.data;
      await fetchWeatherData(lat, lon);
    } catch (err) {
      setError(`Invalid pincode or failed to fetch coordinates: ${err.message}`);
      setWeatherData(null);
      setCumulativeRainfall(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (err) => {
          setError("Failed to access your location. Please allow location access or enter a pincode.");
          setWeatherData(null);
          setCumulativeRainfall(0);
          setLoading(false);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    if (fetchWeather) {
      if (autoFetch) {
        fetchUserLocation();
      } else if (pincode) {
        fetchCoordinatesFromPincode(pincode);
      } else {
        setWeatherData(null);
        setCumulativeRainfall(0);
        setError("Please enter a pincode or enable auto-fetch.");
      }
    } else {
      setWeatherData(null);
      setCumulativeRainfall(0);
      setError("");
    }
  }, [fetchWeather, autoFetch, pincode]);

  return {
    weatherData,
    cumulativeRainfall,
    fetchWeather, setFetchWeather,
    autoFetch,    setAutoFetch,
    pincode,      setPincode,
    error,        setError,
    loading,
  };
};

export default useWeatherData;