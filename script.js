const WEATHER_API_BASE_URL = 'https://api.openweathermap.org';
const WEATHER_API_KEY = '3770aa61038a0816864d556d797ecb9f';
const MAX_DAILY_FORECAST = 5;
let cityName = ""
const searchBtn = document.querySelector('#search')
const input = document.querySelector('#location')
const weather = document.querySelector('#weather')
const forecastEL = document.querySelector('#forecast-days')

const searchedLocations = []

// create an array of searched locations


// Start of local storage to save data input
function loadRecentLocations() {
      
    const storedLocations = JSON.parse(localStorage.getItem('recentLocations'));

    if (storedLocations != null) {
    searchedLocations.push(...storedLocations);
    }

    for(let i = 0; i < searchedLocations.length; i++) {

        var newLocation = document.createElement('div')
        newLocation.classList.add('recent-location');
        newLocation.textContent = searchedLocations[i];
        newLocation.addEventListener('click' , onClickSearchedLocation);

        document.getElementById('recent-location').appendChild(newLocation);

       


    }

}

function onClickSearchedLocation(event) {

    console.log('clicked')

    const location = event.target.textContent;
    lookupLocation(location);

}

function saveSearchedLocation(location) {

    const index = searchedLocations.indexOf(location)

    if(index === -1) {
        searchedLocations.push(location);

        localStorage.setItem('recentLocations', JSON.stringify(searchedLocations));

    }
}
// End of local storage to store data input and display on page

 
const lookupLocation = (search) => {

    saveSearchedLocation(search);

    // Lookup the location to get the Lat/Lon
    var apiUrl = `${WEATHER_API_BASE_URL}/geo/1.0/direct?q=${search}&limit=5&appid=${WEATHER_API_KEY}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            console.log(data);

            // Pick the First location from the results
            //const location = data[0];
            var lat = data[0].lat;
            var lon = data[0].lon;
            cityName = data[1].name

            // Get the Weather for the cached location
            var apiUrl = `${WEATHER_API_BASE_URL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=${WEATHER_API_KEY}`;
            console.log(apiUrl);
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {

                    console.log(data);

                    // Displays the Current Weather
                     displaycurrentWeather(data.current)

                    // Displays the 5 Day Forecast
                    displayForecast(data.daily)
                });
        });
}

// Prompts user to search location
const setSearchError = (text) => {
     const errorDisplay = document.getElementById('error-message');
     errorDisplay.textContent = text;

      setTimeout(setSearchError , 5000)

}

// Displays current weather within currrent day
function displaycurrentWeather(data) {

     const card = document.createElement('div')
     const h2 = document.createElement('h2')
     const temp = document.createElement('p')
     temp.setAttribute("class", "weather-info")
     const humidity = document.createElement('p')
     const wind = document.createElement('p')
     const span = document.createElement('span')
     const icon = document.createElement('img')
     const uvIndex = document.createElement('p')

     // This allows to display different city when user searches for another
     const weatherList = document.getElementById('weather');
     weatherList.innerHTML = ''

     icon.setAttribute("src","https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
     )
     temp.textContent = `Temperature: ${data.temp} °Celsius`
     humidity.textContent = `Humidity: ${data.humidity} %`
     wind.textContent = `Wind Speed: ${data.wind_speed} kph`
     uvIndex.textContent = `UV Index: ${data.uvi}`
     
     h2.textContent = cityName

span.append(icon)
h2.append(span) 
card.append(h2, temp, humidity, wind, uvIndex)  
weather.append(card)
}

// This function here helps to display the forecast within the next five days
function displayForecast(data) {
    
    // Sets 5 Day Forecast Data to different data when user looks for another city in the search bar
    document.getElementById('forecast').style.display = 'block';
    const forecastList = document.getElementById('forecast-days');
    forecastList.innerHTML = ''
    
    
    for(var i = 0; i < MAX_DAILY_FORECAST; i++){ 
        
    // Gets value of temp,humidity and wind

    const card = document.createElement('div')
    const h2 = document.createElement('h2')
    const temp = document.createElement('p')
    temp.setAttribute("class", "forecast-info")
    const humidity = document.createElement('p')
    const wind = document.createElement('p')
    const span = document.createElement('span')
    const icon = document.createElement('img')
    
    


    temp.textContent=`Temperature: ${data[i].temp.day} °Celsius`
    humidity.textContent = `Humidity: ${data[i].humidity} %`
    wind.textContent = `Wind Speed: ${data[i].wind_speed} kph`
   
    

    h2.textContent= new Date(data[i].dt*1000).toDateString()
    icon.setAttribute("src","https://openweathermap.org/img/w/" + data[i].weather[0].icon + ".png")
     

     span.append(icon)
     h2.append(span)
     card.append(h2, temp, humidity, wind)
     forecastEL.append(card)
    }
}


// Add an event handler for the search button
searchBtn.addEventListener('click' , () => {
const city = input.value
if (city === '') {
     setSearchError('Noteably ENTER a location ')
    
} else {
lookupLocation(city)
}
})

loadRecentLocations();




