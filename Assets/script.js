// To get the latitude and longitude of a city that the user inputs, 
// we use the fetch method to call the OpenCage Geocoding API:

// Let's start with some global vars:
const APIKey1 = "a03e4beee32f480681623329a1fb8030";  // can use same API for both*
const APIKey2 = "d460b3121f81ff3c2ab30beee768e22b";
const city = document.getElementById("cityInput").value.trim();
const todayContainer = document.getElementById("response")
const form = document.getElementById("weatherForm");

// Let's define the city coordinates globally to use in different fetchez
let lat;
let lon;

// Once user submits a city, let's:
    // 1. prevent page from refreshing
    // 2. make sure the city field isn't empty
    // 3. feed city into OpenCageData API to get lat & lon coords
    // 4. use lat & lon in OpenWeatherMap to get current weather
    // 5. generate HTML elements and display weather data to user
form.addEventListener("submit", function(event) {
    event.preventDefault();
    if (city !== "") {  // as long as city isn't empty,
        // Make a call to the OpenCage Geocoding API to get the latitude and longitude
        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${APIKey1}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Get the latitude and longitude from the OpenCageData API response, make sure arrays are not empty:
        if (data.results[0] !== undefined && data.results[0].geometry !== undefined) {
            lat = data.results[0].geometry.lat;
            lon = data.results[0].geometry.lng;
            
            // Now that we have the lat & longitude, we can make a request to the OpenWeatherMap API using fetch:
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey2}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const date = dayjs().format("M/D/YYYY");
                const tempC = data.main.temp - 273.15 // convert temp: °C = K - 273.15
                //declare vars for all data that we need
                // have temp.. add for humidity, wind, icon 
                const wind = data.wind.speed;
                const humidity = data.main.humidity;
                const iconURL = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
                
                // create elements:
                const card = document.createElement("div");
                const cardBody = document.createElement("div");
                const heading = document.createElement("h2");
                const weatherIcon = document.createElement("img");
                const tempElement = document.createElement("p");
                const windElement = document.createElement("p");
                const humidityElement = document.createElement("p");

                // now lets give the elements attibutes b/c we're using bootstrap, want to give bs classes
                card.setAttribute("class", "card");
                cardBody.setAttribute("class", "card-body");
                //append
                card.append(cardBody);
                heading.setAttribute("class", "h3 card-title");
                tempElement.setAttribute("class", "card-text");
                windElement.setAttribute("class", "card-text");
                humidityElement.setAttribute("class", "card-text");
                weatherIcon.setAttribute("src", iconURL);
                weatherIcon.setAttribute("class", "weather-img");

                // now give all these text content
                heading.textContent = `${document.getElementById("cityInput").value.trim()} ${date}`
                heading.append(weatherIcon);
                tempElement.textContent = `Temp: ${tempC.toFixed(2)} C`
                windElement.textContent = `Wind: ${wind.toFixed(2)} mph`
                humidityElement.textContent = `Humidity: ${humidity.toFixed(0)}%`

                cardBody.append(heading, tempElement, windElement, humidityElement);
                todayContainer.innerHTML = "";
                todayContainer.append(card);
            })
            .catch(error => console.error('Error fetching weather data:', error));
        } else {
            console.error("Error fetching geolocation data: Invalid city name or no result found");
        }});
    } else {
        console.error("Error fetching geolocation data: City name cannot be empty")
    };
});

console.log(lat);
console.log(lon);
