// make a request to the OpenWeatherMap API using the 'fetch' function:
const getWeather = document.getElementById("getWeather")

function generateWeather(event) {
  event.preventDefault();
  const APIKey = d460b3121f81ff3c2ab30beee768e22b;
  const city = document.getElementById("cityInput").value.trim();
    console.log(city);

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      document.getElementById('response').innerHTML = `Temp: ${data.main.temp}`;
 
    })
    .catch(error => console.error('Error fetching weather data:', error));
};

getWeather.addEventListener("submit", generateWeather);