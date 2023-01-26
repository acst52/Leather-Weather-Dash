// To get the latitude and longitude of a city that the user inputs, 
// we use the fetch method to call the OpenCage Geocoding API:

// Let's start with some global vars:
const APIKey1 = "a03e4beee32f480681623329a1fb8030";  // can use same API for both*
const APIKey2 = "d460b3121f81ff3c2ab30beee768e22b";
const todayContainer = document.getElementById("response")
const form = document.getElementById("weatherForm");
let searchInput = document.querySelector("#cityInput");
let searchHistory = [];
const searchHistoryContainer = document.querySelector("#history");

function displayHistory() {
    searchHistoryContainer.innerHTML = ""; // clear out history before adding new city so no duplicates
    for (var i = searchHistory.length -1 ; i >= 0 ; i--) { // most recently searched cities render at top
        let btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.setAttribute("class", "history-btn btn btn-info mt-1");
        btn.setAttribute("data-search", searchHistory[i]);
        btn.textContent = searchHistory[i];
        searchHistoryContainer.append(btn);
    }
};

function addToHistory(search) {
    if (searchHistory.indexOf(search) !== -1) { // indexOf looks thru search history, if search exists, then return -1, don't add to history
        return;
    } 
    searchHistory.push(search);
    localStorage.setItem("cities", JSON.stringify(searchHistory));
    displayHistory(); // as soon as we add something to history, run displayHistory to update & display list
}

function getHistory() {
    let storedHistory = localStorage.getItem("cities");
    if (storedHistory) {
        searchHistory = JSON.parse(storedHistory);
    }
    displayHistory();
}

// Once a city is searched and user clicks get weather button, fcn to handle local storage:
function handleSearch(e) { // e = event
    if (!searchInput.value) {
        return; // dont do anything if user input field empty
    }
    e.preventDefault();
    let search = searchInput.value.trim();
    addToHistory(search);
    document.querySelector("#forecast").innerHTML = "";
    getWeather(search);
    searchInput.value = ""; // clear out input
};

function handleBtnClick(e) {
    if (!e.target.matches(".history-btn")) { // makes sure user clicks on button 
        return;
    }
    let btn = e.target;
    let search = btn.getAttribute("data-search");
    document.querySelector("#forecast").innerHTML = "";
    getWeather(search);
};

// Once user submits a city, let's:
function getWeather(search) {
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
                // now lets declare vars for all data that we need:
                const date = dayjs().format("M/D/YYYY");
                const tempC = data.main.temp - 273.15 // convert temp: °C = K - 273.15
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

                // now lets give the elements attibutes b/c we're using bootstrap, want to give bootstrap classes
                card.setAttribute("class", "card");
                cardBody.setAttribute("class", "card-body");
                // append and set attributes (classes)
                card.append(cardBody);
                heading.setAttribute("class", "h3 card-title");
                tempElement.setAttribute("class", "card-text");
                windElement.setAttribute("class", "card-text");
                humidityElement.setAttribute("class", "card-text");
                weatherIcon.setAttribute("src", iconURL);
                weatherIcon.setAttribute("class", "weather-img");

                // now give all our creations text content
                heading.textContent = `${search} ${date}`
                heading.append(weatherIcon);
                tempElement.textContent = `Temp: ${tempC.toFixed(0)} C`
                windElement.textContent = `Wind: ${wind.toFixed(0)} mph`
                humidityElement.textContent = `Humidity: ${humidity.toFixed(0)}%`

                cardBody.append(heading, tempElement, windElement, humidityElement);
                todayContainer.innerHTML = "";
                todayContainer.append(card);
            })

console.log(lat);
console.log(lon);

// Now lets fetch the 5-day forecast data of user search using lat & lon generated in the first fetch:
let forecastData;
let container = document.querySelector(".container-flex"); // queryselector is same as getelementbyid

fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=51&appid=${APIKey2}`)
    .then(response => response.json())
    .then(data => {
        forecastData = data;
        console.log(forecastData);
    // now that 5 days of weather data (updated every 3 hours = 8 times per day) has been returned by the API,
    // we must loop through it & get all the temps at a certain time point:
for (var i = 2; i < data.list.length; i+=8) { // start at i=2 because i=0 was 3AM, but 9AM weather is more informative
        var date = data.list[i].dt_txt.split(" ")[0]; // since dt_txt also had time, split to get rid of time
        var icon = `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;
        var temperature = data.list[i].main.temp - 273.15;
        var humidity = data.list[i].main.humidity;
        var windSpeed = data.list[i].wind.speed;

        // create a new div to add each 8th i forecast:
        var forecast = document.createElement("div");
        // the two extra elements created below get appended to forecast div - this is for styling purposes
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
        
        // add classes for styling purposes:
        forecast.setAttribute("class", "col-md");
        forecastCard.setAttribute("class", "card bg-primary h-100 text-white");
        forecastCardBody.setAttribute("class", "card-body p-2");
        forecastHeading.setAttribute("class", "card-title");
        forecastTemp.setAttribute("class", "card-text");
        forecastHumidity.setAttribute("class", "card-text");
        forecastWind.setAttribute("class", "card-text");

        // add content to forecast cards:
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

// call the function that will refresh and display the search history list:
getHistory();

// replaced the event listener removed from the start of the fetching function above:
form.addEventListener("submit", handleSearch);

// added event listener to handle when user clicks on a city in their search history:
searchHistoryContainer.addEventListener("click", handleBtnClick);
