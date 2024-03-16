import React, { useState, useEffect } from "react";
import Clock from "react-live-clock";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";
import Forecast from "./Forecast";
import apiKeys from "./apiKeys";

const dateBuilder = (d) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];
  const day = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day}, ${date} ${month} ${year}`;
};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);

  const getPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const getWeather = async (lat, lon) => {
    try {
      const api_call = await fetch(
        `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
      );
      const data = await api_call.json();
      setWeatherData({
        lat,
        lon,
        city: data.name,
        temperatureC: Math.round(data.main.temp),
        temperatureF: Math.round(data.main.temp * 1.8 + 32),
        humidity: data.main.humidity,
        main: data.weather[0].main,
        country: data.sys.country,
        icon: getWeatherIcon(data.weather[0].main),
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
  
  const getWeatherIcon = (weatherCondition) => {
    switch (weatherCondition) {
      case "Haze":
        return "CLEAR_DAY";
      case "Clouds":
        return "CLOUDY";
      case "Rain":
        return "RAIN";
      case "Snow":
        return "SNOW";
      case "Dust":
        return "WIND";
      case "Drizzle":
        return "SLEET";
      case "Fog":
      case "Smoke":
        return "FOG";
      case "Tornado":
        return "WIND";
      default:
        return "CLEAR_DAY";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (navigator.geolocation) {
          const position = await getPosition();
          getWeather(position.coords.latitude, position.coords.longitude);
        } else {
          alert("Geolocation not available");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchData();

    const timerID = setInterval(fetchData, 600000);

    return () => clearInterval(timerID);
  }, []);

  return (
    <React.Fragment>
      {loading ? (
        <React.Fragment>
          <img
            src={loader}
            style={{ width: "50%", WebkitUserDrag: "none" }}
            alt="loading"
          />
          <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
            Detecting your location
          </h3>
          <h3 style={{ color: "white", marginTop: "10px" }}>
            Your current location will be displayed on the App <br />
            & used for calculating Real time weather.
          </h3>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="city">
            <div className="title">
              <h2>{weatherData.city}</h2>
              <h3>{weatherData.country}</h3>
            </div>
            <div className="mb-icon">
              {" "}
              <ReactAnimatedWeather
                icon={weatherData.icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />
              <p>{weatherData.main}</p>
            </div>
            <div className="date-time">
              <div className="dmy">
                <div id="txt"></div>
                <div className="current-time">
                  <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                </div>
                <div className="current-date">
                  {dateBuilder(new Date())}
                </div>
              </div>
              <div className="temperature">
                <p>
                  {weatherData.temperatureC}°<span>C</span>
                </p>
              </div>
            </div>
          </div>
          <Forecast icon={weatherData.icon} weather={weatherData.main} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Weather;
