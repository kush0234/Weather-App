import axios from "axios";
import React, { useState } from "react";
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from "react-icons/wi";
import { ClipLoader } from "react-spinners";

const getBackgroundClass = (weather) => {
  switch (weather) {
    case 'Clear': return 'bg-clear transition-all duration-700 ease-in-out';
    case 'Clouds': return 'bg-cloudy transition-all duration-700 ease-in-out';
    case 'Rain': return 'bg-rain transition-all duration-700 ease-in-out';
    case 'Snow': return 'bg-snow transition-all duration-700 ease-in-out';
    case 'Thunderstorm': return 'bg-thunderstorm transition-all duration-700 ease-in-out';
    default: return 'bg-default transition-all duration-700 ease-in-out';
  }
};

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric');

  const backgroundClass = data.weather ? getBackgroundClass(data.weather[0].main) : 'bg-default';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=600c788ef14ca29f96aafc4992c0ac5d`;


  const searchLocation = (event) => {
    if (event.key === "Enter") {
      if (!location.trim()) {
        setError('Please enter a location');
        return;
      }
      setLoading(true);
      setError('');

      const urlWithUnit = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=600c788ef14ca29f96aafc4992c0ac5d`;
      axios.get(urlWithUnit).then((response) => {
        setData(response.data);
        setLoading(false);
      }).catch(() => {
        setError('Location not found. Please try again.');
        setLoading(false);
      });
      setLocation('');
    }
  };

  const getWeatherIcon = (weather) => {
    switch (weather) {
      case 'Clear': return <WiDaySunny size={100} />;
      case 'Clouds': return <WiCloudy size={100} />;
      case 'Rain': return <WiRain size={100} />;
      case 'Snow': return <WiSnow size={100} />;
      case 'Thunderstorm': return <WiThunderstorm size={100} />;
      default: return <WiDaySunny size={100} />;
    }
  };

  return (
    <div className={`w-full h-screen relative text-white flex flex-col items-center ${backgroundClass}`}>
      <div className="text-center p-4 w-full max-w-md mx-auto">
        <input
          aria-label="Search for a location"
          className="p-2 text-lg rounded-full w-full custom-input placeholder-white text-white lg:w-full"
          type="text"
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
        />
      </div>

      {error && <p className="text-red-500 text-center mt-4 bg-red-100 p-4 rounded-md w-3/4 lg:w-1/2">{error}</p>}

      <div className="max-w-3xl h-auto mt-8 w-full flex flex-col items-center justify-center bg-gray-300 bg-opacity-30 shadow-2xl rounded-2xl">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <ClipLoader color={"#ffffff"} loading={loading} size={100} />
          </div>
        ) : (
          <div>
            {data.name !== undefined && (
              <div>
                {/* top part */}
                <div className="w-full text-center">
                  <div className="location">
                    <p className="text-[3rem]">{data.name}</p>
                  </div>
                  <div className="flex items-center justify-center my-4">
                    {data.weather ? getWeatherIcon(data.weather[0].main) : null}
                  </div>
                  <div className="temp">
                    {data.main ? (
                      <h1 className="text-[3rem] md:text-[4rem] lg:text-[4.5rem]">
                        {data.main.temp.toFixed()}°{unit === 'metric' ? 'C' : 'F'}
                      </h1>) : null}
                  </div>
                  <div className="relative mt-4">
                    {data.weather ? <p className="text-[1rem] md:text-[2rem]">{data.weather[0].main}</p> : null}
                  </div>
                </div>

                {/* Bottom part */}
                <div className="flex flex-row justify-around items-center text-center w-full mt-6 p-4">
                  <div className="feels mx-2">
                    {data.main ? (
                      <p className="font-bold text-[1rem] md:text-[1.25rem] text-gray-100">{data.main.feels_like.toFixed()}°C</p>) : null}
                    <p className="text-[0.875rem] md:text-[1rem] text-gray-300">Feels Like</p>
                  </div>
                  <div className="humidity mx-2">
                    {data.main ? (
                      <p className="font-bold text-[1rem] md:text-[1.25rem] text-gray-100">{data.main.humidity}%</p>) : null}
                    <p className="text-[0.875rem] md:text-[1rem] text-gray-300">Humidity</p>
                  </div>
                  <div className="wind mx-2">
                    {data.wind ? (
                      <p className="font-bold text-[1rem] md:text-[1.25rem] text-gray-100">{data.wind.speed.toFixed()} MPH</p>) : null}
                    <p className="text-[0.875rem] md:text-[1rem] text-gray-300">Wind Speed</p>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
