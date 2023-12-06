//var declaration
var apiKey = "e6807d622a5c9a7b8e5e3adb026aa12c";
var requestCurrent =
  "https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=" +
  apiKey;

var requestWeather =
  "https://api.openweathermap.org/data/2.5/forecast?units=imperial&appid=" +
  apiKey;

var requestCoordinates =
  "https://api.openweathermap.org/geo/1.0/direct?limit=1&appid=" + apiKey + "&";

var searchBtn = document.getElementById("searchBtn");
var clearBtn = document.getElementById("clearBtn");
var searchText = document.getElementById("searchText");
var todayConditions = document.getElementById("today");
var searchDiv = document.createElement("div");
var forecastEl = document.getElementById("forecast");
var articles = document.getElementsByTagName("article");
// function to get coordinates from city search
function searchCity(city) {
  var requestURL = requestCoordinates + "&q=" + city;
  fetch(requestURL)
    .then(function (response) {
      articles[0].style.display = "none";
      articles[1].style.display = "none";
      articles[2].style.display = "none";
      articles[3].style.display = "none";
      articles[4].style.display = "none";
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
        city.charAt(0).toUpperCase() +
        city.slice(1) +
        " " +
        cityState +
        ", " +
        cityCountry +
        " " +
        dayjs().format("(M/D/YY)");

      searchWeather(cityLat, cityLon, city);
      searchForecast(cityLat, cityLon);
      articles[0].style.display = "block";
      articles[2].style.display = "block";
      articles[3].style.display = "block";
      articles[1].style.display = "block";
      articles[4].style.display = "block";
    });
}

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
      //pick out UTC and TimeZone for finding correct index to create first card, noon local time is target for forecast cards, plus or minus 2 hours
      var timeZoneAdj = Math.trunc(data.city.timezone / (60 * 60 * 3));
      for (let i = 0; i < data.list.length; i++) {
        if (
          dayjs(data.list[i].dt_txt).format("M/D/YY H") ==
          dayjs().add(1, "day").format("M/D/YY") + " 12"
        ) {
          var indexTimeOffset = i;
        }
      }

      for (let i = 0; i < 5; i++) {
        if (8 * i + (indexTimeOffset - timeZoneAdj) > 39) {
          return;
        }
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

        renderWeather(
          data.list[8 * i + (indexTimeOffset - timeZoneAdj)],
          dayCard,
          6
        );
      }
    });
}
//saves recent search to local storage and creates button
function saveSearch(city) {
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.getItem(i) == city) {
      return;
    }
  }
  localStorage.setItem(localStorage.length, city);
  renderHistory();
}

//
function renderHistory() {
  searchDiv.innerHTML = "";
  for (let i = localStorage.length - 1; i > -1; i--) {
    var historyBtn = document.createElement("button");
    historyBtn.textContent = localStorage[i];
    historyBtn.classList.add(
      "button",
      "is-fullwidth",
      "is-size-5",
      "history",
      "has-background-grey",
      "has-text-white",
      "mt-3"
    );
    searchDiv.appendChild(historyBtn);
  }
  searchAside.appendChild(searchDiv);
}

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  searchCity(searchText.value.toLowerCase().trim());
  searchText.value = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

clearBtn.addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.clear();
  renderHistory();
});

searchDiv.addEventListener("click", function (e) {
  e.preventDefault();
  if (!e.target.classList.contains("history")) {
    return;
  }
  var clickedBtn = e.target.textContent;
  searchCity(clickedBtn);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderHistory();
