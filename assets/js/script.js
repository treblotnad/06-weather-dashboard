var apiKey = "e6807d622a5c9a7b8e5e3adb026aa12c";
var requestCurrent =
  "https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&units=imperial&appid=" +
  apiKey;

var requestWeather =
  "https://api.openweathermap.org/data/2.5/forecast?lat=44.9778&lon=93.2650&units=imperial&appid=e6807d622a5c9a7b8e5e3adb026aa12c";

var requestCoordinates =
  "http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=e6807d622a5c9a7b8e5e3adb026aa12c";

var searchBtn = document.getElementById("searchBtn");

function searchCity() {
  fetch(requestCoordinates)
    .then(function (response) {
      if (!response.ok) throw new Error(response.text);
      return response.json();
    })
    .then(function (data) {
      var cityLat = data[0].lat;
      var cityLon = data[0].lon;
      var cityCountry = data[0].country;
      console.log(data[0]);
      searchWeather(cityLat, cityLon);
      searchForecast(cityLat, cityLon);
    });
}

function searchWeather(lat, lon) {
  fetch(requestCurrent)
    .then(function (response) {
      if (!response.ok) throw new Error(response.text);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  searchCity();
});

//funciton for rendering saved history

//function for rendering forecast

//function for getting coordinates from city

//function for getting forecast from coordinates

//event listener for history clicks

//event listener for searching for city
