import './style.css';
/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs().format();

const form = document.getElementById('form');
const cityNameDisplay = document.getElementById('city');
const countryNameDisplay = document.getElementById('country');
const weatherDesc = document.getElementById('weatherDesc');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temp');
const feelsLike = document.getElementById('feelsLike');
const dewPoint = document.getElementById('dewPoint');
const humidityDisplay = document.getElementById('humidity');
const uvIndex = document.getElementById('UV');
const precipitation = document.getElementById('precipitation');
const sunriseDisplay = document.getElementById('sunrise');
const sunsetDisplay = document.getElementById('sunset');
const temperatureUnits = form.elements.units;
const apiKey = '04c4452e0dc6606c0e2d6c5c918f0889';
let tempUnits = document.getElementsByClassName('tempUnits').innerHTML;
const footDiv = document.getElementById('footDiv');
footDiv.textContent = `© ${dayjs().format('YYYY')} Nate Card`;
try {
  async function coordinatesFetch(query) {
    const coordinates = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${apiKey}`);
    const coordResponse = await coordinates.json();
    return coordResponse;
  }
  async function forecastFetch(query) {
    const coords = await coordinatesFetch(query);
    const { lon, lat } = coords[0];
    const forecastResults = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${apiKey}&units=${temperatureUnits.value}`;
    const response = await fetch(`${forecastResults}`, { mode: 'cors' });
    const forecastData = await response.json();
    if (temperatureUnits.value === 'metric') {
      tempUnits = '\u2103';
    } else { tempUnits = '\u2109'; }
    return forecastData;
  }
  async function renderCityWeather(forecastWeather) {
    const coords = await coordinatesFetch(form.query.value);
    const forecast = await forecastFetch(form.query.value);
    const { country, name, state } = coords[0];
    const {
      feels_like: feels, temp, sunrise, sunset, dew_point: dew, humidity, uvi, wind_speed: wind,
    } = forecast.current;
    const { main, description, icon } = forecast.current.weather[0];
    const { pop, rain, snow } = forecast.daily[0];
    if (country === 'US') {
      cityNameDisplay.innerHTML = `${name}, ${state}`;
    } else {
      cityNameDisplay.innerHTML = `${name}, ${country}`;
    }
    weatherIcon.src = `http://openweathermap.org/img/wn/${icon}@4x.png`;
    weatherDesc.innerHTML = `${main} with ${description}`;
    temperature.innerHTML = `Temperature: ${Math.round(temp)}${tempUnits}`;
    feelsLike.innerHTML = `Feels Like: ${Math.round(feels)}${tempUnits}`;
    dewPoint.innerHTML = `Dew Point: ${Math.round(dew)}${tempUnits}`;
    humidityDisplay.innerHTML = `Humidity: ${humidity}%`;
    uvIndex.innerHTML = `UV Index: ${Math.round(uvi)}`;
    precipitation.innerHTML = `Precipitation: ${Math.round(pop)} %`;
    const timeZoneData = (forecast.timezone_offset / 60 / 60);
    sunriseDisplay.innerHTML = `Sunrise: ${dayjs.unix(sunrise).utcOffset(timeZoneData).format('LT')}`;
    sunsetDisplay.innerHTML = `Sunset: ${dayjs.unix(sunset).utcOffset(timeZoneData).format('LT')}`;
    async function updateDisplay() {
      const displayWidth = window.innerWidth;
      if (displayWidth < 200) {
        weatherIcon.src = `http://openweathermap.org/img/wn/${icon}.png`;
      } else if (displayWidth < 800) {
        weatherIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      } else {
        weatherIcon.src = `http://openweathermap.org/img/wn/${icon}@4x.png`;
      }
    }
    window.addEventListener('resize', updateDisplay);
  }

  // Render each day's forecast
  async function renderDailyForecast(forecastWeather) {
    const forecast = await forecastFetch(form.query.value);
    const timeZoneData = (forecast.timezone_offset / 60 / 60);
    const { daily } = forecast;
    if (temperatureUnits.value === 'metric') {
      tempUnits = '℃';
    } else { tempUnits = '℉'; }
    const day1Div = document.getElementById('day1');
    const day1Day = day1Div.querySelector('.date');
    const day1MaxTemp = day1Div.querySelector('.maxTemp');
    const day1MinTemp = day1Div.querySelector('.minTemp');
    const day1Icon = day1Div.querySelector('.icon');
    const day1Desc = day1Div.querySelector('.description');
    day1Day.innerHTML = `${dayjs.unix(daily[1].dt).utcOffset(timeZoneData).format('dddd')}`;
    day1MinTemp.innerHTML = `${Math.round(daily[1].temp.min)}${tempUnits}`;
    day1MaxTemp.innerHTML = `${Math.round(daily[1].temp.max)}${tempUnits}`;
    const day1IconCode = daily[1].weather[0].icon;
    day1Icon.src = `http://openweathermap.org/img/wn/${day1IconCode}.png`;
    day1Desc.innerHTML = `${daily[1].weather[0].main}`;

    const day2Div = document.getElementById('day2');
    const day2Day = day2Div.querySelector('.date');
    const day2MaxTemp = day2Div.querySelector('.maxTemp');
    const day2MinTemp = day2Div.querySelector('.minTemp');
    const day2Icon = day2Div.querySelector('.icon');
    const day2Desc = day2Div.querySelector('.description');
    day2Day.innerHTML = `${dayjs.unix(daily[2].dt).utcOffset(timeZoneData).format('dddd')}`;
    day2MinTemp.innerHTML = `${Math.round(daily[2].temp.min)}${tempUnits}`;
    day2MaxTemp.innerHTML = `${Math.round(daily[2].temp.max)}${tempUnits}`;
    const day2IconCode = daily[1].weather[0].icon;
    day2Icon.src = `http://openweathermap.org/img/wn/${day2IconCode}.png`;
    day2Desc.innerHTML = `${daily[2].weather[0].main}`;

    const day3Div = document.getElementById('day3');
    const day3Day = day3Div.querySelector('.date');
    const day3MaxTemp = day3Div.querySelector('.maxTemp');
    const day3MinTemp = day3Div.querySelector('.minTemp');
    const day3Icon = day3Div.querySelector('.icon');
    const day3Desc = day3Div.querySelector('.description');
    day3Day.innerHTML = `${dayjs.unix(daily[3].dt).utcOffset(timeZoneData).format('dddd')}`;
    day3MinTemp.innerHTML = `${Math.round(daily[3].temp.min)}${tempUnits}`;
    day3MaxTemp.innerHTML = `${Math.round(daily[3].temp.max)}${tempUnits}`;
    const day3IconCode = daily[3].weather[0].icon;
    day3Icon.src = `http://openweathermap.org/img/wn/${day3IconCode}.png`;
    day3Desc.innerHTML = `${daily[3].weather[0].main}`;

    const day4Div = document.getElementById('day4');
    const day4Day = day4Div.querySelector('.date');
    const day4MaxTemp = day4Div.querySelector('.maxTemp');
    const day4MinTemp = day4Div.querySelector('.minTemp');
    const day4Icon = day4Div.querySelector('.icon');
    const day4Desc = day4Div.querySelector('.description');
    day4Day.innerHTML = `${dayjs.unix(daily[4].dt).utcOffset(timeZoneData).format('dddd')}`;
    day4MinTemp.innerHTML = `${Math.round(daily[4].temp.min)}${tempUnits}`;
    day4MaxTemp.innerHTML = `${Math.round(daily[4].temp.max)}${tempUnits}`;
    const day4IconCode = daily[4].weather[0].icon;
    day4Icon.src = `http://openweathermap.org/img/wn/${day4IconCode}.png`;
    day4Desc.innerHTML = `${daily[4].weather[0].main}`;

    const day5Div = document.getElementById('day5');
    const day5Day = day5Div.querySelector('.date');
    const day5MaxTemp = day5Div.querySelector('.maxTemp');
    const day5MinTemp = day5Div.querySelector('.minTemp');
    const day5Icon = day5Div.querySelector('.icon');
    const day5Desc = day5Div.querySelector('.description');
    day5Day.innerHTML = `${dayjs.unix(daily[5].dt).utcOffset(timeZoneData).format('dddd')}`;
    day5MinTemp.innerHTML = `${Math.round(daily[5].temp.min)}${tempUnits}`;
    day5MaxTemp.innerHTML = `${Math.round(daily[5].temp.max)}${tempUnits}`;
    const day5IconCode = daily[5].weather[0].icon;
    day5Icon.src = `http://openweathermap.org/img/wn/${day5IconCode}.png`;
    day5Desc.innerHTML = `${daily[5].weather[0].main}`;

    const day6Div = document.getElementById('day6');
    const day6Day = day6Div.querySelector('.date');
    const day6MaxTemp = day6Div.querySelector('.maxTemp');
    const day6MinTemp = day6Div.querySelector('.minTemp');
    const day6Icon = day6Div.querySelector('.icon');
    const day6Desc = day6Div.querySelector('.description');
    day6Day.innerHTML = `${dayjs.unix(daily[6].dt).utcOffset(timeZoneData).format('dddd')}`;
    day6MinTemp.innerHTML = `${Math.round(daily[6].temp.min)}${tempUnits}`;
    day6MaxTemp.innerHTML = `${Math.round(daily[6].temp.max)}${tempUnits}`;
    const day6IconCode = daily[6].weather[0].icon;
    day6Icon.src = `http://openweathermap.org/img/wn/${day6IconCode}.png`;
    day6Desc.innerHTML = `${daily[6].weather[0].main}`;

    const day7Div = document.getElementById('day7');
    const day7Day = day7Div.querySelector('.date');
    const day7MaxTemp = day7Div.querySelector('.maxTemp');
    const day7MinTemp = day7Div.querySelector('.minTemp');
    const day7Icon = day7Div.querySelector('.icon');
    const day7Desc = day7Div.querySelector('.description');
    day7Day.innerHTML = `${dayjs.unix(daily[7].dt).utcOffset(timeZoneData).format('dddd')}`;
    day7MinTemp.innerHTML = `${Math.round(daily[7].temp.min)}${tempUnits}`;
    day7MaxTemp.innerHTML = `${Math.round(daily[7].temp.max)}${tempUnits}`;
    const day7IconCode = daily[7].weather[0].icon;
    day7Icon.src = `http://openweathermap.org/img/wn/${day7IconCode}.png`;
    day7Desc.innerHTML = `${daily[7].weather[0].main}`;
    async function updateWeatherIcon() {
      const displayWidth = window.innerWidth;
      // const day1IconCode = daily[1].weather[0].icon;
      // const day2IconCode = daily[2].weather[0].icon;
      // const day3IconCode = daily[3].weather[0].icon;
      // const day4IconCode = daily[4].weather[0].icon;
      // const day5IconCode = daily[5].weather[0].icon;
      // const day6IconCode = daily[6].weather[0].icon;
      // const day7IconCode = daily[7].weather[0].icon;
      if (displayWidth < 600) {
        day1Icon.src = `http://openweathermap.org/img/wn/${day1IconCode}.png`;
        day2Icon.src = `http://openweathermap.org/img/wn/${day2IconCode}.png`;
        day3Icon.src = `http://openweathermap.org/img/wn/${day3IconCode}.png`;
        day4Icon.src = `http://openweathermap.org/img/wn/${day4IconCode}.png`;
        day5Icon.src = `http://openweathermap.org/img/wn/${day5IconCode}.png`;
        day6Icon.src = `http://openweathermap.org/img/wn/${day6IconCode}.png`;
        day7Icon.src = `http://openweathermap.org/img/wn/${day7IconCode}.png`;
      } else {
        day1Icon.src = `http://openweathermap.org/img/wn/${day1IconCode}@2x.png`;
        day2Icon.src = `http://openweathermap.org/img/wn/${day2IconCode}@2x.png`;
        day3Icon.src = `http://openweathermap.org/img/wn/${day3IconCode}@2x.png`;
        day4Icon.src = `http://openweathermap.org/img/wn/${day4IconCode}@2x.png`;
        day5Icon.src = `http://openweathermap.org/img/wn/${day5IconCode}@2x.png`;
        day6Icon.src = `http://openweathermap.org/img/wn/${day6IconCode}@2x.png`;
        day7Icon.src = `http://openweathermap.org/img/wn/${day7IconCode}@2x.png`;
      }
    }
    window.addEventListener('resize', updateWeatherIcon);
  }

  async function fetchAndRender(query) {
  // turn button off during search
    form.submit.disabled = true;
    // submit the search
    const coords = await coordinatesFetch(query);
    const forecastWeather = await forecastFetch(query);
    // turn button back on after search is returned
    form.submit.disabled = false;
    renderCityWeather(forecastWeather.results);
    renderDailyForecast(forecastWeather.results);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    fetchAndRender(form.query.value);
  }

  form.addEventListener('submit', handleSubmit);

  // initial page load return San Francisco, California
  fetchAndRender('San Francisco, California');
} catch (err) {
  console.error(err);
}
