/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/controllers/mainController.js":
/*!***************************************************!*\
  !*** ./src/scripts/controllers/mainController.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MainController)
/* harmony export */ });
class MainController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.city = {};
    this.unit = "metric";
    this.city = "kitale";
    this.loadpage(this.city);
  }
  async loadpage(city) {
    this.city = city;
    const cityInfo = await this.model.getCityInfo(city, this.unit);
    const currentWeather = await this.model.getCurrentWeather(city, this.unit);
    const forecastWeather = await this.model.getForecastWeather(city, this.unit);
    console.log(currentWeather);
    this.view.appendCityInfo(cityInfo);
    this.view.appendCurrrentWeather(currentWeather);
    this.view.appendForecastWeather(forecastWeather);
  }
}

/***/ }),

/***/ "./src/scripts/models/APIs.js":
/*!************************************!*\
  !*** ./src/scripts/models/APIs.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ APIs)
/* harmony export */ });
class APIs {
  constructor() {
    this.urlGenerator = new UrlGeneretor('d3897c1489c0d8ecea8aecab91da4d1d');
  }
  async getGeoCoordinates(city) {
    try {
      const url = this.urlGenerator.generateGeoCoordsUrl(city);
      const response = await fetch(url, {
        mode: "cors"
      });
      const geoCodingData = await response.json();
      const {
        lat,
        lon
      } = geoCodingData[0];
      document.getElementById('error').style.display = "none";
      return {
        lat,
        lon
      };
    } catch (error) {
      console.log(error);
      document.getElementById("error").style.display = "block";
      return null;
    }
  }
  async getCurrentWeatherData(city, unit) {
    try {
      const {
        lat,
        lon
      } = await this.getGeoCoordinates(city);
      const url = this.urlGenerator.generateCurrentWeather(lat, lon, unit);
      const response = await fetch(url, {
        mode: 'cors'
      });
      const weatherData = await response.json();
      document.getElementById('error').style.display = "none";
      return weatherData;
    } catch (error) {
      console.log(error);
      document.getElementById("error").style.display = "block";
      return null;
    }
  }
  async getForecastWeatherData(city, unit) {
    try {
      const {
        lat,
        lon
      } = await this.getGeoCoordinates(city);
      const url = this.urlGenerator.generateForecastWeather(lat, lon, unit);
      const response = await fetch(url, {
        mode: 'cors'
      });
      const forecastData = await response.json();
      document.getElementById("error").style.display = "none";
      return forecastData;
    } catch (error) {
      console.log(error);
      document.getElementById("error").style.display = "block";
      return null;
    }
  }
}
class UrlGeneretor {
  constructor(appId) {
    this.baseUrl = "https://api.openweathermap.org";
    this.appId = appId;
  }
  generateGeoCoordsUrl(city) {
    return `${this.baseUrl}/geo/1.0/direct?q=${city}&appid=${this.appId}`;
  }
  generateCurrentWeather(lat, lon, unit) {
    return `${this.baseUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.appId}&units=${unit}`;
  }
  generateForecastWeather(lat, lon, unit) {
    return `${this.baseUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=&appid=${this.appId}&units=${unit}`;
  }
}

/***/ }),

/***/ "./src/scripts/models/cityInfo.js":
/*!****************************************!*\
  !*** ./src/scripts/models/cityInfo.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CityInfo)
/* harmony export */ });
class CityInfo {
  constructor(ApiData) {
    this.cityDescription = this.createCityDescription(ApiData);
    this.dateDescription = this.createDateDescription(ApiData);
  }
  createCityDescription(ApiData) {
    const city = ApiData.name;
    const {
      country
    } = ApiData.sys;
    return `${city}, ${country}`;
  }
  createDateDescription(ApiData) {
    const day = this.getDay();
    const month = this.getMonth();
    const date = this.getDate();
    return `${day}, ${month} ${date}`;
  }
  getDay() {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date();
    const day = weekday[d.getDay()];
    return day;
  }
  getMonth() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    const month = monthNames[d.getMonth()];
    return month;
  }
  getDate() {
    const d = new Date();
    const date = d.getDate();
    return date;
  }
}

/***/ }),

/***/ "./src/scripts/models/currentWeather.js":
/*!**********************************************!*\
  !*** ./src/scripts/models/currentWeather.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CurrentWeather)
/* harmony export */ });
class CurrentWeather {
  constructor(currentWeatherData, unit) {
    this.temperature = this.getTemperature(Math.round(currentWeatherData.main.temp), unit);
    this.feelsLikeTemp = this.getTemperature(Math.round(currentWeatherData.main.feels_like), unit);
    this.humidity = `${currentWeatherData.main.humidity}%`;
    this.windSpeed = `${currentWeatherData.wind.speed}m/s`;
    this.pressure = `${currentWeatherData.main.pressure} hPa`;
    this.sunrise = this.convertToSearchedCityTime(currentWeatherData.sys.sunrise, currentWeatherData.timezone);
    this.sunset = this.convertToSearchedCityTime(currentWeatherData.sys.sunset, currentWeatherData.timezone);
    this.weatherConditionDesc = currentWeatherData.weather[0].description;
    this.weatherConditionImg = this.getweatherConditionImg(currentWeatherData.weather[0].main, currentWeatherData.sys.sunrise, currentWeatherData.sys.sunset, currentWeatherData.timezone);
    this.backgroundVideo = this.getBackgroundVideo(this.weatherConditionImg);
  }
  getTemperature(degrees, unit) {
    return unit === "metric" ? `${degrees} ℃` : `${degrees} ℉`;
  }
  convertToSearchedCityDate(unixTime, timezone) {
    const localDate = unixTime === 0 ? new Date() : new Date(unixTime * 1000);
    const utcUnixTime = localDate.getTime() + localDate.getTimezoneOffset() * 60000;
    const unixTimeInSearchedCity = utcUnixTime + timezone * 1000;
    const dateInSearchedCity = new Date(unixTimeInSearchedCity);
    return dateInSearchedCity;
  }
  convertToSearchedCityTime(unixTime, timezone) {
    const dateInSearchedCity = this.convertToSearchedCityDate(unixTime, timezone);
    const hours = dateInSearchedCity.getHours();
    const minutes = `${dateInSearchedCity.getMinutes()}`;
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
  }
  getweatherConditionImg(value, sunriseUnix, sunsetUnix, timezone) {
    if (value === "Drizzle") return "rain";
    const mistEquivalentes = ["Smoke", "Haze", "Dust", "Fog", "Sand", "Dust", "Ash", "Squall", "Tornado"];
    if (mistEquivalentes.includes(value)) return "Mist";
    if (value !== "Clear") return value;
    const currentDate = this.convertToSearchedCityDate(0, timezone);
    const sunriseDate = this.convertToSearchedCityDate(sunriseUnix, timezone);
    const sunsetDate = this.convertToSearchedCityDate(sunsetUnix, timezone);
    return currentDate > sunriseDate && currentDate < sunsetDate ? `${value}Day` : `${value}Night`;
  }
  getBackgroundVideo(weatherCondition) {
    const videoLinks = {
      ClearDay: "https://player.vimeo.com/external/420221145.hd.mp4?s=3959bcbf4829a95ce4b2940192074d7469ff984b&profile_id=175&oauth2_token_id=57447761",
      ClearNight: "https://player.vimeo.com/external/333584599.sd.mp4?s=df21eca618f9749cf2f734fee7c94fc1a09d0f54&amp;profile_id=164&amp;oauth2_token_id=57447761",
      Clouds: "https://player.vimeo.com/external/444192978.hd.mp4?s=18ab734562d8c4ea0ec2fed7f16f3edf6158ddcc&profile_id=172&oauth2_token_id=57447761",
      Mist: "https://player.vimeo.com/external/350241088.hd.mp4?s=3a287426e0146dab6ea738f4629c6f0989a89603&profile_id=172&oauth2_token_id=57447761",
      Rain: "https://player.vimeo.com/progressive_redirect/playback/708629823/rendition/720p/file.mp4?loc=external&oauth2_token_id=57447761&signature=9951e451334fdfbcf9eb6b8c933fd01dd12a54a03fdb371f0da864a17aaeaf29",
      Mist: "https://player.vimeo.com/external/350241088.hd.mp4?s=3a287426e0146dab6ea738f4629c6f0989a89603&profile_id=172&oauth2_token_id=57447761",
      Thunderstorm: "https://player.vimeo.com/external/480223896.hd.mp4?s=e4b94f0b5700bfa68cb6f02b41f94ecca91242e9&profile_id=169&oauth2_token_id=57447761"
    };
    return videoLinks[weatherCondition];
  }
}

/***/ }),

/***/ "./src/scripts/models/forecastWeather.js":
/*!***********************************************!*\
  !*** ./src/scripts/models/forecastWeather.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ForecastWeather)
/* harmony export */ });
class ForecastWeather {
  constructor(forecastWeatherData, unit) {
    this.temperature = this.getTemperature(forecastWeatherData, unit);
    this.weatherCondition = this.getWeatherConditions(forecastWeatherData);
  }
  getTemperature(forecastWeatherData, unit) {
    const temperatures = [];
    forecastWeatherData.list.forEach(item => {
      const temp = Math.round(item.main.temp);
      const tempWithUnit = this.getTemperatureUnit(temp, unit);
      temperatures.push(tempWithUnit);
    });
    return temperatures;
  }
  getTemperatureUnit(degree, unit) {
    return unit === "metric" ? `${degree}℃` : `${degree}℉`;
  }
  convertToSearchedCityDate(unixTime, timezone) {
    const localDate = new Date(unixTime * 1000);
    const utcUnixTimeZone = localDate.getTime() + localDate.getTimezoneOffset() * 60000;
    const unixTimeInSearchedCity = utcUnixTimeZone + timezone * 1000;
    const dateInsearchedCity = new Date(unixTimeInSearchedCity);
    return dateInsearchedCity;
  }
  getWeatherConditionImg(value, time, sunriseUnix, sunsetUnix, timezone) {
    if (value !== "Clear") return value;
    const currentHour = this.convertToSearchedCityDate(time, timezone).getHours();
    const sunriseHour = this.convertToSearchedCityDate(sunriseUnix, timezone).getHours();
    const sunsetHour = this.convertToSearchedCityDate(sunsetUnix, timezone).getHours();
    return currentHour > sunriseHour && currentHour < sunsetHour ? `${value}Day` : `${value}Night`;
  }
  getWeatherConditions(forecastWeatherData) {
    const weatherCondition = [];
    const sunriseUnix = forecastWeatherData.city.sunrise;
    const sunsetUnix = forecastWeatherData.city.sunset;
    const {
      timezone
    } = forecastWeatherData.city;
    forecastWeatherData.list.forEach(item => {
      const cond = this.getWeatherConditionImg(item.weather[0].main, item.dt, sunriseUnix, sunsetUnix, timezone);
      weatherCondition.push(cond);
    });
    return weatherCondition;
  }
}

/***/ }),

/***/ "./src/scripts/models/mainModel.js":
/*!*****************************************!*\
  !*** ./src/scripts/models/mainModel.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MainModel)
/* harmony export */ });
/* harmony import */ var _APIs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./APIs */ "./src/scripts/models/APIs.js");
/* harmony import */ var _cityInfo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cityInfo */ "./src/scripts/models/cityInfo.js");
/* harmony import */ var _currentWeather__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./currentWeather */ "./src/scripts/models/currentWeather.js");
/* harmony import */ var _forecastWeather__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./forecastWeather */ "./src/scripts/models/forecastWeather.js");




class MainModel {
  constructor() {
    this.data = {};
    this.APIs = new _APIs__WEBPACK_IMPORTED_MODULE_0__["default"]();
  }
  async getCityInfo(city, unit) {
    const ApiData = await this.APIs.getCurrentWeatherData(city, unit);
    const cityInfo = new _cityInfo__WEBPACK_IMPORTED_MODULE_1__["default"](ApiData);
    return cityInfo;
  }
  async getCurrentWeather(city, unit) {
    const currentWeatherData = await this.APIs.getCurrentWeatherData(city, unit);
    const currentWeather = new _currentWeather__WEBPACK_IMPORTED_MODULE_2__["default"](currentWeatherData, unit);
    return currentWeather;
  }
  async getForecastWeather(city, unit) {
    const forecastWeatherData = await this.APIs.getForecastWeatherData(city, unit);
    const forecastWeather = new _forecastWeather__WEBPACK_IMPORTED_MODULE_3__["default"](forecastWeatherData, unit);
    return forecastWeather;
  }
}

/***/ }),

/***/ "./src/scripts/views/cityInfoView.js":
/*!*******************************************!*\
  !*** ./src/scripts/views/cityInfoView.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CityInfoView)
/* harmony export */ });
class CityInfoView {
  constructor(element, cityInfoModel) {
    this.element = element;
    this.model = cityInfoModel;
    this.city = cityInfoModel.cityDescription;
    this.date = cityInfoModel.dateDescription;
  }
  get city() {
    return this.element.querySelector('h1');
  }
  set city(value) {
    this.city.textContent = value;
  }
  get date() {
    return this.element.querySelector('h2');
  }
  set date(value) {
    this.date.textContent = value;
  }
}

/***/ }),

/***/ "./src/scripts/views/currentWeatherView.js":
/*!*************************************************!*\
  !*** ./src/scripts/views/currentWeatherView.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CurrentWeatherView)
/* harmony export */ });
class CurrentWeatherView {
  constructor(element, currentWeatherModel) {
    this.element = element;
    this.model = currentWeatherModel;
    this.temperature = currentWeatherModel.temperature;
    this.feelsLikeTemp = currentWeatherModel.feelsLikeTemp;
    this.humidity = currentWeatherModel.humidity;
    this.windSpeed = currentWeatherModel.windSpeed;
    this.pressure = currentWeatherModel.pressure;
    this.sunrise = currentWeatherModel.sunrise;
    this.sunset = currentWeatherModel.sunset;
    this.weatherConditionDesc = currentWeatherModel.weatherConditionDesc;
    this.weatherConditionImg = currentWeatherModel.weatherConditionImg;
    this.backgroundVideo = currentWeatherModel.backgroundVideo;
  }
  weatherColor(value) {
    if (value == "Rain") {
      document.body.classList.add('color-black');
    } else if (value == "Mist") {
      document.body.classList.add('color-black');
    } else if (value == "ClearDay" || value == "Night") {
      document.body.classList.add('color-black');
    }
  }
  get temperature() {
    return this.element.querySelector('h1');
  }
  set temperature(value) {
    this.temperature.textContent = value;
  }
  get feelsLikeTemp() {
    return this.element.querySelector('.feels-like');
  }
  set feelsLikeTemp(value) {
    this.feelsLikeTemp.textContent = value;
  }
  get humidity() {
    return this.element.querySelector('.humidity');
  }
  set humidity(value) {
    this.humidity.textContent = value;
  }
  get windSpeed() {
    return this.element.querySelector('.wind-speed');
  }
  set windSpeed(value) {
    this.windSpeed.textContent = value;
  }
  get pressure() {
    return this.element.querySelector('.pressure');
  }
  set pressure(value) {
    this.pressure.textContent = value;
  }
  get sunrise() {
    return this.element.querySelector('.sunrise');
  }
  set sunrise(value) {
    this.sunrise.textContent = value;
  }
  get sunset() {
    return this.element.querySelector('.sunset');
  }
  set sunset(value) {
    this.sunset.textContent = value;
  }
  get weatherConditionDesc() {
    return this.element.querySelector('h2');
  }
  set weatherConditionDesc(value) {
    this.weatherConditionDesc.textContent = value;
  }
  get weatherConditionImg() {
    return this.element.querySelector('img');
  }
  set weatherConditionImg(value) {
    this.weatherConditionImg.src = `./images/${value}.png`;
    this.weatherColor(value);
  }
  get backgroundVideo() {
    return document.getElementById('video');
  }
  set backgroundVideo(value) {
    this.backgroundVideo.src = value;
  }
}

/***/ }),

/***/ "./src/scripts/views/forecastWeatherView.js":
/*!**************************************************!*\
  !*** ./src/scripts/views/forecastWeatherView.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ForecastWeatherView)
/* harmony export */ });
class ForecastWeatherView {
  constructor(element, forecastWeatherModel) {
    this.element = element;
    this.model = forecastWeatherModel;
    this.temperatures = forecastWeatherModel.temperature;
    this.weatherConditions = forecastWeatherModel.weatherCondition;
  }
  get temperatures() {
    return this.element.querySelectorAll('.forecast__item__temperature');
  }
  set temperatures(value) {
    for (let i = 0; i < 8; i++) {
      this.temperatures[i].textContent = value[i];
    }
  }
  get weatherConditions() {
    return this.element.querySelectorAll('img');
  }
  set weatherConditions(value) {
    for (let i = 1; i < this.weatherConditions.length; i++) {
      this.weatherConditions[i].src = `./images/${value[i - 1]}.png`;
    }
  }
}

/***/ }),

/***/ "./src/scripts/views/mainView.js":
/*!***************************************!*\
  !*** ./src/scripts/views/mainView.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MainView)
/* harmony export */ });
/* harmony import */ var _cityInfoView__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cityInfoView */ "./src/scripts/views/cityInfoView.js");
/* harmony import */ var _currentWeatherView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./currentWeatherView */ "./src/scripts/views/currentWeatherView.js");
/* harmony import */ var _forecastWeatherView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./forecastWeatherView */ "./src/scripts/views/forecastWeatherView.js");



