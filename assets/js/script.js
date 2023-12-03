//var declaration
var apiKey = "e6807d622a5c9a7b8e5e3adb026aa12c";
var requestCurrent =
  "https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=" +
  apiKey;

var requestWeather =
  "https://api.openweathermap.org/data/2.5/forecast?units=imperial&appid=" +
  apiKey;

var requestCoordinates =
  "http://api.openweathermap.org/geo/1.0/direct?limit=1&appid=" + apiKey + "&";

var searchBtn = document.getElementById("searchBtn");
var searchText = document.getElementById("searchText");
var todayConditions = document.getElementById("today");

// function to get coordinates from city search
function searchCity(city) {
  var requestURL = requestCoordinates + "&q=" + city;
  fetch(requestURL)
    .then(function (response) {
      todayConditions.textContent = "Error occured, please check city input.";
      if (!response.ok) throw new Error(response.text);
      return response.json();
    })
    .then(function (data) {
      var cityLat = data[0].lat;
      var cityLon = data[0].lon;
      var cityCountry = data[0].country;
      var cityState = data[0].state;
      todayConditions.classList.add("has-text-left", "is-size-3-mobile");
      todayConditions.textContent =
        city +
        " " +
        cityState +
        ", " +
        cityCountry +
        " " +
        dayjs().format("M/D/YY");

      searchWeather(cityLat, cityLon);
      searchForecast(cityLat, cityLon);
    });
}

// var requestCoordinatesZip =
//   "http://api.openweathermap.org/geo/1.0/zip?zip=E14,GB&appid=" + apiKey;
//
// function searchZip() {
//   fetch(requestCoordinatesZip)
//     .then(function (response) {
//       if (!response.ok) throw new Error(response.text);
//       return response.json();
//     })
//     .then(function (data) {
//       var zipLat = data[0].lat;
//       var zipLon = data[0].lon;
//       var zipCountry = data[0].country;
//       console.log(data[0]);
//       searchWeather(zipLat, zipLon);
//       searchForecast(zipLat, zipLon);
//     });
// }

//function for current weather fetch
function searchWeather(lat, lon) {
  var requestWeatherURL = requestCurrent + "&lat=" + lat + "&lon=" + lon;
  fetch(requestWeatherURL)
    .then(function (response) {
      if (!response.ok) throw new Error(response.text);
      return response.json();
    })
    .then(function (data) {
      renderWeather(data);
    });
}
function renderWeather(data) {
  var todayTemp = document.createElement("p");
  var todayWind = document.createElement("p");
  var todayHumidity = document.createElement("p");
  todayTemp.textContent = "Temp: " + data.main.temp + "\u00B0 F";
  todayTemp.classList.add(
    "has-text-left",
    "is-size-4-mobile",
    "is-size-3-tablet"
  );
  todayConditions.appendChild(todayTemp);
  todayWind.textContent = "Wind: " + data.wind.speed + " MPH";
  todayWind.classList.add(
    "has-text-left",
    "is-size-4-mobile",
    "is-size-3-tablet"
  );
  todayConditions.appendChild(todayWind);
  todayHumidity.textContent = "Humidity: " + data.main.humidity + "%";
  todayHumidity.classList.add(
    "has-text-left",
    "is-size-4-mobile",
    "is-size-3-tablet"
  );
  todayConditions.appendChild(todayHumidity);
}

//function for forecast fetch
function searchForecast(lat, lon) {
  var requestForecastURL = requestWeather + "&lat=" + lat + "&lon=" + lon;
  fetch(requestForecastURL)
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
  searchCity(searchText.value);
});

// conditions as graphic
//temp
//wind
//humidity

//funciton for rendering saved history
//function for rendering forecast
//event listener for history clicks
