import React, { useState, useEffect } from "react";
import axios from "axios";
import apiKeys from "./apiKeys";
import ReactAnimatedWeather from "react-animated-weather";

function Forecast(props) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [weatherName,setWeatherName]= useState("")
  
  const search = (city) => {
    axios
      .get(
        `${apiKeys.base}weather?q=${
          city != "[object Object]" ? city : query
        }&units=metric&APPID=${apiKeys.key}`
      )
      .then((response) => {
        setWeather(response.data);
        setQuery("");
        setSuggestions([]);
        setWeatherName({
          main: response.data.weather[0].main,
          description: response.data.weather[0].description
        })

      })
      .catch(function (error) {
        console.log(error);
        setWeather("");
        setQuery("");
        setError({ message: "Not Found", query: query });
      });
  };
  

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setWeather('')
    setSuggestions([]);

    // Filter cities based on the search term
    const filteredSuggestions = suggestions.filter((city) =>
      city.toLowerCase().startsWith(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (city)=>{
    setQuery(city)
    search(city)
  }

  const iconType= (weatherCondition) => {
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

  const defaults = {
    color: "white",
    size: 112,
    animate: true,
  };

    // Fetch suggestions from an API or use a predefined list
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=10&appid=${apiKeys.key}`
        );

        const cityData = response.data.list.map((item) => item.name);
        const cities = [...new Set(cityData)]
        
        setSuggestions(cities);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          if (query.length === 0) {
            // Fetch weather data for current location
            const getPosition = () => {
              return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
              });
            };
            // Get user's current location
            const position = await getPosition();
            const { latitude, longitude } = position.coords;
            // Fetch weather data for user's current location
            const api_call = await fetch(
              `${apiKeys.base}weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${apiKeys.key}`
            );
            const data = await api_call.json();
    
            setWeather(data);
            setWeatherName({
              main: data.weather[0].main,
              description: data.weather[0].description
            });
          } else {
            // Fetch suggestions based on the search query
            
            fetchSuggestions();
          }
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      };
    
      fetchData();
    }, [query]);
      

  return (
    <div className="forecast">
      <div className="forecast-icon">
        <ReactAnimatedWeather
          icon={iconType(weatherName.main)}
          color={defaults.color}
          size={defaults.size}
          animate={defaults.animate}
        />
      </div>
      <div className="today-weather">
        <h3>{weatherName.description}</h3>

        <div className="search-box">
          <div style={{display: "flex"}}>
          <input
            type="text"
            className="search-bar"
            placeholder="Search any city"
            onChange={handleInputChange}
            value={query}
          />
          <div className="img-box">
            {" "}
            <img
              src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
              onClick={search}
            />
          </div>
          </div>
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((city, index) => (
                <li key={index} className="suggestion-item" onClick={() => handleSuggestionClick(city)}>
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
        <ul>
          {typeof weather.main != "undefined" ? (
            <div>
              {" "}
              <li className="cityHead">
                <p>
                  {weather.name}, {weather.sys.country}
                </p>
                <img
                  className="temp"
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                />
              </li>
              <li>
                Temperature{" "}
                <span className="temp">
                  {Math.round(weather.main.temp)}°c ({weather.weather[0].main})
                </span>
              </li>
              <li>
                Humidity{" "}
                <span className="temp">
                  {Math.round(weather.main.humidity)}%
                </span>
              </li>
              <li>
                Visibility{" "}
                <span className="temp">
                  {Math.round(weather.visibility)} mi
                </span>
              </li>
              <li>
                Wind Speed{" "}
                <span className="temp">
                  {Math.round(weather.wind.speed)} Km/h
                </span>
              </li>
            </div>
          ) : (
            <li>
              {error.query} {error.message}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
export default Forecast;