class MainView {
  appendCityInfo(cityInfo) {
    const element = document.getElementById('city-info');
    new _cityInfoView__WEBPACK_IMPORTED_MODULE_0__["default"](element, cityInfo);
  }
  appendCurrrentWeather(currentWeather) {
    const element = document.getElementById("current-weather");
    new _currentWeatherView__WEBPACK_IMPORTED_MODULE_1__["default"](element, currentWeather);
  }
  appendForecastWeather(forecastWeather) {
    const element = document.getElementById('forecast');
    new _forecastWeatherView__WEBPACK_IMPORTED_MODULE_2__["default"](element, forecastWeather);
  }
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/nomarlize.css":
/*!************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/nomarlize.css ***!
  \************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */


/* Document
   ========================================================================== */


/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */

html {
    line-height: 1.15;
    /* 1 */
    -webkit-text-size-adjust: 100%;
    /* 2 */
}


/* Sections
     ========================================================================== */


/**
   * Remove the margin in all browsers.
   */

body {
    margin: 0;
}


/**
   * Render the \`main\` element consistently in IE.
   */

main {
    display: block;
}


/**
   * Correct the font size and margin on \`h1\` elements within \`section\` and
   * \`article\` contexts in Chrome, Firefox, and Safari.
   */

h1 {
    font-size: 2em;
    margin: 0.67em 0;
}


/* Grouping content
     ========================================================================== */


/**
   * 1. Add the correct box sizing in Firefox.
   * 2. Show the overflow in Edge and IE.
   */

hr {
    box-sizing: content-box;
    /* 1 */
    height: 0;
    /* 1 */
    overflow: visible;
    /* 2 */
}


/**
   * 1. Correct the inheritance and scaling of font size in all browsers.
   * 2. Correct the odd \`em\` font sizing in all browsers.
   */

pre {
    font-family: monospace, monospace;
    /* 1 */
    font-size: 1em;
    /* 2 */
}


/* Text-level semantics
     ========================================================================== */


/**
   * Remove the gray background on active links in IE 10.
   */

a {
    background-color: transparent;
}


/**
   * 1. Remove the bottom border in Chrome 57-
   * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
   */

abbr[title] {
    border-bottom: none;
    /* 1 */
    text-decoration: underline;
    /* 2 */
    text-decoration: underline dotted;
    /* 2 */
}


/**
   * Add the correct font weight in Chrome, Edge, and Safari.
   */

b,
strong {
    font-weight: bolder;
}


/**
   * 1. Correct the inheritance and scaling of font size in all browsers.
   * 2. Correct the odd \`em\` font sizing in all browsers.
   */

code,
kbd,
samp {
    font-family: monospace, monospace;
    /* 1 */
    font-size: 1em;
    /* 2 */
}


/**
   * Add the correct font size in all browsers.
   */

small {
    font-size: 80%;
}


/**
   * Prevent \`sub\` and \`sup\` elements from affecting the line height in
   * all browsers.
   */

sub,
sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
}

sub {
    bottom: -0.25em;
}

sup {
    top: -0.5em;
}


/* Embedded content
     ========================================================================== */


/**
   * Remove the border on images inside links in IE 10.
   */

img {
    border-style: none;
}


/* Forms
     ========================================================================== */


/**
   * 1. Change the font styles in all browsers.
   * 2. Remove the margin in Firefox and Safari.
   */

button,
input,
optgroup,
select,
textarea {
    font-family: inherit;
    /* 1 */
    font-size: 100%;
    /* 1 */
    line-height: 1.15;
    /* 1 */
    margin: 0;
    /* 2 */
}


/**
   * Show the overflow in IE.
   * 1. Show the overflow in Edge.
   */

button,
input {
    /* 1 */
    overflow: visible;
}


/**
   * Remove the inheritance of text transform in Edge, Firefox, and IE.
   * 1. Remove the inheritance of text transform in Firefox.
   */

button,
select {
    /* 1 */
    text-transform: none;
}


/**
   * Correct the inability to style clickable types in iOS and Safari.
   */

button,
[type="button"],
[type="reset"],
[type="submit"] {
    -webkit-appearance: button;
}


/**
   * Remove the inner border and padding in Firefox.
   */

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
    border-style: none;
    padding: 0;
}


/**
   * Restore the focus styles unset by the previous rule.
   */

button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
    outline: 1px dotted ButtonText;
}


/**
   * Correct the padding in Firefox.
   */

fieldset {
    padding: 0.35em 0.75em 0.625em;
}


/**
   * 1. Correct the text wrapping in Edge and IE.
   * 2. Correct the color inheritance from \`fieldset\` elements in IE.
   * 3. Remove the padding so developers are not caught out when they zero out
   *    \`fieldset\` elements in all browsers.
   */

legend {
    box-sizing: border-box;
    /* 1 */
    color: inherit;
    /* 2 */
    display: table;
    /* 1 */
    max-width: 100%;
    /* 1 */
    padding: 0;
    /* 3 */
    white-space: normal;
    /* 1 */
}


/**
   * Add the correct vertical alignment in Chrome, Firefox, and Opera.
   */

progress {
    vertical-align: baseline;
}


/**
   * Remove the default vertical scrollbar in IE 10+.
   */

textarea {
    overflow: auto;
}


/**
   * 1. Add the correct box sizing in IE 10.
   * 2. Remove the padding in IE 10.
   */

[type="checkbox"],
[type="radio"] {
    box-sizing: border-box;
    /* 1 */
    padding: 0;
    /* 2 */
}


/**
   * Correct the cursor style of increment and decrement buttons in Chrome.
   */

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
    height: auto;
}


/**
   * 1. Correct the odd appearance in Chrome and Safari.
   * 2. Correct the outline style in Safari.
   */

[type="search"] {
    -webkit-appearance: textfield;
    /* 1 */
    outline-offset: -2px;
    /* 2 */
}


/**
   * Remove the inner padding in Chrome and Safari on macOS.
   */

[type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
}


/**
   * 1. Correct the inability to style clickable types in iOS and Safari.
   * 2. Change font properties to \`inherit\` in Safari.
   */

 ::-webkit-file-upload-button {
    -webkit-appearance: button;
    /* 1 */
    font: inherit;
    /* 2 */
}


/* Interactive
     ========================================================================== */


/*
   * Add the correct display in Edge, IE 10+, and Firefox.
   */

details {
    display: block;
}


/*
   * Add the correct display in all browsers.
   */

summary {
    display: list-item;
}


/* Misc
     ========================================================================== */


/**
   * Add the correct display in IE 10+.
   */

template {
    display: none;
}


/**
   * Add the correct display in IE 10.
   */

