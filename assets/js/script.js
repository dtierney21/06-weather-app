
// Api variables
var geocodingAPIBaseURL = 'https://api.openweathermap.org/geo/1.0/direct?q=';
var openWeatherBaseURL = 'https://api.openweathermap.org/data/2.5/onecall?'
var openWeatherAPIKey = '&appid=8d5b46bf7541eef553a9aca23e0b3890';
var returnedCity;
var units = '&units=imperial';
var requestLocationURL;
var requestWeatherURL;
var baseIconURL = 'https://openweathermap.org/img/wn/';

// fetch the wather data for the selected city from OpenWeather
function getWeather(city) {
    var lat = 'lat=';
    var lon = '&lon=';
    requestLocationURL = geocodingAPIBaseURL+city+openWeatherAPIKey;
    console.log('locationURL: ' + requestLocationURL);
    // get the lat and long of the selected city
    fetch(requestLocationURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            data.forEach(element => {
                returnedCity = element.name;
                lat += element.lat;
                lon += element.lon;
            });
            requestWeatherURL = openWeatherBaseURL+lat+lon+units+openWeatherAPIKey;
            console.log('weatherURL: ' + requestWeatherURL);
            saveCity(returnedCity);
        })
        // request the waether data using the lat and long
        .then(function () {
            fetch(requestWeatherURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                displayWeather(returnedCity, data.current.dt, data.current.temp, data.current.wind_speed, data.current.humidity, data.current.uvi, data.current.weather[0].icon);
                for(i = 1; i<6; i++) {
                    displayForecast(data.daily[i].dt, data.daily[i].temp.day, data.daily[i].wind_speed, data.daily[i].humidity, data.daily[i].weather[0].icon);

                }
            })
        })
}

// create the elements to display the current weather
function displayWeather (city, date, temp, wind, humidity, uvIndex, icon) {
    var formattedDate = moment(date * 1000).format('(M/D/YYYY)');
    iconURL = baseIconURL + icon + '@2x.png';
    
    document.getElementById('current-city').textContent = city;
    document.getElementById('current-date').textContent = formattedDate;
    document.getElementById('current-icon').setAttribute('src', iconURL);
    document.getElementById('current-temp').textContent = 'Temp: ' + temp + ' F';
    document.getElementById('current-wind').textContent = 'Wind: ' + wind + ' MPH';
    document.getElementById('current-humidity').textContent = 'Humidity: ' + humidity + ' %';
    var uviSpan = document.createElement('span');
    if (uvIndex < 3.5) {
        uviSpan.setAttribute('style', 'background-color: green');
    } else if (uvIndex < 7) {
        uviSpan.setAttribute('style', 'background-color: yellow');
    } else {
        uviSpan.setAttribute('style', 'background-color: red');
    }
    uviSpan.textContent = uvIndex;
    document.getElementById('current-uvi').textContent = 'UV Index: ';
    document.getElementById('current-uvi').append(uviSpan);
    
}

// create the elements to display the five day forcast
function displayForecast (date, temp, wind, humidity, icon) {
    var formattedDate = moment(date * 1000).format('M/D/YYYY');

    var forecastDiv = document.createElement('div');
    forecastDiv.style.padding = '8px';
    forecastDiv.style.margin = '8px';
    var forecastDate = document.createElement('p');
    forecastDate.textContent = formattedDate;
    var forecastIcon = document.createElement('img');
    forecastIcon.setAttribute('src', baseIconURL + icon + '@2x.png')
    var forecastTemp = document.createElement('p');
    forecastTemp.textContent = 'Temp: ' + temp + ' F';
    var forecastWind = document.createElement('p');
    forecastWind.textContent = 'Wind: ' + wind + ' MPH';
    var forecastHumidity = document.createElement('p');
    forecastHumidity = 'Humidity: ' + humidity + ' %';

    forecastDiv.append(forecastDate);
    forecastDiv.append(forecastIcon);
    forecastDiv.append(forecastTemp);
    forecastDiv.append(forecastWind);
    forecastDiv.append(forecastHumidity);
    document.getElementById('forecast').append(forecastDiv);
}

// write the city name to local storage to be used to search again
function saveCity(name) {
    var cities = [];
    console.log('name: '+ name);
    cities.push(name);
    console.log(cities);
    localStorage.setItem('savedCities', JSON.stringify(cities));
    createSavedButtons();
}

// create the elements to allow a user to search a previuosly selected city
function createSavedButtons () {
    var savedCities = JSON.parse(localStorage.getItem('savedCities'));
    console.log('array length: ' + savedCities.length)
    //for (var i = 0; i<citySet.size; i++) {
    savedCities.forEach(element => {
        var cityListItem = document.createElement('li');
        var cityBtn = document.createElement('button');
        cityBtn.textContent = element;
        cityListItem.append(cityBtn);
        document.getElementById('history').append(cityListItem);
    })
}

// create the header for the forecast section
function createForecastHeader() {
    var forecastHeader = document.createElement('h2');
    forecastHeader.textContent = '5-Day Forecast:'
    document.getElementById('forecast').append(forecastHeader);
}

// when the user clicks the search button, display the current weather and forecast
$('#search-button').on('click', function() {
    clearForecast();
    createForecastHeader();
    getWeather($('#search-term').val())
    
});

// when the user clicks on a city they have previously searched, show the weather and forecast for that city
$('#history').click(function(evt){
    clearForecast();
    createForecastHeader();
    getWeather($(evt.target).text());
})

// clear the previuos forcast elements
function clearForecast() {
    document.getElementById('forecast').innerHTML = '';
}
