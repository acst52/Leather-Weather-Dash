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
fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=48&appid=${APIKey2}`)

    // in for loop can try i+8, increment i by 8 each time, get info each 8th time stamp that you need
 
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const date = dayjs().format("M/D/YYYY");
        // now that 5-6 days of weather data, updated every 3 hours has been returned by the API,
        // we must loop through the array of weather data and extract the relevant data from each time point:
        let tempArray = [];
        data.list.forEach(function(item) {
            tempArray.push(item.main.temp - 273.15);
        });
        console.log(tempArray);
            
        // that's a very long array. let's just get all the temps at a certain time point, say 6AM:
        const sixAMTempArray = data.list.filter(function(item) {
            let date = new Date(item.dt_txt);
            return date.getHours() === 6;
        }).map(function(item) {
            return item.main.temp - 273.15;
        });
        console.log(sixAMTempArray);

            // // let's repeat for wind speed:
            // const sixAMWindArray = data.list.filter(function(item) {
            //     let date = new Date(item.dt_txt);
            //     return date.getHours() === 6;
            // }).map(function(item) {
            //     return item.main.temp - 273.15;
            // });
            // console.log(sixAMTempArray);
            
            // // repeat for humidity:
            // const sixAMTempArray = data.list.filter(function(item) {
            //     let date = new Date(item.dt_txt);
            //     return date.getHours() === 6;
            // }).map(function(item) {
            //     return item.main.temp - 273.15;
            // });
            // console.log(sixAMTempArray);

            // // finally repeat for icon:
            // const sixAMTempArray = data.list.filter(function(item) {
            //     let date = new Date(item.dt_txt);
            //     return date.getHours() === 6;
            // }).map(function(item) {
            //     return item.main.temp - 273.15;
            // });
            // console.log(sixAMTempArray);

// let's generate each forecast day using nested for loops to append the 
    //  ith object in each array to their respective divs:

// ^ get temp humidity wind icon array vars from loops above ^
let generatedForecast = "";
let container = document.querySelector(".container-flex");
for (let i = 0; i < 5; i+=8) {
    let div = document.createElement("div");
    generatedForecast = `Temp: ${data.list.temp[i]}&#8451;, Humidity: ${humidityArray[i]}%, Wind Speed: ${windSpeedArray[i]} m/s`;
    div.innerHTML = generatedForecast;
    container.appendChild(div);
    }
});

// cnt = how many 3 hour blocks of time you want. 48 for 6 days = today weather + 5 day froecast. 
    // LOOP THRU LIST NOT EVERY ITEM YOU WANT B/C EACH INDEX OF LIST HAS EVERYTHING YOU NEED, temp, humidity, wind, icon
// create loop, looking thru every 8 things in list. dynamically generate content for forecast card. do 5 times. 
// so like ... data.list.main.temp, data.list.humidity --> list holds all the indexes, data index 1.. go thru list for every 8 
