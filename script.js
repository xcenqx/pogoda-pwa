

let units = "metric";
const API_KEY = '64f60853740a1ee3ba20d0fb595c97d5'
// Selectors
let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime");
let weather__forecast = document.querySelector('.weather__forecast');
let weather__temperature = document.querySelector(".weather__temperature");
let weather__icon = document.querySelector(".weather__icon");
let weather__minmax = document.querySelector(".weather__minmax");
let weather__realfeel = document.querySelector('.weather__realfeel');
let weather__humidity = document.querySelector('.weather__humidity');
let weather__wind = document.querySelector('.weather__wind');
let weather__pressure = document.querySelector('.weather__pressure');

// Convert timestamp to readable datetime
function convertTimeStamp(timestamp, timezone) {
    const convertTimezone = timezone / 3600;
    const date = new Date(timestamp * 1000);
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
        hour12: false,
    }
    return date.toLocaleString("pl-PL", options)
}

// Convert country code to name
function convertCountryCode(country) {
    let regionNames = new Intl.DisplayNames(["pl"], {type: "region"});
    return regionNames.of(country)
}

// Translate weather description
function translateWeatherDescription(description) {
    const translations = {
        'Clouds': 'Chmury',
        'Clear': 'Czyste niebo',
        'Few clouds': 'Małe zachmurzenie',
        'Scattered clouds': 'Rozproszone chmury',
        'Broken clouds': 'Złamane chmury',
        'Shower rain': 'Przelotne opady deszczu',
        'Rain': 'Deszcz',
        'Thunderstorm': 'Burza',
        'Snow': 'Śnieg',
        'Mist': 'Mgła'
    };
    return translations[description] || description;
}

function displayWeatherData(data) {
    let forecast = translateWeatherDescription(data.weather[0].main);
    city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`
    datetime.innerHTML = convertTimeStamp(data.dt, data.timezone); 
    weather__forecast.innerHTML = `<p>${forecast}`
    weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176`
    weather__icon.innerHTML = `   <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`
    weather__minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176</p>`
    weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`
    weather__humidity.innerHTML = `${data.main.humidity}%`
    weather__wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph": "m/s"}` 
    weather__pressure.innerHTML = `${data.main.pressure} hPa`
}

function displayDefaultWeather(MyData) {
    let forecast = translateWeatherDescription(MyData.weather[0].main);
    city.innerHTML = `${MyData.name}, ${convertCountryCode(MyData.sys.country)}`
    datetime.innerHTML = convertTimeStamp(MyData.dt, MyData.timezone); 
    weather__forecast.innerHTML = `<p>${forecast}`
    weather__temperature.innerHTML = `${MyData.main.temp.toFixed()}&#176`
    weather__icon.innerHTML = `   <img src="http://openweathermap.org/img/wn/${MyData.weather[0].icon}@4x.png" />`
    weather__minmax.innerHTML = `<p>Min: ${MyData.main.temp_min.toFixed()}&#176</p><p>Max: ${MyData.main.temp_max.toFixed()}&#176</p>`
    weather__realfeel.innerHTML = `${MyData.main.feels_like.toFixed()}&#176`
    weather__humidity.innerHTML = `${MyData.main.humidity}%`
    weather__wind.innerHTML = `${MyData.wind.speed} ${units === "imperial" ? "mph": "m/s"}` 
    weather__pressure.innerHTML = `${MyData.main.pressure} hPa`
}
function getWeatherForCity(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${units}`)
        .then(res => res.json())
        .then(data => {
            displayWeatherData(data);
            localStorage.setItem('myData', JSON.stringify(data));
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            displayDefaultWeather();
        });
}
function getWeatherForLocation(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`)
        .then(res => res.json())
        .then(data => {
            displayWeatherData(data);
            localStorage.setItem('myData', JSON.stringify(data));
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            displayDefaultWeather();
        });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherForLocation(lat, lon);
        }, showError);
    } else {
        console.error("Geolocation is not supported by this browser.");
        getWeatherForCity("Lublin");
    }
}


function showWeatherBasedOnLocation(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`)
        .then(res => res.json())
        .then(data => displayWeatherData(data))
        .catch(error => {
            console.error("Error fetching weather data:", error);
            getWeatherForCity("Lublin");
        });
}

function showError(error) {
    console.error("Error getting location:", error);
    getWeatherForCity("Lublin");
}

document.querySelector(".weather__search").addEventListener('submit', e => {
    e.preventDefault();
    const search = document.querySelector(".weather__searchform");
    getWeatherForCity(search.value);
    search.value = "";
});

document.querySelector(".weather_unit_celsius").addEventListener('click', () => {
    if (units !== "metric") {
        units = "metric";
        getWeatherForCity(city.innerHTML.split(",")[0]);
    }
});

document.querySelector(".weather_unit_farenheit").addEventListener('click', () => {
    if (units !== "imperial") {
        units = "imperial";
        getWeatherForCity(city.innerHTML.split(",")[0]);
    }
});
const date = JSON.parse(localStorage.getItem('myData'));
console.log(date);
document.addEventListener('DOMContentLoaded', () => {
    getLocation();
});