[hidden] {
    display: none;
}`, "",{"version":3,"sources":["webpack://./src/styles/nomarlize.css"],"names":[],"mappings":"AAAA,2EAA2E;;;AAG3E;+EAC+E;;;AAG/E;;;EAGE;;AAEF;IACI,iBAAiB;IACjB,MAAM;IACN,8BAA8B;IAC9B,MAAM;AACV;;;AAGA;iFACiF;;;AAGjF;;IAEI;;AAEJ;IACI,SAAS;AACb;;;AAGA;;IAEI;;AAEJ;IACI,cAAc;AAClB;;;AAGA;;;IAGI;;AAEJ;IACI,cAAc;IACd,gBAAgB;AACpB;;;AAGA;iFACiF;;;AAGjF;;;IAGI;;AAEJ;IACI,uBAAuB;IACvB,MAAM;IACN,SAAS;IACT,MAAM;IACN,iBAAiB;IACjB,MAAM;AACV;;;AAGA;;;IAGI;;AAEJ;IACI,iCAAiC;IACjC,MAAM;IACN,cAAc;IACd,MAAM;AACV;;;AAGA;iFACiF;;;AAGjF;;IAEI;;AAEJ;IACI,6BAA6B;AACjC;;;AAGA;;;IAGI;;AAEJ;IACI,mBAAmB;IACnB,MAAM;IACN,0BAA0B;IAC1B,MAAM;IACN,iCAAiC;IACjC,MAAM;AACV;;;AAGA;;IAEI;;AAEJ;;IAEI,mBAAmB;AACvB;;;AAGA;;;IAGI;;AAEJ;;;IAGI,iCAAiC;IACjC,MAAM;IACN,cAAc;IACd,MAAM;AACV;;;AAGA;;IAEI;;AAEJ;IACI,cAAc;AAClB;;;AAGA;;;IAGI;;AAEJ;;IAEI,cAAc;IACd,cAAc;IACd,kBAAkB;IAClB,wBAAwB;AAC5B;;AAEA;IACI,eAAe;AACnB;;AAEA;IACI,WAAW;AACf;;;AAGA;iFACiF;;;AAGjF;;IAEI;;AAEJ;IACI,kBAAkB;AACtB;;;AAGA;iFACiF;;;AAGjF;;;IAGI;;AAEJ;;;;;IAKI,oBAAoB;IACpB,MAAM;IACN,eAAe;IACf,MAAM;IACN,iBAAiB;IACjB,MAAM;IACN,SAAS;IACT,MAAM;AACV;;;AAGA;;;IAGI;;AAEJ;;IAEI,MAAM;IACN,iBAAiB;AACrB;;;AAGA;;;IAGI;;AAEJ;;IAEI,MAAM;IACN,oBAAoB;AACxB;;;AAGA;;IAEI;;AAEJ;;;;IAII,0BAA0B;AAC9B;;;AAGA;;IAEI;;AAEJ;;;;IAII,kBAAkB;IAClB,UAAU;AACd;;;AAGA;;IAEI;;AAEJ;;;;IAII,8BAA8B;AAClC;;;AAGA;;IAEI;;AAEJ;IACI,8BAA8B;AAClC;;;AAGA;;;;;IAKI;;AAEJ;IACI,sBAAsB;IACtB,MAAM;IACN,cAAc;IACd,MAAM;IACN,cAAc;IACd,MAAM;IACN,eAAe;IACf,MAAM;IACN,UAAU;IACV,MAAM;IACN,mBAAmB;IACnB,MAAM;AACV;;;AAGA;;IAEI;;AAEJ;IACI,wBAAwB;AAC5B;;;AAGA;;IAEI;;AAEJ;IACI,cAAc;AAClB;;;AAGA;;;IAGI;;AAEJ;;IAEI,sBAAsB;IACtB,MAAM;IACN,UAAU;IACV,MAAM;AACV;;;AAGA;;IAEI;;AAEJ;;IAEI,YAAY;AAChB;;;AAGA;;;IAGI;;AAEJ;IACI,6BAA6B;IAC7B,MAAM;IACN,oBAAoB;IACpB,MAAM;AACV;;;AAGA;;IAEI;;AAEJ;IACI,wBAAwB;AAC5B;;;AAGA;;;IAGI;;CAEH;IACG,0BAA0B;IAC1B,MAAM;IACN,aAAa;IACb,MAAM;AACV;;;AAGA;iFACiF;;;AAGjF;;IAEI;;AAEJ;IACI,cAAc;AAClB;;;AAGA;;IAEI;;AAEJ;IACI,kBAAkB;AACtB;;;AAGA;iFACiF;;;AAGjF;;IAEI;;AAEJ;IACI,aAAa;AACjB;;;AAGA;;IAEI;;AAEJ;IACI,aAAa;AACjB","sourcesContent":["/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n\n/* Document\n   ========================================================================== */\n\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\nhtml {\n    line-height: 1.15;\n    /* 1 */\n    -webkit-text-size-adjust: 100%;\n    /* 2 */\n}\n\n\n/* Sections\n     ========================================================================== */\n\n\n/**\n   * Remove the margin in all browsers.\n   */\n\nbody {\n    margin: 0;\n}\n\n\n/**\n   * Render the `main` element consistently in IE.\n   */\n\nmain {\n    display: block;\n}\n\n\n/**\n   * Correct the font size and margin on `h1` elements within `section` and\n   * `article` contexts in Chrome, Firefox, and Safari.\n   */\n\nh1 {\n    font-size: 2em;\n    margin: 0.67em 0;\n}\n\n\n/* Grouping content\n     ========================================================================== */\n\n\n/**\n   * 1. Add the correct box sizing in Firefox.\n   * 2. Show the overflow in Edge and IE.\n   */\n\nhr {\n    box-sizing: content-box;\n    /* 1 */\n    height: 0;\n    /* 1 */\n    overflow: visible;\n    /* 2 */\n}\n\n\n/**\n   * 1. Correct the inheritance and scaling of font size in all browsers.\n   * 2. Correct the odd `em` font sizing in all browsers.\n   */\n\npre {\n    font-family: monospace, monospace;\n    /* 1 */\n    font-size: 1em;\n    /* 2 */\n}\n\n\n/* Text-level semantics\n     ========================================================================== */\n\n\n/**\n   * Remove the gray background on active links in IE 10.\n   */\n\na {\n    background-color: transparent;\n}\n\n\n/**\n   * 1. Remove the bottom border in Chrome 57-\n   * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n   */\n\nabbr[title] {\n    border-bottom: none;\n    /* 1 */\n    text-decoration: underline;\n    /* 2 */\n    text-decoration: underline dotted;\n    /* 2 */\n}\n\n\n/**\n   * Add the correct font weight in Chrome, Edge, and Safari.\n   */\n\nb,\nstrong {\n    font-weight: bolder;\n}\n\n\n/**\n   * 1. Correct the inheritance and scaling of font size in all browsers.\n   * 2. Correct the odd `em` font sizing in all browsers.\n   */\n\ncode,\nkbd,\nsamp {\n    font-family: monospace, monospace;\n    /* 1 */\n    font-size: 1em;\n    /* 2 */\n}\n\n\n/**\n   * Add the correct font size in all browsers.\n   */\n\nsmall {\n    font-size: 80%;\n}\n\n\n/**\n   * Prevent `sub` and `sup` elements from affecting the line height in\n   * all browsers.\n   */\n\nsub,\nsup {\n    font-size: 75%;\n    line-height: 0;\n    position: relative;\n    vertical-align: baseline;\n}\n\nsub {\n    bottom: -0.25em;\n}\n\nsup {\n    top: -0.5em;\n}\n\n\n/* Embedded content\n     ========================================================================== */\n\n\n/**\n   * Remove the border on images inside links in IE 10.\n   */\n\nimg {\n    border-style: none;\n}\n\n\n/* Forms\n     ========================================================================== */\n\n\n/**\n   * 1. Change the font styles in all browsers.\n   * 2. Remove the margin in Firefox and Safari.\n   */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n    font-family: inherit;\n    /* 1 */\n    font-size: 100%;\n    /* 1 */\n    line-height: 1.15;\n    /* 1 */\n    margin: 0;\n    /* 2 */\n}\n\n\n/**\n   * Show the overflow in IE.\n   * 1. Show the overflow in Edge.\n   */\n\nbutton,\ninput {\n    /* 1 */\n    overflow: visible;\n}\n\n\n/**\n   * Remove the inheritance of text transform in Edge, Firefox, and IE.\n   * 1. Remove the inheritance of text transform in Firefox.\n   */\n\nbutton,\nselect {\n    /* 1 */\n    text-transform: none;\n}\n\n\n/**\n   * Correct the inability to style clickable types in iOS and Safari.\n   */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n    -webkit-appearance: button;\n}\n\n\n/**\n   * Remove the inner border and padding in Firefox.\n   */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n    border-style: none;\n    padding: 0;\n}\n\n\n/**\n   * Restore the focus styles unset by the previous rule.\n   */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n    outline: 1px dotted ButtonText;\n}\n\n\n/**\n   * Correct the padding in Firefox.\n   */\n\nfieldset {\n    padding: 0.35em 0.75em 0.625em;\n}\n\n\n/**\n   * 1. Correct the text wrapping in Edge and IE.\n   * 2. Correct the color inheritance from `fieldset` elements in IE.\n   * 3. Remove the padding so developers are not caught out when they zero out\n   *    `fieldset` elements in all browsers.\n   */\n\nlegend {\n    box-sizing: border-box;\n    /* 1 */\n    color: inherit;\n    /* 2 */\n    display: table;\n    /* 1 */\n    max-width: 100%;\n    /* 1 */\n    padding: 0;\n    /* 3 */\n    white-space: normal;\n    /* 1 */\n}\n\n\n/**\n   * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n   */\n\nprogress {\n    vertical-align: baseline;\n}\n\n\n/**\n   * Remove the default vertical scrollbar in IE 10+.\n   */\n\ntextarea {\n    overflow: auto;\n}\n\n\n/**\n   * 1. Add the correct box sizing in IE 10.\n   * 2. Remove the padding in IE 10.\n   */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n    box-sizing: border-box;\n    /* 1 */\n    padding: 0;\n    /* 2 */\n}\n\n\n/**\n   * Correct the cursor style of increment and decrement buttons in Chrome.\n   */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n    height: auto;\n}\n\n\n/**\n   * 1. Correct the odd appearance in Chrome and Safari.\n   * 2. Correct the outline style in Safari.\n   */\n\n[type=\"search\"] {\n    -webkit-appearance: textfield;\n    /* 1 */\n    outline-offset: -2px;\n    /* 2 */\n}\n\n\n/**\n   * Remove the inner padding in Chrome and Safari on macOS.\n   */\n\n[type=\"search\"]::-webkit-search-decoration {\n    -webkit-appearance: none;\n}\n\n\n/**\n   * 1. Correct the inability to style clickable types in iOS and Safari.\n   * 2. Change font properties to `inherit` in Safari.\n   */\n\n ::-webkit-file-upload-button {\n    -webkit-appearance: button;\n    /* 1 */\n    font: inherit;\n    /* 2 */\n}\n\n\n/* Interactive\n     ========================================================================== */\n\n\n/*\n   * Add the correct display in Edge, IE 10+, and Firefox.\n   */\n\ndetails {\n    display: block;\n}\n\n\n/*\n   * Add the correct display in all browsers.\n   */\n\nsummary {\n    display: list-item;\n}\n\n\n/* Misc\n     ========================================================================== */\n\n\n/**\n   * Add the correct display in IE 10+.\n   */\n\ntemplate {\n    display: none;\n}\n\n\n/**\n   * Add the correct display in IE 10.\n   */\n\n[hidden] {\n    display: none;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/style.css":
/*!********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/style.css ***!
  \********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_nomarlize_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./nomarlize.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/nomarlize.css");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3__);
// Imports




var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../images/magnify.png */ "./src/images/magnify.png"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_nomarlize_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:root {
    --clr-neutral: hsl(0, 0%, 100%);
    --clr-neutral-transp: rgba(255, 255, 255, 0.171);
    --ff-primary: 'Freehand', cursive;
    /* font weight*/
    --fw-300: 300;
    --fw-400: 400;
    --fw-500: 500;
    --fw-600: 600;
    --fw-700: 700;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    width: 100vw;
    min-height: 100vh;
    background-color: rgb(142, 227, 233);
    font-family: var(--ff-primary);
    color: #ffffff;
    font-family: var(--ff-primary);
    font-size: 1.25rem;
}

main {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    position: relative;
    height: 100vh;
    width: 100vw;
    padding: 4rem 2rem;
    overflow: hidden;
}

.video-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -5;
}

video {
    width: 100vw;
    height: 100vh;
    object-fit: cover;
}

.unitC,
.unitF {
    font-size: 0.85rem;
    height: 16px;
    width: 16px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: hsl(0, 0%, 0%);
    z-index: 20;
    pointer-events: none;
    text-shadow: none;
}

.unitF {
    color: hsl(0, 0%, 100%);
}

.checkbox {
    position: absolute;
    top: 3rem;
    left: 3rem;
}

.checkbox {
    position: absolute;
    opacity: 0;
}

.label {
    border-radius: 50px;
    width: 500px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    position: relative;
    right: 50px;
    float: right;
    height: 26px;
    width: 50px;
    transform: scale(1.5);
    background-color: #111;
}

.label .ball {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    background: #f5f4f4;
    transform: translateX(0px);
    transition: transform 0.2s linear;
}

.checkbox:checked+.label .ball {
    transform: translateX(24px);
}

.search-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.search-wrapper input {
    width: 40%;
    padding: 10px 10px 10px 40px;
    border-radius: 2rem;
    border: none;
    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
    background-repeat: no-repeat;
    background-position: 10px center;
    background-size: calc(1rem + 0.5vw);
    background-color: white;
    text-shadow: none;
}

#error {
    display: none;
    font-size: 1.5rem;
    color: hsl(0, 100%, 50%);
}

.city-info h1 {
    margin: 0.3rem 0;
    letter-spacing: 0.1rem;
    text-transform: uppercase;
    font-weight: var(--fw-600);
    font-size: 2.5rem;
}

h2 {
    font-size: 1.5rem;
    font-weight: var(--fw-300);
}

.current-weather {
    display: flex;
    justify-content: space-around;
}

.current-weather__container {
    display: flex;
}

.current-weather__container img {
    display: flex;
    align-self: start;
    width: calc(7rem + 10vw);
}

.current-weather_cointainer h1 {
    margin: 0.3rem 0;
    font-size: 4rem;
    font-weight: var(--fw-400);
}

.current-weather__temp {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.current-weather__details {
    display: flex;
    align-items: center;
    align-self: center;
    height: max-content;
    padding: 2rem 4rem;
    gap: 4rem;
    border-radius: 0.5rem;
    background-color: var(--clr-neutral-transp);
}

.current-weather__item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
}

.current-weather__item img {
    width: calc(1rem + 1vw);
}

.current-weather__details__column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.forecast {
    display: flex;
    justify-content: space-around;
    width: 100%;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    background-color: var(--clr-neutral-transp);
}

.forecast__item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.forecast__item img {
    width: calc(2rem + 3vw);
}

.color-black {
    color: #070707;
}`, "",{"version":3,"sources":["webpack://./src/styles/style.css"],"names":[],"mappings":"AACA;IACI,+BAA+B;IAC/B,gDAAgD;IAChD,iCAAiC;IACjC,eAAe;IACf,aAAa;IACb,aAAa;IACb,aAAa;IACb,aAAa;IACb,aAAa;AACjB;;AAEA;IACI,SAAS;IACT,UAAU;IACV,sBAAsB;AAC1B;;AAEA;IACI,YAAY;IACZ,iBAAiB;IACjB,oCAAoC;IACpC,8BAA8B;IAC9B,cAAc;IACd,8BAA8B;IAC9B,kBAAkB;AACtB;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,6BAA6B;IAC7B,kBAAkB;IAClB,aAAa;IACb,YAAY;IACZ,kBAAkB;IAClB,gBAAgB;AACpB;;AAEA;IACI,kBAAkB;IAClB,MAAM;IACN,OAAO;IACP,YAAY;IACZ,aAAa;IACb,WAAW;AACf;;AAEA;IACI,YAAY;IACZ,aAAa;IACb,iBAAiB;AACrB;;AAEA;;IAEI,kBAAkB;IAClB,YAAY;IACZ,WAAW;IACX,kBAAkB;IAClB,aAAa;IACb,uBAAuB;IACvB,mBAAmB;IACnB,qBAAqB;IACrB,WAAW;IACX,oBAAoB;IACpB,iBAAiB;AACrB;;AAEA;IACI,uBAAuB;AAC3B;;AAEA;IACI,kBAAkB;IAClB,SAAS;IACT,UAAU;AACd;;AAEA;IACI,kBAAkB;IAClB,UAAU;AACd;;AAEA;IACI,mBAAmB;IACnB,YAAY;IACZ,eAAe;IACf,aAAa;IACb,mBAAmB;IACnB,8BAA8B;IAC9B,YAAY;IACZ,kBAAkB;IAClB,WAAW;IACX,YAAY;IACZ,YAAY;IACZ,WAAW;IACX,qBAAqB;IACrB,sBAAsB;AAC1B;;AAEA;IACI,YAAY;IACZ,WAAW;IACX,kBAAkB;IAClB,kBAAkB;IAClB,QAAQ;IACR,SAAS;IACT,mBAAmB;IACnB,0BAA0B;IAC1B,iCAAiC;AACrC;;AAEA;IACI,2BAA2B;AAC/B;;AAEA;IACI,kBAAkB;IAClB,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,SAAS;AACb;;AAEA;IACI,UAAU;IACV,4BAA4B;IAC5B,mBAAmB;IACnB,YAAY;IACZ,yDAA4C;IAC5C,4BAA4B;IAC5B,gCAAgC;IAChC,mCAAmC;IACnC,uBAAuB;IACvB,iBAAiB;AACrB;;AAEA;IACI,aAAa;IACb,iBAAiB;IACjB,wBAAwB;AAC5B;;AAEA;IACI,gBAAgB;IAChB,sBAAsB;IACtB,yBAAyB;IACzB,0BAA0B;IAC1B,iBAAiB;AACrB;;AAEA;IACI,iBAAiB;IACjB,0BAA0B;AAC9B;;AAEA;IACI,aAAa;IACb,6BAA6B;AACjC;;AAEA;IACI,aAAa;AACjB;;AAEA;IACI,aAAa;IACb,iBAAiB;IACjB,wBAAwB;AAC5B;;AAEA;IACI,gBAAgB;IAChB,eAAe;IACf,0BAA0B;AAC9B;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,uBAAuB;AAC3B;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,kBAAkB;IAClB,mBAAmB;IACnB,kBAAkB;IAClB,SAAS;IACT,qBAAqB;IACrB,2CAA2C;AAC/C;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,WAAW;IACX,iBAAiB;AACrB;;AAEA;IACI,uBAAuB;AAC3B;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,SAAS;AACb;;AAEA;IACI,aAAa;IACb,6BAA6B;IAC7B,WAAW;IACX,kBAAkB;IAClB,qBAAqB;IACrB,2CAA2C;AAC/C;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;AACvB;;AAEA;IACI,uBAAuB;AAC3B;;AAEA;IACI,cAAc;AAClB","sourcesContent":["@import url(./nomarlize.css);\n:root {\n    --clr-neutral: hsl(0, 0%, 100%);\n    --clr-neutral-transp: rgba(255, 255, 255, 0.171);\n    --ff-primary: 'Freehand', cursive;\n    /* font weight*/\n    --fw-300: 300;\n    --fw-400: 400;\n    --fw-500: 500;\n    --fw-600: 600;\n    --fw-700: 700;\n}\n\n* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nbody {\n    width: 100vw;\n    min-height: 100vh;\n    background-color: rgb(142, 227, 233);\n    font-family: var(--ff-primary);\n    color: #ffffff;\n    font-family: var(--ff-primary);\n    font-size: 1.25rem;\n}\n\nmain {\n    display: flex;\n    flex-direction: column;\n    justify-content: space-evenly;\n    position: relative;\n    height: 100vh;\n    width: 100vw;\n    padding: 4rem 2rem;\n    overflow: hidden;\n}\n\n.video-container {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100vw;\n    height: 100vh;\n    z-index: -5;\n}\n\nvideo {\n    width: 100vw;\n    height: 100vh;\n    object-fit: cover;\n}\n\n.unitC,\n.unitF {\n    font-size: 0.85rem;\n    height: 16px;\n    width: 16px;\n    border-radius: 8px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    color: hsl(0, 0%, 0%);\n    z-index: 20;\n    pointer-events: none;\n    text-shadow: none;\n}\n\n.unitF {\n    color: hsl(0, 0%, 100%);\n}\n\n.checkbox {\n    position: absolute;\n    top: 3rem;\n    left: 3rem;\n}\n\n.checkbox {\n    position: absolute;\n    opacity: 0;\n}\n\n.label {\n    border-radius: 50px;\n    width: 500px;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 5px;\n    position: relative;\n    right: 50px;\n    float: right;\n    height: 26px;\n    width: 50px;\n    transform: scale(1.5);\n    background-color: #111;\n}\n\n.label .ball {\n    height: 20px;\n    width: 20px;\n    border-radius: 50%;\n    position: absolute;\n    top: 2px;\n    left: 2px;\n    background: #f5f4f4;\n    transform: translateX(0px);\n    transition: transform 0.2s linear;\n}\n\n.checkbox:checked+.label .ball {\n    transform: translateX(24px);\n}\n\n.search-wrapper {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    gap: 10px;\n}\n\n.search-wrapper input {\n    width: 40%;\n    padding: 10px 10px 10px 40px;\n    border-radius: 2rem;\n    border: none;\n    background-image: url(../images/magnify.png);\n    background-repeat: no-repeat;\n    background-position: 10px center;\n    background-size: calc(1rem + 0.5vw);\n    background-color: white;\n    text-shadow: none;\n}\n\n#error {\n    display: none;\n    font-size: 1.5rem;\n    color: hsl(0, 100%, 50%);\n}\n\n.city-info h1 {\n    margin: 0.3rem 0;\n    letter-spacing: 0.1rem;\n    text-transform: uppercase;\n    font-weight: var(--fw-600);\n    font-size: 2.5rem;\n}\n\nh2 {\n    font-size: 1.5rem;\n    font-weight: var(--fw-300);\n}\n\n.current-weather {\n    display: flex;\n    justify-content: space-around;\n}\n\n.current-weather__container {\n    display: flex;\n}\n\n.current-weather__container img {\n    display: flex;\n    align-self: start;\n    width: calc(7rem + 10vw);\n}\n\n.current-weather_cointainer h1 {\n    margin: 0.3rem 0;\n    font-size: 4rem;\n    font-weight: var(--fw-400);\n}\n\n.current-weather__temp {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n}\n\n.current-weather__details {\n    display: flex;\n    align-items: center;\n    align-self: center;\n    height: max-content;\n    padding: 2rem 4rem;\n    gap: 4rem;\n    border-radius: 0.5rem;\n    background-color: var(--clr-neutral-transp);\n}\n\n.current-weather__item {\n    display: flex;\n    align-items: center;\n    gap: 0.5rem;\n    font-size: 1.5rem;\n}\n\n.current-weather__item img {\n    width: calc(1rem + 1vw);\n}\n\n.current-weather__details__column {\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n}\n\n.forecast {\n    display: flex;\n    justify-content: space-around;\n    width: 100%;\n    padding: 1rem 2rem;\n    border-radius: 0.5rem;\n    background-color: var(--clr-neutral-transp);\n}\n\n.forecast__item {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n}\n\n.forecast__item img {\n    width: calc(2rem + 3vw);\n}\n\n.color-black {\n    color: #070707;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles/style.css":
/*!******************************!*\
  !*** ./src/styles/style.css ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/images/magnify.png":
/*!********************************!*\
  !*** ./src/images/magnify.png ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "001051c069dde3ca2ccb.png";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************************!*\
  !*** ./src/scripts/index.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles/style.css */ "./src/styles/style.css");
/* harmony import */ var _models_mainModel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models/mainModel */ "./src/scripts/models/mainModel.js");
/* harmony import */ var _views_mainView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./views/mainView */ "./src/scripts/views/mainView.js");
/* harmony import */ var _controllers_mainController__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./controllers/mainController */ "./src/scripts/controllers/mainController.js");




