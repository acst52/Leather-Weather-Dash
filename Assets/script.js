// To get the latitude and longitude of a city that the user inputs, 
// we use the fetch method to call the OpenCage Geocoding API:


const form = document.getElementById("weatherForm");
form.addEventListener("submit", function(event) {
    event.preventDefault();
    const APIKey1 = "a03e4beee32f480681623329a1fb8030";
    const APIKey2 = "d460b3121f81ff3c2ab30beee768e22b";
    // Get the user's input
    const city = document.getElementById("cityInput").value.trim();
    if (city !== "") {  // as long as city isn't empty,
        // Make a call to the OpenCage Geocoding API to get the latitude and longitude
        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${APIKey1}`)
        .then(response => response.json())
        .then(data => {
            // Get the latitude and longitude from the OpenCageData API response, make sure arrays are not empty:
        if (data.results[0] !== undefined && data.results[0].geometry !== undefined) {
            const lat = data.results[0].geometry.lat;
            const lon = data.results[0].geometry.lng;
            
            // Now that we have the lat & longitude, we can make a request to the OpenWeatherMap API using fetch:
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey2}`)
            .then(response => response.json())
            .then(data => {
              document.getElementById('response').innerHTML = `Temp: ${data.main.temp}`;
            })
            .catch(error => console.error('Error fetching weather data:', error));
        } else {
            console.error("Error fetching geolocation data: Invalid city name or no result found");
        }});
    } else {
        console.error("Error fetching geolocation data: City name cannot be empty")
    }
});

// add some error handling and validation to code to make sure user enters a valid 
    // city name & that the API is returning the expected data.

// NOTE: °C = K - 273.15 ; 
      // °F = (K − 273.15) × 9/5 + 32
