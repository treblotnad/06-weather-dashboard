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
var clearBtn = document.getElementById("clearBtn");
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
      todayConditions.classList.add(
        "has-text-left",
        "is-size-3-mobile",
        "has-text-weight-bold",
        "box"
      );
      todayConditions.textContent =
        city +
        " " +
        cityState +
        ", " +
        cityCountry +
        " " +
        dayjs().format("(M/D/YY)");

      searchWeather(cityLat, cityLon, city);
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
function searchWeather(lat, lon, city) {
  var requestWeatherURL = requestCurrent + "&lat=" + lat + "&lon=" + lon;
  fetch(requestWeatherURL)
    .then(function (response) {
      if (!response.ok) throw new Error(response.text);
      return response.json();
    })
    .then(function (data) {
      renderWeather(data, todayConditions, 3);
      saveSearch(city);
    });
}
//renders weather data for both current and 5 day forecast
function renderWeather(data, cardAddedTo, fontSize) {
  var weatherIcon = document.createElement("img");
  var weatherDesc = document.createElement("p");
  var todayTemp = document.createElement("p");
  var todayWind = document.createElement("p");
  var todayHumidity = document.createElement("p");
  console.log(data);
  weatherIcon.setAttribute(
    "src",
    "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
  );

  weatherDesc.textContent = data.weather[0].description;
  weatherDesc.classList.add(
    "has-text-left",
    "is-size-4-mobile",
    "is-size-" + fontSize + "-tablet",
    "has-text-weight-normal"
  );
  cardAddedTo.appendChild(weatherDesc);
  cardAddedTo.appendChild(weatherIcon);
  todayTemp.textContent = "Temp: " + data.main.temp + "\u00B0 F";
  todayTemp.classList.add(
    "has-text-left",
    "is-size-4-mobile",
    "is-size-" + fontSize + "-tablet",
    "has-text-weight-normal"
  );
  cardAddedTo.appendChild(todayTemp);
  todayWind.textContent = "Wind: " + data.wind.speed + " MPH";
  todayWind.classList.add(
    "has-text-left",
    "is-size-4-mobile",
    "is-size-" + fontSize + "-tablet",
    "has-text-weight-normal"
  );
  cardAddedTo.appendChild(todayWind);
  todayHumidity.textContent = "Humidity: " + data.main.humidity + "%";
  todayHumidity.classList.add(
    "has-text-left",
    "is-size-4-mobile",
    "is-size-" + fontSize + "-tablet",
    "has-text-weight-normal"
  );
  cardAddedTo.appendChild(todayHumidity);
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
      for (let i = 0; i < 5; i++) {
        var dayCard = document.getElementById("day" + (i + 1));
        dayCard.textContent = dayjs()
          .add(i + 1, "day")
          .format("M/D/YY");
        dayCard.classList.add(
          "card",
          "has-text-left",
          "has-text-weight-bold",
          "has-background-info",
          "has-text-white",
          "is-size-4",
          "p-3"
        );
        var timeZoneAdj = Math.floor(data.city.timezone / (60 * 60 * 3));
        
        renderWeather(data.list[8 * i + (4 - timeZoneAdj)], dayCard, 6);
      }
    });
}
//saves recent search to local storage and creates button
function saveSearch(city) {
  localStorage.setItem(localStorage.length, city);
  //each working search gets added to local storage array with index increasing
}

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  searchCity(searchText.value);
});

clearBtn.addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.clear();
});

//history function needed
