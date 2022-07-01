var searchBtn = $('#search-button');

var geocodingAPIBaseURL = 'http://api.openweathermap.org/geo/1.0/direct?q=';
var openWeatherBaseURL = 'https://api.openweathermap.org/data/2.5/onecall?'
var openWeatherAPIKey = '&appid=8d5b46bf7541eef553a9aca23e0b3890';
var searchCity = 'detroit'; //$('#searchTerm');
var returnedCity;
//var state = 'MI,';
//var country = 'US';
var lat = 'lat=';
var lon = '&lon=';
var units = '&units=imperial';
var requestLocationURL; // = geocodingAPIBaseURL+city+openWeatherAPIKey;
var requestWeatherURL;

function getWeather(city) {
    requestLocationURL = geocodingAPIBaseURL+city+openWeatherAPIKey;
    console.log('locationURL: ' + requestLocationURL);
    fetch(requestLocationURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('location data: ' + data);
            data.forEach(element => {
                returnedCity = element.name;
                lat += element.lat;
                console.log('lat: ' + element.lat);
                lon += element.lon;
                console.log('lon: ' + element.lon); 
            });
            requestWeatherURL = openWeatherBaseURL+lat+lon+units+openWeatherAPIKey;
            console.log('weatherURL: ' + requestWeatherURL);
        })
        .then(function () {
            fetch(requestWeatherURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log('weather data: ' + data);
                console.log('temp: ' + data.current.temp);
                for(i = 0; i<5; i++) {
                    displayForecast(returnedCity, data.daily[i].dt, data.daily[i].temp.day);

                }
            })
        })
}

function displayWeather (city, date, temp, wind, humidity, uvIndex) {
    console.log('city: ' + city);
    console.log('date: ' + date);
    console.log('temp: ' + temp);
    console.log('wind: ' + wind);
    console.log('humidity: ' + humidity);
    console.log('uv index: ' + uvIndex);
}

function displayForecast (date, temp, wind, humidity) {
    console.log('date: ' + date);
    console.log('temp: ' + temp);
    console.log('wind: ' + wind);
    console.log('humidity: ' + humidity);
}

//function saveCity() {}

searchBtn.on('click', getWeather(city));