const model = new _models_mainModel__WEBPACK_IMPORTED_MODULE_1__["default"]();
const view = new _views_mainView__WEBPACK_IMPORTED_MODULE_2__["default"]();
const controller = new _controllers_mainController__WEBPACK_IMPORTED_MODULE_3__["default"](model, view);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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R0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDLE9BQU8sb0dBQW9HLE1BQU0sU0FBUyxRQUFRLE1BQU0sS0FBSyxZQUFZLFdBQVcsWUFBWSxXQUFXLE9BQU8sS0FBSyxTQUFTLE9BQU8sTUFBTSxLQUFLLFVBQVUsT0FBTyxNQUFNLE1BQU0sS0FBSyxVQUFVLFFBQVEsT0FBTyxNQUFNLEtBQUssVUFBVSxZQUFZLFFBQVEsS0FBSyxTQUFTLFFBQVEsTUFBTSxLQUFLLFlBQVksV0FBVyxVQUFVLFVBQVUsWUFBWSxXQUFXLE9BQU8sT0FBTyxNQUFNLEtBQUssWUFBWSxXQUFXLFVBQVUsVUFBVSxPQUFPLEtBQUssU0FBUyxPQUFPLE1BQU0sS0FBSyxZQUFZLFFBQVEsT0FBTyxNQUFNLEtBQUssWUFBWSxXQUFXLFlBQVksV0FBVyxZQUFZLFdBQVcsT0FBTyxNQUFNLE1BQU0sTUFBTSxZQUFZLFFBQVEsT0FBTyxNQUFNLE9BQU8sWUFBWSxXQUFXLFVBQVUsVUFBVSxPQUFPLE1BQU0sTUFBTSxLQUFLLFVBQVUsUUFBUSxPQUFPLE1BQU0sTUFBTSxVQUFVLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLE9BQU8sS0FBSyxVQUFVLE9BQU8sS0FBSyxTQUFTLE9BQU8sTUFBTSxLQUFLLFlBQVksUUFBUSxLQUFLLFNBQVMsUUFBUSxNQUFNLFNBQVMsWUFBWSxXQUFXLFVBQVUsVUFBVSxZQUFZLFdBQVcsVUFBVSxVQUFVLE9BQU8sT0FBTyxNQUFNLE1BQU0sVUFBVSxZQUFZLFFBQVEsT0FBTyxNQUFNLE1BQU0sVUFBVSxZQUFZLFFBQVEsTUFBTSxNQUFNLFFBQVEsWUFBWSxRQUFRLE1BQU0sTUFBTSxRQUFRLFlBQVksV0FBVyxPQUFPLE1BQU0sTUFBTSxRQUFRLFlBQVksUUFBUSxNQUFNLE1BQU0sS0FBSyxZQUFZLFFBQVEsU0FBUyxNQUFNLEtBQUssWUFBWSxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxZQUFZLFdBQVcsT0FBTyxNQUFNLE1BQU0sS0FBSyxZQUFZLFFBQVEsTUFBTSxNQUFNLEtBQUssVUFBVSxRQUFRLE9BQU8sTUFBTSxNQUFNLFlBQVksV0FBVyxVQUFVLFVBQVUsT0FBTyxNQUFNLE1BQU0sTUFBTSxVQUFVLFFBQVEsT0FBTyxNQUFNLEtBQUssWUFBWSxXQUFXLFlBQVksV0FBVyxPQUFPLE1BQU0sTUFBTSxLQUFLLFlBQVksUUFBUSxPQUFPLE1BQU0sS0FBSyxZQUFZLFdBQVcsVUFBVSxVQUFVLE9BQU8sS0FBSyxTQUFTLE9BQU8sTUFBTSxLQUFLLFVBQVUsUUFBUSxNQUFNLE1BQU0sS0FBSyxZQUFZLFFBQVEsS0FB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QUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDLE9BQU8sdUZBQXVGLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsVUFBVSxVQUFVLFVBQVUsVUFBVSxNQUFNLEtBQUssVUFBVSxVQUFVLFlBQVksT0FBTyxNQUFNLFlBQVksV0FBVyxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLFVBQVUsTUFBTSxLQUFLLFlBQVksV0FBVyxNQUFNLEtBQUssWUFBWSxXQUFXLFVBQVUsVUFBVSxZQUFZLGFBQWEsV0FBVyxZQUFZLFdBQVcsVUFBVSxVQUFVLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWSxhQUFhLFdBQVcsVUFBVSxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLFlBQVksYUFBYSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlB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UEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ2xCQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7Ozs7O1dDckJBOzs7Ozs7Ozs7Ozs7Ozs7QUNBNkI7QUFDYztBQUNKO0FBQ21CO0FBRzFELE1BQU1ULEtBQUssR0FBRyxJQUFJeUkseURBQVMsQ0FBQyxDQUFDO0FBQzdCLE1BQU14SSxJQUFJLEdBQUcsSUFBSTRKLHVEQUFRLENBQUMsQ0FBQztBQUMzQixNQUFNQyxVQUFVLEdBQUcsSUFBSWhLLG1FQUFjLENBQUNFLEtBQUssRUFBRUMsSUFBSSxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9zY3JpcHRzL2NvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3NjcmlwdHMvbW9kZWxzL0FQSXMuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvc2NyaXB0cy9tb2RlbHMvY2l0eUluZm8uanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvc2NyaXB0cy9tb2RlbHMvY3VycmVudFdlYXRoZXIuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvc2NyaXB0cy9tb2RlbHMvZm9yZWNhc3RXZWF0aGVyLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3NjcmlwdHMvbW9kZWxzL21haW5Nb2RlbC5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9zY3JpcHRzL3ZpZXdzL2NpdHlJbmZvVmlldy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9zY3JpcHRzL3ZpZXdzL2N1cnJlbnRXZWF0aGVyVmlldy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9zY3JpcHRzL3ZpZXdzL2ZvcmVjYXN0V2VhdGhlclZpZXcuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvc2NyaXB0cy92aWV3cy9tYWluVmlldy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9zdHlsZXMvbm9tYXJsaXplLmNzcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9zdHlsZXMvc3R5bGUuY3NzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9zdHlsZXMvc3R5bGUuY3NzP2ZmOTQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3NjcmlwdHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFpbkNvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB2aWV3KSB7XG4gICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICAgICAgdGhpcy5jaXR5ID0ge307XG4gICAgICAgIHRoaXMudW5pdCA9IFwibWV0cmljXCI7XG4gICAgICAgIHRoaXMuY2l0eSA9IFwia2l0YWxlXCI7XG4gICAgICAgIHRoaXMubG9hZHBhZ2UodGhpcy5jaXR5KTtcblxuXG4gICAgfVxuXG5cbiAgICBhc3luYyBsb2FkcGFnZShjaXR5KSB7XG4gICAgICAgIHRoaXMuY2l0eSA9IGNpdHk7XG5cbiAgICAgICAgY29uc3QgY2l0eUluZm8gPSBhd2FpdCB0aGlzLm1vZGVsLmdldENpdHlJbmZvKGNpdHksIHRoaXMudW5pdCk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRXZWF0aGVyID0gYXdhaXQgdGhpcy5tb2RlbC5nZXRDdXJyZW50V2VhdGhlcihjaXR5LCB0aGlzLnVuaXQpO1xuICAgICAgICBjb25zdCBmb3JlY2FzdFdlYXRoZXIgPSBhd2FpdCB0aGlzLm1vZGVsLmdldEZvcmVjYXN0V2VhdGhlcihjaXR5LCB0aGlzLnVuaXQpO1xuICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50V2VhdGhlcik7XG5cblxuICAgICAgICB0aGlzLnZpZXcuYXBwZW5kQ2l0eUluZm8oY2l0eUluZm8pO1xuICAgICAgICB0aGlzLnZpZXcuYXBwZW5kQ3VycnJlbnRXZWF0aGVyKGN1cnJlbnRXZWF0aGVyKTtcbiAgICAgICAgdGhpcy52aWV3LmFwcGVuZEZvcmVjYXN0V2VhdGhlcihmb3JlY2FzdFdlYXRoZXIpO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBBUElzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy51cmxHZW5lcmF0b3IgPSBuZXcgVXJsR2VuZXJldG9yKCdkMzg5N2MxNDg5YzBkOGVjZWE4YWVjYWI5MWRhNGQxZCcpO1xuICAgIH1cblxuICAgIGFzeW5jIGdldEdlb0Nvb3JkaW5hdGVzKGNpdHkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IHRoaXMudXJsR2VuZXJhdG9yLmdlbmVyYXRlR2VvQ29vcmRzVXJsKGNpdHkpO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbW9kZTogXCJjb3JzXCIgfSk7XG4gICAgICAgICAgICBjb25zdCBnZW9Db2RpbmdEYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgY29uc3QgeyBsYXQsIGxvbiB9ID0gZ2VvQ29kaW5nRGF0YVswXTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcnJvcicpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIHJldHVybiB7IGxhdCwgbG9uIH1cblxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgZ2V0Q3VycmVudFdlYXRoZXJEYXRhKGNpdHksIHVuaXQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgbGF0LCBsb24gfSA9IGF3YWl0IHRoaXMuZ2V0R2VvQ29vcmRpbmF0ZXMoY2l0eSk7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSB0aGlzLnVybEdlbmVyYXRvci5nZW5lcmF0ZUN1cnJlbnRXZWF0aGVyKGxhdCwgbG9uLCB1bml0KTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6ICdjb3JzJyB9KTtcbiAgICAgICAgICAgIGNvbnN0IHdlYXRoZXJEYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yJykuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgcmV0dXJuIHdlYXRoZXJEYXRhO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBnZXRGb3JlY2FzdFdlYXRoZXJEYXRhKGNpdHksIHVuaXQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgbGF0LCBsb24gfSA9IGF3YWl0IHRoaXMuZ2V0R2VvQ29vcmRpbmF0ZXMoY2l0eSk7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSB0aGlzLnVybEdlbmVyYXRvci5nZW5lcmF0ZUZvcmVjYXN0V2VhdGhlcihsYXQsIGxvbiwgdW5pdCk7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgeyBtb2RlOiAnY29ycycgfSk7XG4gICAgICAgICAgICBjb25zdCBmb3JlY2FzdERhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIHJldHVybiBmb3JlY2FzdERhdGE7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgVXJsR2VuZXJldG9yIHtcbiAgICBjb25zdHJ1Y3RvcihhcHBJZCkge1xuICAgICAgICB0aGlzLmJhc2VVcmwgPSBcImh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZ1wiO1xuICAgICAgICB0aGlzLmFwcElkID0gYXBwSWQ7XG4gICAgfVxuICAgIGdlbmVyYXRlR2VvQ29vcmRzVXJsKGNpdHkpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuYmFzZVVybH0vZ2VvLzEuMC9kaXJlY3Q/cT0ke2NpdHl9JmFwcGlkPSR7dGhpcy5hcHBJZH1gO1xuICAgIH1cbiAgICBnZW5lcmF0ZUN1cnJlbnRXZWF0aGVyKGxhdCwgbG9uLCB1bml0KSB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmJhc2VVcmx9L2RhdGEvMi41L3dlYXRoZXI/bGF0PSR7bGF0fSZsb249JHtsb259JmFwcGlkPSR7dGhpcy5hcHBJZH0mdW5pdHM9JHt1bml0fWA7XG4gICAgfVxuICAgIGdlbmVyYXRlRm9yZWNhc3RXZWF0aGVyKGxhdCwgbG9uLCB1bml0KSB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmJhc2VVcmx9L2RhdGEvMi41L2ZvcmVjYXN0P2xhdD0ke2xhdH0mbG9uPSR7bG9ufSZjbnQ9JmFwcGlkPSR7dGhpcy5hcHBJZH0mdW5pdHM9JHt1bml0fWA7XG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENpdHlJbmZvIHtcbiAgICBjb25zdHJ1Y3RvcihBcGlEYXRhKSB7XG4gICAgICAgIHRoaXMuY2l0eURlc2NyaXB0aW9uID0gdGhpcy5jcmVhdGVDaXR5RGVzY3JpcHRpb24oQXBpRGF0YSk7XG4gICAgICAgIHRoaXMuZGF0ZURlc2NyaXB0aW9uID0gdGhpcy5jcmVhdGVEYXRlRGVzY3JpcHRpb24oQXBpRGF0YSk7XG5cbiAgICB9XG5cbiAgICBjcmVhdGVDaXR5RGVzY3JpcHRpb24oQXBpRGF0YSkge1xuICAgICAgICBjb25zdCBjaXR5ID0gQXBpRGF0YS5uYW1lO1xuICAgICAgICBjb25zdCB7IGNvdW50cnkgfSA9IEFwaURhdGEuc3lzO1xuXG4gICAgICAgIHJldHVybiBgJHtjaXR5fSwgJHtjb3VudHJ5fWA7XG4gICAgfVxuXG4gICAgY3JlYXRlRGF0ZURlc2NyaXB0aW9uKEFwaURhdGEpIHtcbiAgICAgICAgY29uc3QgZGF5ID0gdGhpcy5nZXREYXkoKTtcbiAgICAgICAgY29uc3QgbW9udGggPSB0aGlzLmdldE1vbnRoKCk7XG4gICAgICAgIGNvbnN0IGRhdGUgPSB0aGlzLmdldERhdGUoKTtcblxuICAgICAgICByZXR1cm4gYCR7ZGF5fSwgJHttb250aH0gJHtkYXRlfWA7XG4gICAgfVxuXG4gICAgZ2V0RGF5KCkge1xuICAgICAgICBjb25zdCB3ZWVrZGF5ID0gW1wiU3VuZGF5XCIsIFwiTW9uZGF5XCIsIFwiVHVlc2RheVwiLCBcIldlZG5lc2RheVwiLCBcIlRodXJzZGF5XCIsIFwiRnJpZGF5XCIsIFwiU2F0dXJkYXlcIl07XG4gICAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBjb25zdCBkYXkgPSB3ZWVrZGF5W2QuZ2V0RGF5KCldO1xuICAgICAgICByZXR1cm4gZGF5O1xuICAgIH1cblxuICAgIGdldE1vbnRoKCkge1xuICAgICAgICBjb25zdCBtb250aE5hbWVzID0gW1xuICAgICAgICAgICAgXCJKYW51YXJ5XCIsXG4gICAgICAgICAgICBcIkZlYnJ1YXJ5XCIsXG4gICAgICAgICAgICBcIk1hcmNoXCIsXG4gICAgICAgICAgICBcIkFwcmlsXCIsXG4gICAgICAgICAgICBcIk1heVwiLFxuICAgICAgICAgICAgXCJKdW5lXCIsXG4gICAgICAgICAgICBcIkp1bHlcIixcbiAgICAgICAgICAgIFwiQXVndXN0XCIsXG4gICAgICAgICAgICBcIlNlcHRlbWJlclwiLFxuICAgICAgICAgICAgXCJPY3RvYmVyXCIsXG4gICAgICAgICAgICBcIk5vdmVtYmVyXCIsXG4gICAgICAgICAgICBcIkRlY2VtYmVyXCIsXG4gICAgICAgIF07XG4gICAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBjb25zdCBtb250aCA9IG1vbnRoTmFtZXNbZC5nZXRNb250aCgpXTtcbiAgICAgICAgcmV0dXJuIG1vbnRoO1xuICAgIH1cbiAgICBnZXREYXRlKCkge1xuICAgICAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICAgICAgY29uc3QgZGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG5cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDdXJyZW50V2VhdGhlciB7XG4gICAgY29uc3RydWN0b3IoY3VycmVudFdlYXRoZXJEYXRhLCB1bml0KSB7XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSB0aGlzLmdldFRlbXBlcmF0dXJlKE1hdGgucm91bmQoY3VycmVudFdlYXRoZXJEYXRhLm1haW4udGVtcCksIHVuaXQpO1xuICAgICAgICB0aGlzLmZlZWxzTGlrZVRlbXAgPSB0aGlzLmdldFRlbXBlcmF0dXJlKE1hdGgucm91bmQoY3VycmVudFdlYXRoZXJEYXRhLm1haW4uZmVlbHNfbGlrZSksIHVuaXQpO1xuICAgICAgICB0aGlzLmh1bWlkaXR5ID0gYCR7Y3VycmVudFdlYXRoZXJEYXRhLm1haW4uaHVtaWRpdHl9JWA7XG4gICAgICAgIHRoaXMud2luZFNwZWVkID0gYCR7Y3VycmVudFdlYXRoZXJEYXRhLndpbmQuc3BlZWR9bS9zYDtcbiAgICAgICAgdGhpcy5wcmVzc3VyZSA9IGAke2N1cnJlbnRXZWF0aGVyRGF0YS5tYWluLnByZXNzdXJlfSBoUGFgO1xuICAgICAgICB0aGlzLnN1bnJpc2UgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eVRpbWUoY3VycmVudFdlYXRoZXJEYXRhLnN5cy5zdW5yaXNlLCBjdXJyZW50V2VhdGhlckRhdGEudGltZXpvbmUpO1xuICAgICAgICB0aGlzLnN1bnNldCA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5VGltZShjdXJyZW50V2VhdGhlckRhdGEuc3lzLnN1bnNldCwgY3VycmVudFdlYXRoZXJEYXRhLnRpbWV6b25lKTtcbiAgICAgICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uRGVzYyA9IGN1cnJlbnRXZWF0aGVyRGF0YS53ZWF0aGVyWzBdLmRlc2NyaXB0aW9uO1xuICAgICAgICB0aGlzLndlYXRoZXJDb25kaXRpb25JbWcgPSB0aGlzLmdldHdlYXRoZXJDb25kaXRpb25JbWcoXG4gICAgICAgICAgICBjdXJyZW50V2VhdGhlckRhdGEud2VhdGhlclswXS5tYWluLFxuICAgICAgICAgICAgY3VycmVudFdlYXRoZXJEYXRhLnN5cy5zdW5yaXNlLFxuICAgICAgICAgICAgY3VycmVudFdlYXRoZXJEYXRhLnN5cy5zdW5zZXQsXG4gICAgICAgICAgICBjdXJyZW50V2VhdGhlckRhdGEudGltZXpvbmVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kVmlkZW8gPSB0aGlzLmdldEJhY2tncm91bmRWaWRlbyh0aGlzLndlYXRoZXJDb25kaXRpb25JbWcpO1xuXG4gICAgfVxuXG4gICAgZ2V0VGVtcGVyYXR1cmUoZGVncmVlcywgdW5pdCkge1xuICAgICAgICByZXR1cm4gdW5pdCA9PT0gXCJtZXRyaWNcIiA/IGAke2RlZ3JlZXN9IOKEg2AgOiBgJHtkZWdyZWVzfSDihIlgO1xuICAgIH1cblxuICAgIGNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUodW5peFRpbWUsIHRpbWV6b25lKSB7XG4gICAgICAgIGNvbnN0IGxvY2FsRGF0ZSA9IHVuaXhUaW1lID09PSAwID8gbmV3IERhdGUgOiBuZXcgRGF0ZSh1bml4VGltZSAqIDEwMDApO1xuICAgICAgICBjb25zdCB1dGNVbml4VGltZSA9IGxvY2FsRGF0ZS5nZXRUaW1lKCkgKyAobG9jYWxEYXRlLmdldFRpbWV6b25lT2Zmc2V0KCkgKiA2MDAwMCk7XG4gICAgICAgIGNvbnN0IHVuaXhUaW1lSW5TZWFyY2hlZENpdHkgPSB1dGNVbml4VGltZSArIHRpbWV6b25lICogMTAwMDtcbiAgICAgICAgY29uc3QgZGF0ZUluU2VhcmNoZWRDaXR5ID0gbmV3IERhdGUodW5peFRpbWVJblNlYXJjaGVkQ2l0eSlcbiAgICAgICAgcmV0dXJuIGRhdGVJblNlYXJjaGVkQ2l0eTtcbiAgICB9XG5cbiAgICBjb252ZXJ0VG9TZWFyY2hlZENpdHlUaW1lKHVuaXhUaW1lLCB0aW1lem9uZSkge1xuICAgICAgICBjb25zdCBkYXRlSW5TZWFyY2hlZENpdHkgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUodW5peFRpbWUsIHRpbWV6b25lKTtcbiAgICAgICAgY29uc3QgaG91cnMgPSBkYXRlSW5TZWFyY2hlZENpdHkuZ2V0SG91cnMoKTtcbiAgICAgICAgY29uc3QgbWludXRlcyA9IGAke2RhdGVJblNlYXJjaGVkQ2l0eS5nZXRNaW51dGVzKCl9YDtcbiAgICAgICAgY29uc3QgZm9ybWF0dGVkVGltZSA9IGAke2hvdXJzfToke21pbnV0ZXN9YDtcbiAgICAgICAgcmV0dXJuIGZvcm1hdHRlZFRpbWU7XG4gICAgfVxuXG4gICAgZ2V0d2VhdGhlckNvbmRpdGlvbkltZyh2YWx1ZSwgc3VucmlzZVVuaXgsIHN1bnNldFVuaXgsIHRpbWV6b25lKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJEcml6emxlXCIpIHJldHVybiBcInJhaW5cIjtcbiAgICAgICAgY29uc3QgbWlzdEVxdWl2YWxlbnRlcyA9IFtcIlNtb2tlXCIsIFwiSGF6ZVwiLCBcIkR1c3RcIiwgXCJGb2dcIiwgXCJTYW5kXCIsIFwiRHVzdFwiLCBcIkFzaFwiLCBcIlNxdWFsbFwiLCBcIlRvcm5hZG9cIl07XG4gICAgICAgIGlmIChtaXN0RXF1aXZhbGVudGVzLmluY2x1ZGVzKHZhbHVlKSkgcmV0dXJuIFwiTWlzdFwiO1xuICAgICAgICBpZiAodmFsdWUgIT09IFwiQ2xlYXJcIikgcmV0dXJuIHZhbHVlO1xuICAgICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZSgwLCB0aW1lem9uZSk7XG4gICAgICAgIGNvbnN0IHN1bnJpc2VEYXRlID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKHN1bnJpc2VVbml4LCB0aW1lem9uZSk7XG4gICAgICAgIGNvbnN0IHN1bnNldERhdGUgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoc3Vuc2V0VW5peCwgdGltZXpvbmUpO1xuICAgICAgICByZXR1cm4gY3VycmVudERhdGUgPiBzdW5yaXNlRGF0ZSAmJiBjdXJyZW50RGF0ZSA8IHN1bnNldERhdGUgPyBgJHt2YWx1ZX1EYXlgIDogYCR7dmFsdWV9TmlnaHRgO1xuICAgIH1cblxuICAgIGdldEJhY2tncm91bmRWaWRlbyh3ZWF0aGVyQ29uZGl0aW9uKSB7XG4gICAgICAgIGNvbnN0IHZpZGVvTGlua3MgPSB7XG4gICAgICAgICAgICBDbGVhckRheTogXCJodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvNDIwMjIxMTQ1LmhkLm1wND9zPTM5NTliY2JmNDgyOWE5NWNlNGIyOTQwMTkyMDc0ZDc0NjlmZjk4NGImcHJvZmlsZV9pZD0xNzUmb2F1dGgyX3Rva2VuX2lkPTU3NDQ3NzYxXCIsXG4gICAgICAgICAgICBDbGVhck5pZ2h0OiBcImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9leHRlcm5hbC8zMzM1ODQ1OTkuc2QubXA0P3M9ZGYyMWVjYTYxOGY5NzQ5Y2YyZjczNGZlZTdjOTRmYzFhMDlkMGY1NCZhbXA7cHJvZmlsZV9pZD0xNjQmYW1wO29hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MVwiLFxuICAgICAgICAgICAgQ2xvdWRzOiBcImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9leHRlcm5hbC80NDQxOTI5NzguaGQubXA0P3M9MThhYjczNDU2MmQ4YzRlYTBlYzJmZWQ3ZjE2ZjNlZGY2MTU4ZGRjYyZwcm9maWxlX2lkPTE3MiZvYXV0aDJfdG9rZW5faWQ9NTc0NDc3NjFcIixcbiAgICAgICAgICAgIE1pc3Q6IFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzM1MDI0MTA4OC5oZC5tcDQ/cz0zYTI4NzQyNmUwMTQ2ZGFiNmVhNzM4ZjQ2MjljNmYwOTg5YTg5NjAzJnByb2ZpbGVfaWQ9MTcyJm9hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MVwiLFxuICAgICAgICAgICAgUmFpbjogXCJodHRwczovL3BsYXllci52aW1lby5jb20vcHJvZ3Jlc3NpdmVfcmVkaXJlY3QvcGxheWJhY2svNzA4NjI5ODIzL3JlbmRpdGlvbi83MjBwL2ZpbGUubXA0P2xvYz1leHRlcm5hbCZvYXV0aDJfdG9rZW5faWQ9NTc0NDc3NjEmc2lnbmF0dXJlPTk5NTFlNDUxMzM0ZmRmYmNmOWViNmI4YzkzM2ZkMDFkZDEyYTU0YTAzZmRiMzcxZjBkYTg2NGExN2FhZWFmMjlcIixcbiAgICAgICAgICAgIE1pc3Q6IFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzM1MDI0MTA4OC5oZC5tcDQ/cz0zYTI4NzQyNmUwMTQ2ZGFiNmVhNzM4ZjQ2MjljNmYwOTg5YTg5NjAzJnByb2ZpbGVfaWQ9MTcyJm9hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MVwiLFxuICAgICAgICAgICAgVGh1bmRlcnN0b3JtOiBcImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9leHRlcm5hbC80ODAyMjM4OTYuaGQubXA0P3M9ZTRiOTRmMGI1NzAwYmZhNjhjYjZmMDJiNDFmOTRlY2NhOTEyNDJlOSZwcm9maWxlX2lkPTE2OSZvYXV0aDJfdG9rZW5faWQ9NTc0NDc3NjFcIlxuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZpZGVvTGlua3Nbd2VhdGhlckNvbmRpdGlvbl07XG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvcmVjYXN0V2VhdGhlciB7XG4gICAgY29uc3RydWN0b3IoZm9yZWNhc3RXZWF0aGVyRGF0YSwgdW5pdCkge1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gdGhpcy5nZXRUZW1wZXJhdHVyZShmb3JlY2FzdFdlYXRoZXJEYXRhLCB1bml0KTtcbiAgICAgICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uID0gdGhpcy5nZXRXZWF0aGVyQ29uZGl0aW9ucyhmb3JlY2FzdFdlYXRoZXJEYXRhKTtcblxuICAgIH1cblxuICAgIGdldFRlbXBlcmF0dXJlKGZvcmVjYXN0V2VhdGhlckRhdGEsIHVuaXQpIHtcbiAgICAgICAgY29uc3QgdGVtcGVyYXR1cmVzID0gW107XG4gICAgICAgIGZvcmVjYXN0V2VhdGhlckRhdGEubGlzdC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgY29uc3QgdGVtcCA9IE1hdGgucm91bmQoaXRlbS5tYWluLnRlbXApO1xuICAgICAgICAgICAgY29uc3QgdGVtcFdpdGhVbml0ID0gdGhpcy5nZXRUZW1wZXJhdHVyZVVuaXQodGVtcCwgdW5pdCk7XG4gICAgICAgICAgICB0ZW1wZXJhdHVyZXMucHVzaCh0ZW1wV2l0aFVuaXQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRlbXBlcmF0dXJlcztcbiAgICB9XG5cbiAgICBnZXRUZW1wZXJhdHVyZVVuaXQoZGVncmVlLCB1bml0KSB7XG4gICAgICAgIHJldHVybiB1bml0ID09PSBcIm1ldHJpY1wiID8gYCR7ZGVncmVlfeKEg2AgOiBgJHtkZWdyZWV94oSJYDtcbiAgICB9XG5cbiAgICBjb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKHVuaXhUaW1lLCB0aW1lem9uZSkge1xuICAgICAgICBjb25zdCBsb2NhbERhdGUgPSBuZXcgRGF0ZSh1bml4VGltZSAqIDEwMDApO1xuICAgICAgICBjb25zdCB1dGNVbml4VGltZVpvbmUgPSBsb2NhbERhdGUuZ2V0VGltZSgpICsgbG9jYWxEYXRlLmdldFRpbWV6b25lT2Zmc2V0KCkgKiA2MDAwMDtcbiAgICAgICAgY29uc3QgdW5peFRpbWVJblNlYXJjaGVkQ2l0eSA9IHV0Y1VuaXhUaW1lWm9uZSArIHRpbWV6b25lICogMTAwMDtcbiAgICAgICAgY29uc3QgZGF0ZUluc2VhcmNoZWRDaXR5ID0gbmV3IERhdGUodW5peFRpbWVJblNlYXJjaGVkQ2l0eSk7XG4gICAgICAgIHJldHVybiBkYXRlSW5zZWFyY2hlZENpdHk7XG4gICAgfVxuICAgIGdldFdlYXRoZXJDb25kaXRpb25JbWcodmFsdWUsIHRpbWUsIHN1bnJpc2VVbml4LCBzdW5zZXRVbml4LCB0aW1lem9uZSkge1xuICAgICAgICBpZiAodmFsdWUgIT09IFwiQ2xlYXJcIikgcmV0dXJuIHZhbHVlO1xuICAgICAgICBjb25zdCBjdXJyZW50SG91ciA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZSh0aW1lLCB0aW1lem9uZSkuZ2V0SG91cnMoKTtcbiAgICAgICAgY29uc3Qgc3VucmlzZUhvdXIgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoc3VucmlzZVVuaXgsIHRpbWV6b25lKS5nZXRIb3VycygpO1xuICAgICAgICBjb25zdCBzdW5zZXRIb3VyID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKHN1bnNldFVuaXgsIHRpbWV6b25lKS5nZXRIb3VycygpO1xuICAgICAgICByZXR1cm4gY3VycmVudEhvdXIgPiBzdW5yaXNlSG91ciAmJiBjdXJyZW50SG91ciA8IHN1bnNldEhvdXIgPyBgJHt2YWx1ZX1EYXlgIDogYCR7dmFsdWV9TmlnaHRgO1xuICAgIH1cblxuICAgIGdldFdlYXRoZXJDb25kaXRpb25zKGZvcmVjYXN0V2VhdGhlckRhdGEpIHtcbiAgICAgICAgY29uc3Qgd2VhdGhlckNvbmRpdGlvbiA9IFtdO1xuICAgICAgICBjb25zdCBzdW5yaXNlVW5peCA9IGZvcmVjYXN0V2VhdGhlckRhdGEuY2l0eS5zdW5yaXNlO1xuICAgICAgICBjb25zdCBzdW5zZXRVbml4ID0gZm9yZWNhc3RXZWF0aGVyRGF0YS5jaXR5LnN1bnNldDtcbiAgICAgICAgY29uc3QgeyB0aW1lem9uZSB9ID0gZm9yZWNhc3RXZWF0aGVyRGF0YS5jaXR5O1xuICAgICAgICBmb3JlY2FzdFdlYXRoZXJEYXRhLmxpc3QuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbmQgPSB0aGlzLmdldFdlYXRoZXJDb25kaXRpb25JbWcoaXRlbS53ZWF0aGVyWzBdLm1haW4sIGl0ZW0uZHQsIHN1bnJpc2VVbml4LCBzdW5zZXRVbml4LCB0aW1lem9uZSk7XG4gICAgICAgICAgICB3ZWF0aGVyQ29uZGl0aW9uLnB1c2goY29uZCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gd2VhdGhlckNvbmRpdGlvbjtcbiAgICB9XG59IiwiaW1wb3J0IEFQSXMgZnJvbSBcIi4vQVBJc1wiO1xuaW1wb3J0IENpdHlJbmZvIGZyb20gXCIuL2NpdHlJbmZvXCI7XG5pbXBvcnQgQ3VycmVudFdlYXRoZXIgZnJvbSBcIi4vY3VycmVudFdlYXRoZXJcIjtcbmltcG9ydCBGb3JlY2FzdFdlYXRoZXIgZnJvbSBcIi4vZm9yZWNhc3RXZWF0aGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1haW5Nb2RlbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IHt9O1xuICAgICAgICB0aGlzLkFQSXMgPSBuZXcgQVBJcygpO1xuICAgIH1cbiAgICBhc3luYyBnZXRDaXR5SW5mbyhjaXR5LCB1bml0KSB7XG4gICAgICAgIGNvbnN0IEFwaURhdGEgPSBhd2FpdCB0aGlzLkFQSXMuZ2V0Q3VycmVudFdlYXRoZXJEYXRhKGNpdHksIHVuaXQpO1xuICAgICAgICBjb25zdCBjaXR5SW5mbyA9IG5ldyBDaXR5SW5mbyhBcGlEYXRhKTtcbiAgICAgICAgcmV0dXJuIGNpdHlJbmZvO1xuICAgIH1cblxuICAgIGFzeW5jIGdldEN1cnJlbnRXZWF0aGVyKGNpdHksIHVuaXQpIHtcbiAgICAgICAgY29uc3QgY3VycmVudFdlYXRoZXJEYXRhID0gYXdhaXQgdGhpcy5BUElzLmdldEN1cnJlbnRXZWF0aGVyRGF0YShjaXR5LCB1bml0KTtcbiAgICAgICAgY29uc3QgY3VycmVudFdlYXRoZXIgPSBuZXcgQ3VycmVudFdlYXRoZXIoY3VycmVudFdlYXRoZXJEYXRhLCB1bml0KTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRXZWF0aGVyO1xuICAgIH1cblxuICAgIGFzeW5jIGdldEZvcmVjYXN0V2VhdGhlcihjaXR5LCB1bml0KSB7XG4gICAgICAgIGNvbnN0IGZvcmVjYXN0V2VhdGhlckRhdGEgPSBhd2FpdCB0aGlzLkFQSXMuZ2V0Rm9yZWNhc3RXZWF0aGVyRGF0YShjaXR5LCB1bml0KTtcbiAgICAgICAgY29uc3QgZm9yZWNhc3RXZWF0aGVyID0gbmV3IEZvcmVjYXN0V2VhdGhlcihmb3JlY2FzdFdlYXRoZXJEYXRhLCB1bml0KTtcbiAgICAgICAgcmV0dXJuIGZvcmVjYXN0V2VhdGhlcjtcbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2l0eUluZm9WaWV3IHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBjaXR5SW5mb01vZGVsKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMubW9kZWwgPSBjaXR5SW5mb01vZGVsO1xuICAgICAgICB0aGlzLmNpdHkgPSBjaXR5SW5mb01vZGVsLmNpdHlEZXNjcmlwdGlvbjtcbiAgICAgICAgdGhpcy5kYXRlID0gY2l0eUluZm9Nb2RlbC5kYXRlRGVzY3JpcHRpb247XG4gICAgfVxuXG4gICAgZ2V0IGNpdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignaDEnKTtcbiAgICB9XG4gICAgc2V0IGNpdHkodmFsdWUpIHtcbiAgICAgICAgdGhpcy5jaXR5LnRleHRDb250ZW50ID0gdmFsdWU7XG4gICAgfVxuICAgIGdldCBkYXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2gyJyk7XG4gICAgfVxuICAgIHNldCBkYXRlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZGF0ZS50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDdXJyZW50V2VhdGhlclZpZXcge1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGN1cnJlbnRXZWF0aGVyTW9kZWwpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy5tb2RlbCA9IGN1cnJlbnRXZWF0aGVyTW9kZWw7XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUgPSBjdXJyZW50V2VhdGhlck1vZGVsLnRlbXBlcmF0dXJlO1xuICAgICAgICB0aGlzLmZlZWxzTGlrZVRlbXAgPSBjdXJyZW50V2VhdGhlck1vZGVsLmZlZWxzTGlrZVRlbXA7XG4gICAgICAgIHRoaXMuaHVtaWRpdHkgPSBjdXJyZW50V2VhdGhlck1vZGVsLmh1bWlkaXR5O1xuICAgICAgICB0aGlzLndpbmRTcGVlZCA9IGN1cnJlbnRXZWF0aGVyTW9kZWwud2luZFNwZWVkO1xuICAgICAgICB0aGlzLnByZXNzdXJlID0gY3VycmVudFdlYXRoZXJNb2RlbC5wcmVzc3VyZTtcbiAgICAgICAgdGhpcy5zdW5yaXNlID0gY3VycmVudFdlYXRoZXJNb2RlbC5zdW5yaXNlO1xuICAgICAgICB0aGlzLnN1bnNldCA9IGN1cnJlbnRXZWF0aGVyTW9kZWwuc3Vuc2V0O1xuICAgICAgICB0aGlzLndlYXRoZXJDb25kaXRpb25EZXNjID0gY3VycmVudFdlYXRoZXJNb2RlbC53ZWF0aGVyQ29uZGl0aW9uRGVzYztcbiAgICAgICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uSW1nID0gY3VycmVudFdlYXRoZXJNb2RlbC53ZWF0aGVyQ29uZGl0aW9uSW1nO1xuICAgICAgICB0aGlzLmJhY2tncm91bmRWaWRlbyA9IGN1cnJlbnRXZWF0aGVyTW9kZWwuYmFja2dyb3VuZFZpZGVvO1xuXG4gICAgfVxuICAgIHdlYXRoZXJDb2xvcih2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT0gXCJSYWluXCIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnY29sb3ItYmxhY2snKTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PSBcIk1pc3RcIikge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdjb2xvci1ibGFjaycpO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09IFwiQ2xlYXJEYXlcIiB8fCB2YWx1ZSA9PSBcIk5pZ2h0XCIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnY29sb3ItYmxhY2snKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCB0ZW1wZXJhdHVyZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdoMScpO1xuICAgIH1cblxuICAgIHNldCB0ZW1wZXJhdHVyZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlLnRleHRDb250ZW50ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IGZlZWxzTGlrZVRlbXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmZlZWxzLWxpa2UnKTtcbiAgICB9XG5cbiAgICBzZXQgZmVlbHNMaWtlVGVtcCh2YWx1ZSkge1xuICAgICAgICB0aGlzLmZlZWxzTGlrZVRlbXAudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgaHVtaWRpdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmh1bWlkaXR5Jyk7XG4gICAgfVxuXG4gICAgc2V0IGh1bWlkaXR5KHZhbHVlKSB7XG4gICAgICAgIHRoaXMuaHVtaWRpdHkudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgd2luZFNwZWVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW5kLXNwZWVkJyk7XG4gICAgfVxuXG4gICAgc2V0IHdpbmRTcGVlZCh2YWx1ZSkge1xuICAgICAgICB0aGlzLndpbmRTcGVlZC50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBwcmVzc3VyZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucHJlc3N1cmUnKTtcbiAgICB9XG5cbiAgICBzZXQgcHJlc3N1cmUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5wcmVzc3VyZS50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBzdW5yaXNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdW5yaXNlJylcbiAgICB9XG4gICAgc2V0IHN1bnJpc2UodmFsdWUpIHtcbiAgICAgICAgdGhpcy5zdW5yaXNlLnRleHRDb250ZW50ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IHN1bnNldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc3Vuc2V0JylcbiAgICB9XG4gICAgc2V0IHN1bnNldCh2YWx1ZSkge1xuICAgICAgICB0aGlzLnN1bnNldC50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCB3ZWF0aGVyQ29uZGl0aW9uRGVzYygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdoMicpO1xuICAgIH1cbiAgICBzZXQgd2VhdGhlckNvbmRpdGlvbkRlc2ModmFsdWUpIHtcbiAgICAgICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uRGVzYy50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCB3ZWF0aGVyQ29uZGl0aW9uSW1nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2ltZycpO1xuICAgIH1cblxuICAgIHNldCB3ZWF0aGVyQ29uZGl0aW9uSW1nKHZhbHVlKSB7XG4gICAgICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbkltZy5zcmMgPSBgLi9pbWFnZXMvJHt2YWx1ZX0ucG5nYDtcbiAgICAgICAgdGhpcy53ZWF0aGVyQ29sb3IodmFsdWUpO1xuXG4gICAgfVxuXG4gICAgZ2V0IGJhY2tncm91bmRWaWRlbygpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWRlbycpO1xuICAgIH1cbiAgICBzZXQgYmFja2dyb3VuZFZpZGVvKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZFZpZGVvLnNyYyA9IHZhbHVlO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBGb3JlY2FzdFdlYXRoZXJWaWV3IHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBmb3JlY2FzdFdlYXRoZXJNb2RlbCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLm1vZGVsID0gZm9yZWNhc3RXZWF0aGVyTW9kZWw7XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmVzID0gZm9yZWNhc3RXZWF0aGVyTW9kZWwudGVtcGVyYXR1cmU7XG4gICAgICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbnMgPSBmb3JlY2FzdFdlYXRoZXJNb2RlbC53ZWF0aGVyQ29uZGl0aW9uO1xuXG4gICAgfVxuXG4gICAgZ2V0IHRlbXBlcmF0dXJlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZm9yZWNhc3RfX2l0ZW1fX3RlbXBlcmF0dXJlJyk7XG4gICAgfVxuXG4gICAgc2V0IHRlbXBlcmF0dXJlcyh2YWx1ZSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy50ZW1wZXJhdHVyZXNbaV0udGV4dENvbnRlbnQgPSB2YWx1ZVtpXTtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHdlYXRoZXJDb25kaXRpb25zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZycpO1xuICAgIH1cbiAgICBzZXQgd2VhdGhlckNvbmRpdGlvbnModmFsdWUpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLndlYXRoZXJDb25kaXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLndlYXRoZXJDb25kaXRpb25zW2ldLnNyYyA9IGAuL2ltYWdlcy8ke3ZhbHVlW2ktMV19LnBuZ2A7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQgQ2l0eUluZm9WaWV3IGZyb20gXCIuL2NpdHlJbmZvVmlld1wiO1xuaW1wb3J0IEN1cnJlbnRXZWF0aGVyVmlldyBmcm9tIFwiLi9jdXJyZW50V2VhdGhlclZpZXdcIjtcbmltcG9ydCBGb3JlY2FzdFdlYXRoZXJWaWV3IGZyb20gXCIuL2ZvcmVjYXN0V2VhdGhlclZpZXdcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFpblZpZXcge1xuICAgIGFwcGVuZENpdHlJbmZvKGNpdHlJbmZvKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0eS1pbmZvJyk7XG4gICAgICAgIG5ldyBDaXR5SW5mb1ZpZXcoZWxlbWVudCwgY2l0eUluZm8pO1xuICAgIH1cblxuICAgIGFwcGVuZEN1cnJyZW50V2VhdGhlcihjdXJyZW50V2VhdGhlcikge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdXJyZW50LXdlYXRoZXJcIik7XG4gICAgICAgIG5ldyBDdXJyZW50V2VhdGhlclZpZXcoZWxlbWVudCwgY3VycmVudFdlYXRoZXIpO1xuICAgIH1cblxuICAgIGFwcGVuZEZvcmVjYXN0V2VhdGhlcihmb3JlY2FzdFdlYXRoZXIpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JlY2FzdCcpO1xuICAgICAgICBuZXcgRm9yZWNhc3RXZWF0aGVyVmlldyhlbGVtZW50LCBmb3JlY2FzdFdlYXRoZXIpO1xuICAgIH1cblxufSIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAvKiEgbm9ybWFsaXplLmNzcyB2OC4wLjEgfCBNSVQgTGljZW5zZSB8IGdpdGh1Yi5jb20vbmVjb2xhcy9ub3JtYWxpemUuY3NzICovXG5cblxuLyogRG9jdW1lbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBQcmV2ZW50IGFkanVzdG1lbnRzIG9mIGZvbnQgc2l6ZSBhZnRlciBvcmllbnRhdGlvbiBjaGFuZ2VzIGluIGlPUy5cbiAqL1xuXG5odG1sIHtcbiAgICBsaW5lLWhlaWdodDogMS4xNTtcbiAgICAvKiAxICovXG4gICAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlO1xuICAgIC8qIDIgKi9cbn1cblxuXG4vKiBTZWN0aW9uc1xuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbi8qKlxuICAgKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXG4gICAqL1xuXG5ib2R5IHtcbiAgICBtYXJnaW46IDA7XG59XG5cblxuLyoqXG4gICAqIFJlbmRlciB0aGUgXFxgbWFpblxcYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cbiAgICovXG5cbm1haW4ge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xufVxuXG5cbi8qKlxuICAgKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBcXGBoMVxcYCBlbGVtZW50cyB3aXRoaW4gXFxgc2VjdGlvblxcYCBhbmRcbiAgICogXFxgYXJ0aWNsZVxcYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXG4gICAqL1xuXG5oMSB7XG4gICAgZm9udC1zaXplOiAyZW07XG4gICAgbWFyZ2luOiAwLjY3ZW0gMDtcbn1cblxuXG4vKiBHcm91cGluZyBjb250ZW50XG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuLyoqXG4gICAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXG4gICAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxuICAgKi9cblxuaHIge1xuICAgIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xuICAgIC8qIDEgKi9cbiAgICBoZWlnaHQ6IDA7XG4gICAgLyogMSAqL1xuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xuICAgIC8qIDIgKi9cbn1cblxuXG4vKipcbiAgICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAgICogMi4gQ29ycmVjdCB0aGUgb2RkIFxcYGVtXFxgIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAgICovXG5cbnByZSB7XG4gICAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlO1xuICAgIC8qIDEgKi9cbiAgICBmb250LXNpemU6IDFlbTtcbiAgICAvKiAyICovXG59XG5cblxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4vKipcbiAgICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxuICAgKi9cblxuYSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG59XG5cblxuLyoqXG4gICAqIDEuIFJlbW92ZSB0aGUgYm90dG9tIGJvcmRlciBpbiBDaHJvbWUgNTctXG4gICAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXG4gICAqL1xuXG5hYmJyW3RpdGxlXSB7XG4gICAgYm9yZGVyLWJvdHRvbTogbm9uZTtcbiAgICAvKiAxICovXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgLyogMiAqL1xuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDtcbiAgICAvKiAyICovXG59XG5cblxuLyoqXG4gICAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXG4gICAqL1xuXG5iLFxuc3Ryb25nIHtcbiAgICBmb250LXdlaWdodDogYm9sZGVyO1xufVxuXG5cbi8qKlxuICAgKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICAgKiAyLiBDb3JyZWN0IHRoZSBvZGQgXFxgZW1cXGAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxuICAgKi9cblxuY29kZSxcbmtiZCxcbnNhbXAge1xuICAgIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTtcbiAgICAvKiAxICovXG4gICAgZm9udC1zaXplOiAxZW07XG4gICAgLyogMiAqL1xufVxuXG5cbi8qKlxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAgICovXG5cbnNtYWxsIHtcbiAgICBmb250LXNpemU6IDgwJTtcbn1cblxuXG4vKipcbiAgICogUHJldmVudCBcXGBzdWJcXGAgYW5kIFxcYHN1cFxcYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cbiAgICogYWxsIGJyb3dzZXJzLlxuICAgKi9cblxuc3ViLFxuc3VwIHtcbiAgICBmb250LXNpemU6IDc1JTtcbiAgICBsaW5lLWhlaWdodDogMDtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuXG5zdWIge1xuICAgIGJvdHRvbTogLTAuMjVlbTtcbn1cblxuc3VwIHtcbiAgICB0b3A6IC0wLjVlbTtcbn1cblxuXG4vKiBFbWJlZGRlZCBjb250ZW50XG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuLyoqXG4gICAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXG4gICAqL1xuXG5pbWcge1xuICAgIGJvcmRlci1zdHlsZTogbm9uZTtcbn1cblxuXG4vKiBGb3Jtc1xuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbi8qKlxuICAgKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cbiAgICogMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxuICAgKi9cblxuYnV0dG9uLFxuaW5wdXQsXG5vcHRncm91cCxcbnNlbGVjdCxcbnRleHRhcmVhIHtcbiAgICBmb250LWZhbWlseTogaW5oZXJpdDtcbiAgICAvKiAxICovXG4gICAgZm9udC1zaXplOiAxMDAlO1xuICAgIC8qIDEgKi9cbiAgICBsaW5lLWhlaWdodDogMS4xNTtcbiAgICAvKiAxICovXG4gICAgbWFyZ2luOiAwO1xuICAgIC8qIDIgKi9cbn1cblxuXG4vKipcbiAgICogU2hvdyB0aGUgb3ZlcmZsb3cgaW4gSUUuXG4gICAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXG4gICAqL1xuXG5idXR0b24sXG5pbnB1dCB7XG4gICAgLyogMSAqL1xuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xufVxuXG5cbi8qKlxuICAgKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cbiAgICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxuICAgKi9cblxuYnV0dG9uLFxuc2VsZWN0IHtcbiAgICAvKiAxICovXG4gICAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XG59XG5cblxuLyoqXG4gICAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gICAqL1xuXG5idXR0b24sXG5bdHlwZT1cImJ1dHRvblwiXSxcblt0eXBlPVwicmVzZXRcIl0sXG5bdHlwZT1cInN1Ym1pdFwiXSB7XG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XG59XG5cblxuLyoqXG4gICAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXG4gICAqL1xuXG5idXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cImJ1dHRvblwiXTo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwicmVzZXRcIl06Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cInN1Ym1pdFwiXTo6LW1vei1mb2N1cy1pbm5lciB7XG4gICAgYm9yZGVyLXN0eWxlOiBub25lO1xuICAgIHBhZGRpbmc6IDA7XG59XG5cblxuLyoqXG4gICAqIFJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cbiAgICovXG5cbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcblt0eXBlPVwiYnV0dG9uXCJdOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJyZXNldFwiXTotbW96LWZvY3VzcmluZyxcblt0eXBlPVwic3VibWl0XCJdOi1tb3otZm9jdXNyaW5nIHtcbiAgICBvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XG59XG5cblxuLyoqXG4gICAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cbiAgICovXG5cbmZpZWxkc2V0IHtcbiAgICBwYWRkaW5nOiAwLjM1ZW0gMC43NWVtIDAuNjI1ZW07XG59XG5cblxuLyoqXG4gICAqIDEuIENvcnJlY3QgdGhlIHRleHQgd3JhcHBpbmcgaW4gRWRnZSBhbmQgSUUuXG4gICAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gXFxgZmllbGRzZXRcXGAgZWxlbWVudHMgaW4gSUUuXG4gICAqIDMuIFJlbW92ZSB0aGUgcGFkZGluZyBzbyBkZXZlbG9wZXJzIGFyZSBub3QgY2F1Z2h0IG91dCB3aGVuIHRoZXkgemVybyBvdXRcbiAgICogICAgXFxgZmllbGRzZXRcXGAgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxuICAgKi9cblxubGVnZW5kIHtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIC8qIDEgKi9cbiAgICBjb2xvcjogaW5oZXJpdDtcbiAgICAvKiAyICovXG4gICAgZGlzcGxheTogdGFibGU7XG4gICAgLyogMSAqL1xuICAgIG1heC13aWR0aDogMTAwJTtcbiAgICAvKiAxICovXG4gICAgcGFkZGluZzogMDtcbiAgICAvKiAzICovXG4gICAgd2hpdGUtc3BhY2U6IG5vcm1hbDtcbiAgICAvKiAxICovXG59XG5cblxuLyoqXG4gICAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXG4gICAqL1xuXG5wcm9ncmVzcyB7XG4gICAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuXG5cbi8qKlxuICAgKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cbiAgICovXG5cbnRleHRhcmVhIHtcbiAgICBvdmVyZmxvdzogYXV0bztcbn1cblxuXG4vKipcbiAgICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gSUUgMTAuXG4gICAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC5cbiAgICovXG5cblt0eXBlPVwiY2hlY2tib3hcIl0sXG5bdHlwZT1cInJhZGlvXCJdIHtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIC8qIDEgKi9cbiAgICBwYWRkaW5nOiAwO1xuICAgIC8qIDIgKi9cbn1cblxuXG4vKipcbiAgICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxuICAgKi9cblxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXG5bdHlwZT1cIm51bWJlclwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XG4gICAgaGVpZ2h0OiBhdXRvO1xufVxuXG5cbi8qKlxuICAgKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cbiAgICogMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXG4gICAqL1xuXG5bdHlwZT1cInNlYXJjaFwiXSB7XG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7XG4gICAgLyogMSAqL1xuICAgIG91dGxpbmUtb2Zmc2V0OiAtMnB4O1xuICAgIC8qIDIgKi9cbn1cblxuXG4vKipcbiAgICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxuICAgKi9cblxuW3R5cGU9XCJzZWFyY2hcIl06Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24ge1xuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbn1cblxuXG4vKipcbiAgICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAgICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBcXGBpbmhlcml0XFxgIGluIFNhZmFyaS5cbiAgICovXG5cbiA6Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcbiAgICAvKiAxICovXG4gICAgZm9udDogaW5oZXJpdDtcbiAgICAvKiAyICovXG59XG5cblxuLyogSW50ZXJhY3RpdmVcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4vKlxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxuICAgKi9cblxuZGV0YWlscyB7XG4gICAgZGlzcGxheTogYmxvY2s7XG59XG5cblxuLypcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gYWxsIGJyb3dzZXJzLlxuICAgKi9cblxuc3VtbWFyeSB7XG4gICAgZGlzcGxheTogbGlzdC1pdGVtO1xufVxuXG5cbi8qIE1pc2NcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4vKipcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTArLlxuICAgKi9cblxudGVtcGxhdGUge1xuICAgIGRpc3BsYXk6IG5vbmU7XG59XG5cblxuLyoqXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxuICAgKi9cblxuW2hpZGRlbl0ge1xuICAgIGRpc3BsYXk6IG5vbmU7XG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL25vbWFybGl6ZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUEsMkVBQTJFOzs7QUFHM0U7K0VBQytFOzs7QUFHL0U7OztFQUdFOztBQUVGO0lBQ0ksaUJBQWlCO0lBQ2pCLE1BQU07SUFDTiw4QkFBOEI7SUFDOUIsTUFBTTtBQUNWOzs7QUFHQTtpRkFDaUY7OztBQUdqRjs7SUFFSTs7QUFFSjtJQUNJLFNBQVM7QUFDYjs7O0FBR0E7O0lBRUk7O0FBRUo7SUFDSSxjQUFjO0FBQ2xCOzs7QUFHQTs7O0lBR0k7O0FBRUo7SUFDSSxjQUFjO0lBQ2QsZ0JBQWdCO0FBQ3BCOzs7QUFHQTtpRkFDaUY7OztBQUdqRjs7O0lBR0k7O0FBRUo7SUFDSSx1QkFBdUI7SUFDdkIsTUFBTTtJQUNOLFNBQVM7SUFDVCxNQUFNO0lBQ04saUJBQWlCO0lBQ2pCLE1BQU07QUFDVjs7O0FBR0E7OztJQUdJOztBQUVKO0lBQ0ksaUNBQWlDO0lBQ2pDLE1BQU07SUFDTixjQUFjO0lBQ2QsTUFBTTtBQUNWOzs7QUFHQTtpRkFDaUY7OztBQUdqRjs7SUFFSTs7QUFFSjtJQUNJLDZCQUE2QjtBQUNqQzs7O0FBR0E7OztJQUdJOztBQUVKO0lBQ0ksbUJBQW1CO0lBQ25CLE1BQU07SUFDTiwwQkFBMEI7SUFDMUIsTUFBTTtJQUNOLGlDQUFpQztJQUNqQyxNQUFNO0FBQ1Y7OztBQUdBOztJQUVJOztBQUVKOztJQUVJLG1CQUFtQjtBQUN2Qjs7O0FBR0E7OztJQUdJOztBQUVKOzs7SUFHSSxpQ0FBaUM7SUFDakMsTUFBTTtJQUNOLGNBQWM7SUFDZCxNQUFNO0FBQ1Y7OztBQUdBOztJQUVJOztBQUVKO0lBQ0ksY0FBYztBQUNsQjs7O0FBR0E7OztJQUdJOztBQUVKOztJQUVJLGNBQWM7SUFDZCxjQUFjO0lBQ2Qsa0JBQWtCO0lBQ2xCLHdCQUF3QjtBQUM1Qjs7QUFFQTtJQUNJLGVBQWU7QUFDbkI7O0FBRUE7SUFDSSxXQUFXO0FBQ2Y7OztBQUdBO2lGQUNpRjs7O0FBR2pGOztJQUVJOztBQUVKO0lBQ0ksa0JBQWtCO0FBQ3RCOzs7QUFHQTtpRkFDaUY7OztBQUdqRjs7O0lBR0k7O0FBRUo7Ozs7O0lBS0ksb0JBQW9CO0lBQ3BCLE1BQU07SUFDTixlQUFlO0lBQ2YsTUFBTTtJQUNOLGlCQUFpQjtJQUNqQixNQUFNO0lBQ04sU0FBUztJQUNULE1BQU07QUFDVjs7O0FBR0E7OztJQUdJOztBQUVKOztJQUVJLE1BQU07SUFDTixpQkFBaUI7QUFDckI7OztBQUdBOzs7SUFHSTs7QUFFSjs7SUFFSSxNQUFNO0lBQ04sb0JBQW9CO0FBQ3hCOzs7QUFHQTs7SUFFSTs7QUFFSjs7OztJQUlJLDBCQUEwQjtBQUM5Qjs7O0FBR0E7O0lBRUk7O0FBRUo7Ozs7SUFJSSxrQkFBa0I7SUFDbEIsVUFBVTtBQUNkOzs7QUFHQTs7SUFFSTs7QUFFSjs7OztJQUlJLDhCQUE4QjtBQUNsQzs7O0FBR0E7O0lBRUk7O0FBRUo7SUFDSSw4QkFBOEI7QUFDbEM7OztBQUdBOzs7OztJQUtJOztBQUVKO0lBQ0ksc0JBQXNCO0lBQ3RCLE1BQU07SUFDTixjQUFjO0lBQ2QsTUFBTTtJQUNOLGNBQWM7SUFDZCxNQUFNO0lBQ04sZUFBZTtJQUNmLE1BQU07SUFDTixVQUFVO0lBQ1YsTUFBTTtJQUNOLG1CQUFtQjtJQUNuQixNQUFNO0FBQ1Y7OztBQUdBOztJQUVJOztBQUVKO0lBQ0ksd0JBQXdCO0FBQzVCOzs7QUFHQTs7SUFFSTs7QUFFSjtJQUNJLGNBQWM7QUFDbEI7OztBQUdBOzs7SUFHSTs7QUFFSjs7SUFFSSxzQkFBc0I7SUFDdEIsTUFBTTtJQUNOLFVBQVU7SUFDVixNQUFNO0FBQ1Y7OztBQUdBOztJQUVJOztBQUVKOztJQUVJLFlBQVk7QUFDaEI7OztBQUdBOzs7SUFHSTs7QUFFSjtJQUNJLDZCQUE2QjtJQUM3QixNQUFNO0lBQ04sb0JBQW9CO0lBQ3BCLE1BQU07QUFDVjs7O0FBR0E7O0lBRUk7O0FBRUo7SUFDSSx3QkFBd0I7QUFDNUI7OztBQUdBOzs7SUFHSTs7Q0FFSDtJQUNHLDBCQUEwQjtJQUMxQixNQUFNO0lBQ04sYUFBYTtJQUNiLE1BQU07QUFDVjs7O0FBR0E7aUZBQ2lGOzs7QUFHakY7O0lBRUk7O0FBRUo7SUFDSSxjQUFjO0FBQ2xCOzs7QUFHQTs7SUFFSTs7QUFFSjtJQUNJLGtCQUFrQjtBQUN0Qjs7O0FBR0E7aUZBQ2lGOzs7QUFHakY7O0lBRUk7O0FBRUo7SUFDSSxhQUFhO0FBQ2pCOzs7QUFHQTs7SUFFSTs7QUFFSjtJQUNJLGFBQWE7QUFDakJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLyohIG5vcm1hbGl6ZS5jc3MgdjguMC4xIHwgTUlUIExpY2Vuc2UgfCBnaXRodWIuY29tL25lY29sYXMvbm9ybWFsaXplLmNzcyAqL1xcblxcblxcbi8qIERvY3VtZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXFxuICovXFxuXFxuaHRtbCB7XFxuICAgIGxpbmUtaGVpZ2h0OiAxLjE1O1xcbiAgICAvKiAxICovXFxuICAgIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTtcXG4gICAgLyogMiAqL1xcbn1cXG5cXG5cXG4vKiBTZWN0aW9uc1xcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG5cXG4vKipcXG4gICAqIFJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcblxcbmJvZHkge1xcbiAgICBtYXJnaW46IDA7XFxufVxcblxcblxcbi8qKlxcbiAgICogUmVuZGVyIHRoZSBgbWFpbmAgZWxlbWVudCBjb25zaXN0ZW50bHkgaW4gSUUuXFxuICAgKi9cXG5cXG5tYWluIHtcXG4gICAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcblxcbi8qKlxcbiAgICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gYGgxYCBlbGVtZW50cyB3aXRoaW4gYHNlY3Rpb25gIGFuZFxcbiAgICogYGFydGljbGVgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cXG4gICAqL1xcblxcbmgxIHtcXG4gICAgZm9udC1zaXplOiAyZW07XFxuICAgIG1hcmdpbjogMC42N2VtIDA7XFxufVxcblxcblxcbi8qIEdyb3VwaW5nIGNvbnRlbnRcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuXFxuLyoqXFxuICAgKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxcbiAgICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXFxuICAgKi9cXG5cXG5ociB7XFxuICAgIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xcbiAgICAvKiAxICovXFxuICAgIGhlaWdodDogMDtcXG4gICAgLyogMSAqL1xcbiAgICBvdmVyZmxvdzogdmlzaWJsZTtcXG4gICAgLyogMiAqL1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG5cXG5wcmUge1xcbiAgICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7XFxuICAgIC8qIDEgKi9cXG4gICAgZm9udC1zaXplOiAxZW07XFxuICAgIC8qIDIgKi9cXG59XFxuXFxuXFxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuXFxuLyoqXFxuICAgKiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBvbiBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXFxuICAgKi9cXG5cXG5hIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxufVxcblxcblxcbi8qKlxcbiAgICogMS4gUmVtb3ZlIHRoZSBib3R0b20gYm9yZGVyIGluIENocm9tZSA1Ny1cXG4gICAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXFxuICAgKi9cXG5cXG5hYmJyW3RpdGxlXSB7XFxuICAgIGJvcmRlci1ib3R0b206IG5vbmU7XFxuICAgIC8qIDEgKi9cXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XFxuICAgIC8qIDIgKi9cXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkO1xcbiAgICAvKiAyICovXFxufVxcblxcblxcbi8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cXG4gICAqL1xcblxcbmIsXFxuc3Ryb25nIHtcXG4gICAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcXG59XFxuXFxuXFxuLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuXFxuY29kZSxcXG5rYmQsXFxuc2FtcCB7XFxuICAgIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTtcXG4gICAgLyogMSAqL1xcbiAgICBmb250LXNpemU6IDFlbTtcXG4gICAgLyogMiAqL1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuXFxuc21hbGwge1xcbiAgICBmb250LXNpemU6IDgwJTtcXG59XFxuXFxuXFxuLyoqXFxuICAgKiBQcmV2ZW50IGBzdWJgIGFuZCBgc3VwYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cXG4gICAqIGFsbCBicm93c2Vycy5cXG4gICAqL1xcblxcbnN1YixcXG5zdXAge1xcbiAgICBmb250LXNpemU6IDc1JTtcXG4gICAgbGluZS1oZWlnaHQ6IDA7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG5cXG5zdWIge1xcbiAgICBib3R0b206IC0wLjI1ZW07XFxufVxcblxcbnN1cCB7XFxuICAgIHRvcDogLTAuNWVtO1xcbn1cXG5cXG5cXG4vKiBFbWJlZGRlZCBjb250ZW50XFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcblxcbi8qKlxcbiAgICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC5cXG4gICAqL1xcblxcbmltZyB7XFxuICAgIGJvcmRlci1zdHlsZTogbm9uZTtcXG59XFxuXFxuXFxuLyogRm9ybXNcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuXFxuLyoqXFxuICAgKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cXG4gICAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cXG4gICAqL1xcblxcbmJ1dHRvbixcXG5pbnB1dCxcXG5vcHRncm91cCxcXG5zZWxlY3QsXFxudGV4dGFyZWEge1xcbiAgICBmb250LWZhbWlseTogaW5oZXJpdDtcXG4gICAgLyogMSAqL1xcbiAgICBmb250LXNpemU6IDEwMCU7XFxuICAgIC8qIDEgKi9cXG4gICAgbGluZS1oZWlnaHQ6IDEuMTU7XFxuICAgIC8qIDEgKi9cXG4gICAgbWFyZ2luOiAwO1xcbiAgICAvKiAyICovXFxufVxcblxcblxcbi8qKlxcbiAgICogU2hvdyB0aGUgb3ZlcmZsb3cgaW4gSUUuXFxuICAgKiAxLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlLlxcbiAgICovXFxuXFxuYnV0dG9uLFxcbmlucHV0IHtcXG4gICAgLyogMSAqL1xcbiAgICBvdmVyZmxvdzogdmlzaWJsZTtcXG59XFxuXFxuXFxuLyoqXFxuICAgKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cXG4gICAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cXG4gICAqL1xcblxcbmJ1dHRvbixcXG5zZWxlY3Qge1xcbiAgICAvKiAxICovXFxuICAgIHRleHQtdHJhbnNmb3JtOiBub25lO1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICAgKi9cXG5cXG5idXR0b24sXFxuW3R5cGU9XFxcImJ1dHRvblxcXCJdLFxcblt0eXBlPVxcXCJyZXNldFxcXCJdLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXSB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXFxuICAgKi9cXG5cXG5idXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcImJ1dHRvblxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJyZXNldFxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lciB7XFxuICAgIGJvcmRlci1zdHlsZTogbm9uZTtcXG4gICAgcGFkZGluZzogMDtcXG59XFxuXFxuXFxuLyoqXFxuICAgKiBSZXN0b3JlIHRoZSBmb2N1cyBzdHlsZXMgdW5zZXQgYnkgdGhlIHByZXZpb3VzIHJ1bGUuXFxuICAgKi9cXG5cXG5idXR0b246LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcImJ1dHRvblxcXCJdOi1tb3otZm9jdXNyaW5nLFxcblt0eXBlPVxcXCJyZXNldFxcXCJdOi1tb3otZm9jdXNyaW5nLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXTotbW96LWZvY3VzcmluZyB7XFxuICAgIG91dGxpbmU6IDFweCBkb3R0ZWQgQnV0dG9uVGV4dDtcXG59XFxuXFxuXFxuLyoqXFxuICAgKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXFxuICAgKi9cXG5cXG5maWVsZHNldCB7XFxuICAgIHBhZGRpbmc6IDAuMzVlbSAwLjc1ZW0gMC42MjVlbTtcXG59XFxuXFxuXFxuLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxcbiAgICogMi4gQ29ycmVjdCB0aGUgY29sb3IgaW5oZXJpdGFuY2UgZnJvbSBgZmllbGRzZXRgIGVsZW1lbnRzIGluIElFLlxcbiAgICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxcbiAgICogICAgYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG5cXG5sZWdlbmQge1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgICAvKiAxICovXFxuICAgIGNvbG9yOiBpbmhlcml0O1xcbiAgICAvKiAyICovXFxuICAgIGRpc3BsYXk6IHRhYmxlO1xcbiAgICAvKiAxICovXFxuICAgIG1heC13aWR0aDogMTAwJTtcXG4gICAgLyogMSAqL1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgICAvKiAzICovXFxuICAgIHdoaXRlLXNwYWNlOiBub3JtYWw7XFxuICAgIC8qIDEgKi9cXG59XFxuXFxuXFxuLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgdmVydGljYWwgYWxpZ25tZW50IGluIENocm9tZSwgRmlyZWZveCwgYW5kIE9wZXJhLlxcbiAgICovXFxuXFxucHJvZ3Jlc3Mge1xcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcblxcblxcbi8qKlxcbiAgICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXFxuICAgKi9cXG5cXG50ZXh0YXJlYSB7XFxuICAgIG92ZXJmbG93OiBhdXRvO1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxcbiAgICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxcbiAgICovXFxuXFxuW3R5cGU9XFxcImNoZWNrYm94XFxcIl0sXFxuW3R5cGU9XFxcInJhZGlvXFxcIl0ge1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgICAvKiAxICovXFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIC8qIDIgKi9cXG59XFxuXFxuXFxuLyoqXFxuICAgKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXFxuICAgKi9cXG5cXG5bdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXFxuW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXG4gICAgaGVpZ2h0OiBhdXRvO1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxcbiAgICogMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXFxuICAgKi9cXG5cXG5bdHlwZT1cXFwic2VhcmNoXFxcIl0ge1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IHRleHRmaWVsZDtcXG4gICAgLyogMSAqL1xcbiAgICBvdXRsaW5lLW9mZnNldDogLTJweDtcXG4gICAgLyogMiAqL1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIFJlbW92ZSB0aGUgaW5uZXIgcGFkZGluZyBpbiBDaHJvbWUgYW5kIFNhZmFyaSBvbiBtYWNPUy5cXG4gICAqL1xcblxcblt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG59XFxuXFxuXFxuLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiAgICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBgaW5oZXJpdGAgaW4gU2FmYXJpLlxcbiAgICovXFxuXFxuIDo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcXG4gICAgLyogMSAqL1xcbiAgICBmb250OiBpbmhlcml0O1xcbiAgICAvKiAyICovXFxufVxcblxcblxcbi8qIEludGVyYWN0aXZlXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcblxcbi8qXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxcbiAgICovXFxuXFxuZGV0YWlscyB7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG5cXG4vKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuXFxuc3VtbWFyeSB7XFxuICAgIGRpc3BsYXk6IGxpc3QtaXRlbTtcXG59XFxuXFxuXFxuLyogTWlzY1xcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG5cXG4vKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cXG4gICAqL1xcblxcbnRlbXBsYXRlIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuXFxuLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMC5cXG4gICAqL1xcblxcbltoaWRkZW5dIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVRfUlVMRV9JTVBPUlRfMF9fXyBmcm9tIFwiLSEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL25vbWFybGl6ZS5jc3NcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18gPSBuZXcgVVJMKFwiLi4vaW1hZ2VzL21hZ25pZnkucG5nXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5pKF9fX0NTU19MT0FERVJfQVRfUlVMRV9JTVBPUlRfMF9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGA6cm9vdCB7XG4gICAgLS1jbHItbmV1dHJhbDogaHNsKDAsIDAlLCAxMDAlKTtcbiAgICAtLWNsci1uZXV0cmFsLXRyYW5zcDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE3MSk7XG4gICAgLS1mZi1wcmltYXJ5OiAnRnJlZWhhbmQnLCBjdXJzaXZlO1xuICAgIC8qIGZvbnQgd2VpZ2h0Ki9cbiAgICAtLWZ3LTMwMDogMzAwO1xuICAgIC0tZnctNDAwOiA0MDA7XG4gICAgLS1mdy01MDA6IDUwMDtcbiAgICAtLWZ3LTYwMDogNjAwO1xuICAgIC0tZnctNzAwOiA3MDA7XG59XG5cbioge1xuICAgIG1hcmdpbjogMDtcbiAgICBwYWRkaW5nOiAwO1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbmJvZHkge1xuICAgIHdpZHRoOiAxMDB2dztcbiAgICBtaW4taGVpZ2h0OiAxMDB2aDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTQyLCAyMjcsIDIzMyk7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWZmLXByaW1hcnkpO1xuICAgIGNvbG9yOiAjZmZmZmZmO1xuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1mZi1wcmltYXJ5KTtcbiAgICBmb250LXNpemU6IDEuMjVyZW07XG59XG5cbm1haW4ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgaGVpZ2h0OiAxMDB2aDtcbiAgICB3aWR0aDogMTAwdnc7XG4gICAgcGFkZGluZzogNHJlbSAycmVtO1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG59XG5cbi52aWRlby1jb250YWluZXIge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgbGVmdDogMDtcbiAgICB3aWR0aDogMTAwdnc7XG4gICAgaGVpZ2h0OiAxMDB2aDtcbiAgICB6LWluZGV4OiAtNTtcbn1cblxudmlkZW8ge1xuICAgIHdpZHRoOiAxMDB2dztcbiAgICBoZWlnaHQ6IDEwMHZoO1xuICAgIG9iamVjdC1maXQ6IGNvdmVyO1xufVxuXG4udW5pdEMsXG4udW5pdEYge1xuICAgIGZvbnQtc2l6ZTogMC44NXJlbTtcbiAgICBoZWlnaHQ6IDE2cHg7XG4gICAgd2lkdGg6IDE2cHg7XG4gICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBjb2xvcjogaHNsKDAsIDAlLCAwJSk7XG4gICAgei1pbmRleDogMjA7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgdGV4dC1zaGFkb3c6IG5vbmU7XG59XG5cbi51bml0RiB7XG4gICAgY29sb3I6IGhzbCgwLCAwJSwgMTAwJSk7XG59XG5cbi5jaGVja2JveCB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogM3JlbTtcbiAgICBsZWZ0OiAzcmVtO1xufVxuXG4uY2hlY2tib3gge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBvcGFjaXR5OiAwO1xufVxuXG4ubGFiZWwge1xuICAgIGJvcmRlci1yYWRpdXM6IDUwcHg7XG4gICAgd2lkdGg6IDUwMHB4O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgIHBhZGRpbmc6IDVweDtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgcmlnaHQ6IDUwcHg7XG4gICAgZmxvYXQ6IHJpZ2h0O1xuICAgIGhlaWdodDogMjZweDtcbiAgICB3aWR0aDogNTBweDtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEuNSk7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzExMTtcbn1cblxuLmxhYmVsIC5iYWxsIHtcbiAgICBoZWlnaHQ6IDIwcHg7XG4gICAgd2lkdGg6IDIwcHg7XG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDJweDtcbiAgICBsZWZ0OiAycHg7XG4gICAgYmFja2dyb3VuZDogI2Y1ZjRmNDtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTtcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4ycyBsaW5lYXI7XG59XG5cbi5jaGVja2JveDpjaGVja2VkKy5sYWJlbCAuYmFsbCB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDI0cHgpO1xufVxuXG4uc2VhcmNoLXdyYXBwZXIge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDEwcHg7XG59XG5cbi5zZWFyY2gtd3JhcHBlciBpbnB1dCB7XG4gICAgd2lkdGg6IDQwJTtcbiAgICBwYWRkaW5nOiAxMHB4IDEwcHggMTBweCA0MHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDJyZW07XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybCgke19fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX199KTtcbiAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xuICAgIGJhY2tncm91bmQtcG9zaXRpb246IDEwcHggY2VudGVyO1xuICAgIGJhY2tncm91bmQtc2l6ZTogY2FsYygxcmVtICsgMC41dncpO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICAgIHRleHQtc2hhZG93OiBub25lO1xufVxuXG4jZXJyb3Ige1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgZm9udC1zaXplOiAxLjVyZW07XG4gICAgY29sb3I6IGhzbCgwLCAxMDAlLCA1MCUpO1xufVxuXG4uY2l0eS1pbmZvIGgxIHtcbiAgICBtYXJnaW46IDAuM3JlbSAwO1xuICAgIGxldHRlci1zcGFjaW5nOiAwLjFyZW07XG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICBmb250LXdlaWdodDogdmFyKC0tZnctNjAwKTtcbiAgICBmb250LXNpemU6IDIuNXJlbTtcbn1cblxuaDIge1xuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xuICAgIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy0zMDApO1xufVxuXG4uY3VycmVudC13ZWF0aGVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xufVxuXG4uY3VycmVudC13ZWF0aGVyX19jb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG59XG5cbi5jdXJyZW50LXdlYXRoZXJfX2NvbnRhaW5lciBpbWcge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24tc2VsZjogc3RhcnQ7XG4gICAgd2lkdGg6IGNhbGMoN3JlbSArIDEwdncpO1xufVxuXG4uY3VycmVudC13ZWF0aGVyX2NvaW50YWluZXIgaDEge1xuICAgIG1hcmdpbjogMC4zcmVtIDA7XG4gICAgZm9udC1zaXplOiA0cmVtO1xuICAgIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy00MDApO1xufVxuXG4uY3VycmVudC13ZWF0aGVyX190ZW1wIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5jdXJyZW50LXdlYXRoZXJfX2RldGFpbHMge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBhbGlnbi1zZWxmOiBjZW50ZXI7XG4gICAgaGVpZ2h0OiBtYXgtY29udGVudDtcbiAgICBwYWRkaW5nOiAycmVtIDRyZW07XG4gICAgZ2FwOiA0cmVtO1xuICAgIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbC10cmFuc3ApO1xufVxuXG4uY3VycmVudC13ZWF0aGVyX19pdGVtIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiAwLjVyZW07XG4gICAgZm9udC1zaXplOiAxLjVyZW07XG59XG5cbi5jdXJyZW50LXdlYXRoZXJfX2l0ZW0gaW1nIHtcbiAgICB3aWR0aDogY2FsYygxcmVtICsgMXZ3KTtcbn1cblxuLmN1cnJlbnQtd2VhdGhlcl9fZGV0YWlsc19fY29sdW1uIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgZ2FwOiAxcmVtO1xufVxuXG4uZm9yZWNhc3Qge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgcGFkZGluZzogMXJlbSAycmVtO1xuICAgIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbC10cmFuc3ApO1xufVxuXG4uZm9yZWNhc3RfX2l0ZW0ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG4uZm9yZWNhc3RfX2l0ZW0gaW1nIHtcbiAgICB3aWR0aDogY2FsYygycmVtICsgM3Z3KTtcbn1cblxuLmNvbG9yLWJsYWNrIHtcbiAgICBjb2xvcjogIzA3MDcwNztcbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUNBO0lBQ0ksK0JBQStCO0lBQy9CLGdEQUFnRDtJQUNoRCxpQ0FBaUM7SUFDakMsZUFBZTtJQUNmLGFBQWE7SUFDYixhQUFhO0lBQ2IsYUFBYTtJQUNiLGFBQWE7SUFDYixhQUFhO0FBQ2pCOztBQUVBO0lBQ0ksU0FBUztJQUNULFVBQVU7SUFDVixzQkFBc0I7QUFDMUI7O0FBRUE7SUFDSSxZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLG9DQUFvQztJQUNwQyw4QkFBOEI7SUFDOUIsY0FBYztJQUNkLDhC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bXBvcnQgdXJsKC4vbm9tYXJsaXplLmNzcyk7XFxuOnJvb3Qge1xcbiAgICAtLWNsci1uZXV0cmFsOiBoc2woMCwgMCUsIDEwMCUpO1xcbiAgICAtLWNsci1uZXV0cmFsLXRyYW5zcDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE3MSk7XFxuICAgIC0tZmYtcHJpbWFyeTogJ0ZyZWVoYW5kJywgY3Vyc2l2ZTtcXG4gICAgLyogZm9udCB3ZWlnaHQqL1xcbiAgICAtLWZ3LTMwMDogMzAwO1xcbiAgICAtLWZ3LTQwMDogNDAwO1xcbiAgICAtLWZ3LTUwMDogNTAwO1xcbiAgICAtLWZ3LTYwMDogNjAwO1xcbiAgICAtLWZ3LTcwMDogNzAwO1xcbn1cXG5cXG4qIHtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG5ib2R5IHtcXG4gICAgd2lkdGg6IDEwMHZ3O1xcbiAgICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE0MiwgMjI3LCAyMzMpO1xcbiAgICBmb250LWZhbWlseTogdmFyKC0tZmYtcHJpbWFyeSk7XFxuICAgIGNvbG9yOiAjZmZmZmZmO1xcbiAgICBmb250LWZhbWlseTogdmFyKC0tZmYtcHJpbWFyeSk7XFxuICAgIGZvbnQtc2l6ZTogMS4yNXJlbTtcXG59XFxuXFxubWFpbiB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIGhlaWdodDogMTAwdmg7XFxuICAgIHdpZHRoOiAxMDB2dztcXG4gICAgcGFkZGluZzogNHJlbSAycmVtO1xcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG5cXG4udmlkZW8tY29udGFpbmVyIHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICB0b3A6IDA7XFxuICAgIGxlZnQ6IDA7XFxuICAgIHdpZHRoOiAxMDB2dztcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXG4gICAgei1pbmRleDogLTU7XFxufVxcblxcbnZpZGVvIHtcXG4gICAgd2lkdGg6IDEwMHZ3O1xcbiAgICBoZWlnaHQ6IDEwMHZoO1xcbiAgICBvYmplY3QtZml0OiBjb3ZlcjtcXG59XFxuXFxuLnVuaXRDLFxcbi51bml0RiB7XFxuICAgIGZvbnQtc2l6ZTogMC44NXJlbTtcXG4gICAgaGVpZ2h0OiAxNnB4O1xcbiAgICB3aWR0aDogMTZweDtcXG4gICAgYm9yZGVyLXJhZGl1czogOHB4O1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgY29sb3I6IGhzbCgwLCAwJSwgMCUpO1xcbiAgICB6LWluZGV4OiAyMDtcXG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICAgIHRleHQtc2hhZG93OiBub25lO1xcbn1cXG5cXG4udW5pdEYge1xcbiAgICBjb2xvcjogaHNsKDAsIDAlLCAxMDAlKTtcXG59XFxuXFxuLmNoZWNrYm94IHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICB0b3A6IDNyZW07XFxuICAgIGxlZnQ6IDNyZW07XFxufVxcblxcbi5jaGVja2JveCB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgb3BhY2l0eTogMDtcXG59XFxuXFxuLmxhYmVsIHtcXG4gICAgYm9yZGVyLXJhZGl1czogNTBweDtcXG4gICAgd2lkdGg6IDUwMHB4O1xcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gICAgcGFkZGluZzogNXB4O1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIHJpZ2h0OiA1MHB4O1xcbiAgICBmbG9hdDogcmlnaHQ7XFxuICAgIGhlaWdodDogMjZweDtcXG4gICAgd2lkdGg6IDUwcHg7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMS41KTtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzExMTtcXG59XFxuXFxuLmxhYmVsIC5iYWxsIHtcXG4gICAgaGVpZ2h0OiAyMHB4O1xcbiAgICB3aWR0aDogMjBweDtcXG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHRvcDogMnB4O1xcbiAgICBsZWZ0OiAycHg7XFxuICAgIGJhY2tncm91bmQ6ICNmNWY0ZjQ7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwcHgpO1xcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4ycyBsaW5lYXI7XFxufVxcblxcbi5jaGVja2JveDpjaGVja2VkKy5sYWJlbCAuYmFsbCB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgyNHB4KTtcXG59XFxuXFxuLnNlYXJjaC13cmFwcGVyIHtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBnYXA6IDEwcHg7XFxufVxcblxcbi5zZWFyY2gtd3JhcHBlciBpbnB1dCB7XFxuICAgIHdpZHRoOiA0MCU7XFxuICAgIHBhZGRpbmc6IDEwcHggMTBweCAxMHB4IDQwcHg7XFxuICAgIGJvcmRlci1yYWRpdXM6IDJyZW07XFxuICAgIGJvcmRlcjogbm9uZTtcXG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKC4uL2ltYWdlcy9tYWduaWZ5LnBuZyk7XFxuICAgIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICAgIGJhY2tncm91bmQtcG9zaXRpb246IDEwcHggY2VudGVyO1xcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNhbGMoMXJlbSArIDAuNXZ3KTtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICAgIHRleHQtc2hhZG93OiBub25lO1xcbn1cXG5cXG4jZXJyb3Ige1xcbiAgICBkaXNwbGF5OiBub25lO1xcbiAgICBmb250LXNpemU6IDEuNXJlbTtcXG4gICAgY29sb3I6IGhzbCgwLCAxMDAlLCA1MCUpO1xcbn1cXG5cXG4uY2l0eS1pbmZvIGgxIHtcXG4gICAgbWFyZ2luOiAwLjNyZW0gMDtcXG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuMXJlbTtcXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXG4gICAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTYwMCk7XFxuICAgIGZvbnQtc2l6ZTogMi41cmVtO1xcbn1cXG5cXG5oMiB7XFxuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgICBmb250LXdlaWdodDogdmFyKC0tZnctMzAwKTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlciB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19jb250YWluZXIge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19jb250YWluZXIgaW1nIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgYWxpZ24tc2VsZjogc3RhcnQ7XFxuICAgIHdpZHRoOiBjYWxjKDdyZW0gKyAxMHZ3KTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9jb2ludGFpbmVyIGgxIHtcXG4gICAgbWFyZ2luOiAwLjNyZW0gMDtcXG4gICAgZm9udC1zaXplOiA0cmVtO1xcbiAgICBmb250LXdlaWdodDogdmFyKC0tZnctNDAwKTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9fdGVtcCB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19kZXRhaWxzIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgYWxpZ24tc2VsZjogY2VudGVyO1xcbiAgICBoZWlnaHQ6IG1heC1jb250ZW50O1xcbiAgICBwYWRkaW5nOiAycmVtIDRyZW07XFxuICAgIGdhcDogNHJlbTtcXG4gICAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbC10cmFuc3ApO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19pdGVtIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgZ2FwOiAwLjVyZW07XFxuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19pdGVtIGltZyB7XFxuICAgIHdpZHRoOiBjYWxjKDFyZW0gKyAxdncpO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19kZXRhaWxzX19jb2x1bW4ge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBnYXA6IDFyZW07XFxufVxcblxcbi5mb3JlY2FzdCB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgcGFkZGluZzogMXJlbSAycmVtO1xcbiAgICBib3JkZXItcmFkaXVzOiAwLjVyZW07XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNsci1uZXV0cmFsLXRyYW5zcCk7XFxufVxcblxcbi5mb3JlY2FzdF9faXRlbSB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5mb3JlY2FzdF9faXRlbSBpbWcge1xcbiAgICB3aWR0aDogY2FsYygycmVtICsgM3Z3KTtcXG59XFxuXFxuLmNvbG9yLWJsYWNrIHtcXG4gICAgY29sb3I6ICMwNzA3MDc7XFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIGlmICghdXJsKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICB1cmwgPSBTdHJpbmcodXJsLl9fZXNNb2R1bGUgPyB1cmwuZGVmYXVsdCA6IHVybCk7XG5cbiAgLy8gSWYgdXJsIGlzIGFscmVhZHkgd3JhcHBlZCBpbiBxdW90ZXMsIHJlbW92ZSB0aGVtXG4gIGlmICgvXlsnXCJdLipbJ1wiXSQvLnRlc3QodXJsKSkge1xuICAgIHVybCA9IHVybC5zbGljZSgxLCAtMSk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaGFzaCkge1xuICAgIHVybCArPSBvcHRpb25zLmhhc2g7XG4gIH1cblxuICAvLyBTaG91bGQgdXJsIGJlIHdyYXBwZWQ/XG4gIC8vIFNlZSBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXZhbHVlcy0zLyN1cmxzXG4gIGlmICgvW1wiJygpIFxcdFxcbl18KCUyMCkvLnRlc3QodXJsKSB8fCBvcHRpb25zLm5lZWRRdW90ZXMpIHtcbiAgICByZXR1cm4gXCJcXFwiXCIuY29uY2F0KHVybC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIiksIFwiXFxcIlwiKTtcbiAgfVxuICByZXR1cm4gdXJsO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyYztcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSB7XG5cdFx0XHR2YXIgaSA9IHNjcmlwdHMubGVuZ3RoIC0gMTtcblx0XHRcdHdoaWxlIChpID4gLTEgJiYgIXNjcmlwdFVybCkgc2NyaXB0VXJsID0gc2NyaXB0c1tpLS1dLnNyYztcblx0XHR9XG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsIl9fd2VicGFja19yZXF1aXJlX18uYiA9IGRvY3VtZW50LmJhc2VVUkkgfHwgc2VsZi5sb2NhdGlvbi5ocmVmO1xuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG4vLyBubyBvbiBjaHVua3MgbG9hZGVkXG5cbi8vIG5vIGpzb25wIGZ1bmN0aW9uIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgJy4uL3N0eWxlcy9zdHlsZS5jc3MnO1xuaW1wb3J0IE1haW5Nb2RlbCBmcm9tICcuL21vZGVscy9tYWluTW9kZWwnO1xuaW1wb3J0IE1haW5WaWV3IGZyb20gJy4vdmlld3MvbWFpblZpZXcnXG5pbXBvcnQgTWFpbkNvbnRyb2xsZXIgZnJvbSAnLi9jb250cm9sbGVycy9tYWluQ29udHJvbGxlcic7XG5cblxuY29uc3QgbW9kZWwgPSBuZXcgTWFpbk1vZGVsKCk7XG5jb25zdCB2aWV3ID0gbmV3IE1haW5WaWV3KCk7XG5jb25zdCBjb250cm9sbGVyID0gbmV3IE1haW5Db250cm9sbGVyKG1vZGVsLCB2aWV3KTsiXSwibmFtZXMiOlsiTWFpbkNvbnRyb2xsZXIiLCJjb25zdHJ1Y3RvciIsIm1vZGVsIiwidmlldyIsImNpdHkiLCJ1bml0IiwibG9hZHBhZ2UiLCJjaXR5SW5mbyIsImdldENpdHlJbmZvIiwiY3VycmVudFdlYXRoZXIiLCJnZXRDdXJyZW50V2VhdGhlciIsImZvcmVjYXN0V2VhdGhlciIsImdldEZvcmVjYXN0V2VhdGhlciIsImNvbnNvbGUiLCJsb2ciLCJhcHBlbmRDaXR5SW5mbyIsImFwcGVuZEN1cnJyZW50V2VhdGhlciIsImFwcGVuZEZvcmVjYXN0V2VhdGhlciIsIkFQSXMiLCJ1cmxHZW5lcmF0b3IiLCJVcmxHZW5lcmV0b3IiLCJnZXRHZW9Db29yZGluYXRlcyIsInVybCIsImdlbmVyYXRlR2VvQ29vcmRzVXJsIiwicmVzcG9uc2UiLCJmZXRjaCIsIm1vZGUiLCJnZW9Db2RpbmdEYXRhIiwianNvbiIsImxhdCIsImxvbiIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJzdHlsZSIsImRpc3BsYXkiLCJlcnJvciIsImdldEN1cnJlbnRXZWF0aGVyRGF0YSIsImdlbmVyYXRlQ3VycmVudFdlYXRoZXIiLCJ3ZWF0aGVyRGF0YSIsImdldEZvcmVjYXN0V2VhdGhlckRhdGEiLCJnZW5lcmF0ZUZvcmVjYXN0V2VhdGhlciIsImZvcmVjYXN0RGF0YSIsImFwcElkIiwiYmFzZVVybCIsIkNpdHlJbmZvIiwiQXBpRGF0YSIsImNpdHlEZXNjcmlwdGlvbiIsImNyZWF0ZUNpdHlEZXNjcmlwdGlvbiIsImRhdGVEZXNjcmlwdGlvbiIsImNyZWF0ZURhdGVEZXNjcmlwdGlvbiIsIm5hbWUiLCJjb3VudHJ5Iiwic3lzIiwiZGF5IiwiZ2V0RGF5IiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwid2Vla2RheSIsImQiLCJEYXRlIiwibW9udGhOYW1lcyIsIkN1cnJlbnRXZWF0aGVyIiwiY3VycmVudFdlYXRoZXJEYXRhIiwidGVtcGVyYXR1cmUiLCJnZXRUZW1wZXJhdHVyZSIsIk1hdGgiLCJyb3VuZCIsIm1haW4iLCJ0ZW1wIiwiZmVlbHNMaWtlVGVtcCIsImZlZWxzX2xpa2UiLCJodW1pZGl0eSIsIndpbmRTcGVlZCIsIndpbmQiLCJzcGVlZCIsInByZXNzdXJlIiwic3VucmlzZSIsImNvbnZlcnRUb1NlYXJjaGVkQ2l0eVRpbWUiLCJ0aW1lem9uZSIsInN1bnNldCIsIndlYXRoZXJDb25kaXRpb25EZXNjIiwid2VhdGhlciIsImRlc2NyaXB0aW9uIiwid2VhdGhlckNvbmRpdGlvbkltZyIsImdldHdlYXRoZXJDb25kaXRpb25JbWciLCJiYWNrZ3JvdW5kVmlkZW8iLCJnZXRCYWNrZ3JvdW5kVmlkZW8iLCJkZWdyZWVzIiwiY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZSIsInVuaXhUaW1lIiwibG9jYWxEYXRlIiwidXRjVW5peFRpbWUiLCJnZXRUaW1lIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJ1bml4VGltZUluU2VhcmNoZWRDaXR5IiwiZGF0ZUluU2VhcmNoZWRDaXR5IiwiaG91cnMiLCJnZXRIb3VycyIsIm1pbnV0ZXMiLCJnZXRNaW51dGVzIiwiZm9ybWF0dGVkVGltZSIsInZhbHVlIiwic3VucmlzZVVuaXgiLCJzdW5zZXRVbml4IiwibWlzdEVxdWl2YWxlbnRlcyIsImluY2x1ZGVzIiwiY3VycmVudERhdGUiLCJzdW5yaXNlRGF0ZSIsInN1bnNldERhdGUiLCJ3ZWF0aGVyQ29uZGl0aW9uIiwidmlkZW9MaW5rcyIsIkNsZWFyRGF5IiwiQ2xlYXJOaWdodCIsIkNsb3VkcyIsIk1pc3QiLCJSYWluIiwiVGh1bmRlcnN0b3JtIiwiRm9yZWNhc3RXZWF0aGVyIiwiZm9yZWNhc3RXZWF0aGVyRGF0YSIsImdldFdlYXRoZXJDb25kaXRpb25zIiwidGVtcGVyYXR1cmVzIiwibGlzdCIsImZvckVhY2giLCJpdGVtIiwidGVtcFdpdGhVbml0IiwiZ2V0VGVtcGVyYXR1cmVVbml0IiwicHVzaCIsImRlZ3JlZSIsInV0Y1VuaXhUaW1lWm9uZSIsImRhdGVJbnNlYXJjaGVkQ2l0eSIsImdldFdlYXRoZXJDb25kaXRpb25JbWciLCJ0aW1lIiwiY3VycmVudEhvdXIiLCJzdW5yaXNlSG91ciIsInN1bnNldEhvdXIiLCJjb25kIiwiZHQiLCJNYWluTW9kZWwiLCJkYXRhIiwiQ2l0eUluZm9WaWV3IiwiZWxlbWVudCIsImNpdHlJbmZvTW9kZWwiLCJxdWVyeVNlbGVjdG9yIiwidGV4dENvbnRlbnQiLCJDdXJyZW50V2VhdGhlclZpZXciLCJjdXJyZW50V2VhdGhlck1vZGVsIiwid2VhdGhlckNvbG9yIiwiYm9keSIsImNsYXNzTGlzdCIsImFkZCIsInNyYyIsIkZvcmVjYXN0V2VhdGhlclZpZXciLCJmb3JlY2FzdFdlYXRoZXJNb2RlbCIsIndlYXRoZXJDb25kaXRpb25zIiwicXVlcnlTZWxlY3RvckFsbCIsImkiLCJsZW5ndGgiLCJNYWluVmlldyIsImNvbnRyb2xsZXIiXSwic291cmNlUm9vdCI6IiJ9