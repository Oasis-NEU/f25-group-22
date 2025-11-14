const API_KEY = import.meta.env.VITE_WEATHER_KEY;

export const getWeatherByDate = async (lat, lon, targetDate) => {
  try {
    // OpenWeather 5-day forecast (free tier)
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
    );
    const data = await response.json();

    // Find forecast closest to target date
    const target = new Date(targetDate);
    const forecasts = data.list.filter((item) => {
      const forecastDate = new Date(item.dt * 1000);
      return forecastDate.toDateString() === target.toDateString();
    });

    // If date is within 5 days, return forecast
    if (forecasts.length > 0) {
      // Get midday forecast (around noon)
      const middayForecast =
        forecasts.find((f) => {
          const hour = new Date(f.dt * 1000).getHours();
          return hour >= 11 && hour <= 14;
        }) || forecasts[0];

      return {
        temperature: Math.round(middayForecast.main.temp),
        feelsLike: Math.round(middayForecast.main.feels_like),
        tempMin: Math.round(middayForecast.main.temp_min),
        tempMax: Math.round(middayForecast.main.temp_max),
        humidity: middayForecast.main.humidity,
        description: middayForecast.weather[0].description,
        icon: middayForecast.weather[0].icon,
        windSpeed: Math.round(middayForecast.wind.speed),
        pop: Math.round(middayForecast.pop * 100), // Probability of precipitation
        isForecast: true,
        daysAway: Math.ceil((target - new Date()) / (1000 * 60 * 60 * 24)),
      };
    }

    // If date is more than 5 days away, get current weather as estimate
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
    );
    const currentData = await currentResponse.json();

    return {
      temperature: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      tempMin: Math.round(currentData.main.temp_min),
      tempMax: Math.round(currentData.main.temp_max),
      humidity: currentData.main.humidity,
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      windSpeed: Math.round(currentData.wind.speed),
      pop: 0,
      isForecast: false,
      daysAway: Math.ceil((target - new Date()) / (1000 * 60 * 60 * 24)),
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
};

export const getWeatherIcon = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};
