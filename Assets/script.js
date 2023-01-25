// To get the latitude and longitude of a city that the user inputs, 
// we use the fetch method to call the OpenCage Geocoding API:

// Let's start with some global vars:
const APIKey1 = "a03e4beee32f480681623329a1fb8030";  // can use same API for both*
const APIKey2 = "d460b3121f81ff3c2ab30beee768e22b";
// const city = document.getElementById("cityInput").value.trim();
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
    // if loop seemed to be messing up city input above so commented out for now:
    // if (city !== "") {  // as long as city isn't empty,
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
                // append
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
       // console.error("Error fetching geolocation data: City name cannot be empty")
   // };  - was closing now commented out if statement above
});

console.log(lat);
console.log(lon);

// Now lets fetch the 5-day forecast data of user city using lat & lon generated in the first fetch:
let forecastData;
let container = document.querySelector(".container-flex");

fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=51&appid=${APIKey2}`)
    .then(response => response.json())
    .then(data => {
        forecastData = data;
        console.log(forecastData);
    // const date = dayjs().format("M/D/YYYY");
    // now that 5-6 days of weather data, updated every 3 hours has been returned by the API,
    // we must loop through weather data & get all the temps at a certain time point:
for (var i = 2; i < data.list.length; i+=8) {
        var date = data.list[i].dt_txt.split(" ")[0];
        var icon = `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;
        var temperature = data.list[i].main.temp - 273.15;
        var humidity = data.list[i].main.humidity;
        var windSpeed = data.list[i].wind.speed;

        // create a new div to add each 8th i forecast:
        var forecast = document.createElement("div");
        var forecastCard = document.createElement("div");
        var forecastCardBody = document.createElement("div");
        var forecastHeading = document.createElement("h3");
        var iconImg = document.createElement("img");
        iconImg.setAttribute("src", icon);
        var forecastTemp = document.createElement("p");
        var forecastHumidity = document.createElement("p");
        var forecastWind = document.createElement("p");
        
        forecast.append(forecastCard);
        forecastCard.append(forecastCardBody);
        forecastCardBody.append(forecastHeading, forecastTemp, forecastHumidity, forecastWind);

        forecast.setAttribute("class", "col-md");
        forecastCard.setAttribute("class", "card bg-primary h-100 text-white");
        forecastCardBody.setAttribute("class", "card-body p-2");
        forecastHeading.setAttribute("class", "card-title");
        forecastTemp.setAttribute("class", "card-text");
        forecastHumidity.setAttribute("class", "card-text");
        forecastWind.setAttribute("class", "card-text");

        forecastHeading.textContent = `${date}`;
        forecastHeading.append(iconImg);
        forecastTemp.textContent = `Temp: ${temperature.toFixed(0)}C`;
        forecastHumidity.textContent = `Humidity: ${humidity}%`;
        forecastWind.textContent = `Wind speed: ${windSpeed.toFixed(0)}m/s`;
            
        // append the div made above to the HTML:
        container.appendChild(forecast);
    }
}
)}
)}
})
};
