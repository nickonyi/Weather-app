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
    this.city = "new york";
    this.loadpage(this.city);
  }
  async loadpage(city) {
    this.city = city;
    const cityInfo = await this.model.getCityInfo(city, this.unit);
    const currentWeather = await this.model.getCurrentWeather(city, this.unit);
    const forecastWeather = await this.model.getForecastWeather(city, this.unit);
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
      document.body.classList.add('color-rain');
    } else if (value == "Mist") {
      document.body.classList.add('color-mist');
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
  }
  get temperatures() {
    return this.element.querySelectorAll('.forecast__item__temperature');
  }
  set temperatures(value) {
    for (let i = 0; i < 8; i++) {
      this.temperatures[i].textContent = value[i];
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

.color-rain {
    color: #1c1d1b;
}

.color-mist {
    color: #070707;
}`, "",{"version":3,"sources":["webpack://./src/styles/style.css"],"names":[],"mappings":"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","sourcesContent":["@import url(./nomarlize.css);\n:root {\n    --clr-neutral: hsl(0, 0%, 100%);\n    --clr-neutral-transp: rgba(255, 255, 255, 0.171);\n    --ff-primary: 'Freehand', cursive;\n    /* font weight*/\n    --fw-300: 300;\n    --fw-400: 400;\n    --fw-500: 500;\n    --fw-600: 600;\n    --fw-700: 700;\n}\n\n* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nbody {\n    width: 100vw;\n    min-height: 100vh;\n    background-color: rgb(142, 227, 233);\n    font-family: var(--ff-primary);\n    color: #ffffff;\n    font-family: var(--ff-primary);\n    font-size: 1.25rem;\n}\n\nmain {\n    display: flex;\n    flex-direction: column;\n    justify-content: space-evenly;\n    position: relative;\n    height: 100vh;\n    width: 100vw;\n    padding: 4rem 2rem;\n    overflow: hidden;\n}\n\n.video-container {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100vw;\n    height: 100vh;\n    z-index: -5;\n}\n\nvideo {\n    width: 100vw;\n    height: 100vh;\n    object-fit: cover;\n}\n\n.unitC,\n.unitF {\n    font-size: 0.85rem;\n    height: 16px;\n    width: 16px;\n    border-radius: 8px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    color: hsl(0, 0%, 0%);\n    z-index: 20;\n    pointer-events: none;\n    text-shadow: none;\n}\n\n.unitF {\n    color: hsl(0, 0%, 100%);\n}\n\n.checkbox {\n    position: absolute;\n    top: 3rem;\n    left: 3rem;\n}\n\n.checkbox {\n    position: absolute;\n    opacity: 0;\n}\n\n.label {\n    border-radius: 50px;\n    width: 500px;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 5px;\n    position: relative;\n    right: 50px;\n    float: right;\n    height: 26px;\n    width: 50px;\n    transform: scale(1.5);\n    background-color: #111;\n}\n\n.label .ball {\n    height: 20px;\n    width: 20px;\n    border-radius: 50%;\n    position: absolute;\n    top: 2px;\n    left: 2px;\n    background: #f5f4f4;\n    transform: translateX(0px);\n    transition: transform 0.2s linear;\n}\n\n.checkbox:checked+.label .ball {\n    transform: translateX(24px);\n}\n\n.search-wrapper {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    gap: 10px;\n}\n\n.search-wrapper input {\n    width: 40%;\n    padding: 10px 10px 10px 40px;\n    border-radius: 2rem;\n    border: none;\n    background-image: url(../images/magnify.png);\n    background-repeat: no-repeat;\n    background-position: 10px center;\n    background-size: calc(1rem + 0.5vw);\n    background-color: white;\n    text-shadow: none;\n}\n\n#error {\n    display: none;\n    font-size: 1.5rem;\n    color: hsl(0, 100%, 50%);\n}\n\n.city-info h1 {\n    margin: 0.3rem 0;\n    letter-spacing: 0.1rem;\n    text-transform: uppercase;\n    font-weight: var(--fw-600);\n    font-size: 2.5rem;\n}\n\nh2 {\n    font-size: 1.5rem;\n    font-weight: var(--fw-300);\n}\n\n.current-weather {\n    display: flex;\n    justify-content: space-around;\n}\n\n.current-weather__container {\n    display: flex;\n}\n\n.current-weather__container img {\n    display: flex;\n    align-self: start;\n    width: calc(7rem + 10vw);\n}\n\n.current-weather_cointainer h1 {\n    margin: 0.3rem 0;\n    font-size: 4rem;\n    font-weight: var(--fw-400);\n}\n\n.current-weather__temp {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n}\n\n.current-weather__details {\n    display: flex;\n    align-items: center;\n    align-self: center;\n    height: max-content;\n    padding: 2rem 4rem;\n    gap: 4rem;\n    border-radius: 0.5rem;\n    background-color: var(--clr-neutral-transp);\n}\n\n.current-weather__item {\n    display: flex;\n    align-items: center;\n    gap: 0.5rem;\n    font-size: 1.5rem;\n}\n\n.current-weather__item img {\n    width: calc(1rem + 1vw);\n}\n\n.current-weather__details__column {\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n}\n\n.forecast {\n    display: flex;\n    justify-content: space-around;\n    width: 100%;\n    padding: 1rem 2rem;\n    border-radius: 0.5rem;\n    background-color: var(--clr-neutral-transp);\n}\n\n.forecast__item {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n}\n\n.forecast__item img {\n    width: calc(2rem + 3vw);\n}\n\n.color-rain {\n    color: #1c1d1b;\n}\n\n.color-mist {\n    color: #070707;\n}"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUMsT0FBTyxvR0FBb0csTUFBTSxTQUFTLFFBQVEsTUFBTSxLQUFLLFlBQVksV0FBVyxZQUFZLFdBQVcsT0FBTyxLQUFLLFNBQVMsT0FBTyxNQUFNLEtBQUssVUFBVSxPQUFPLE1BQU0sTUFBTSxLQUFLLFVBQVUsUUFBUSxPQUFPLE1BQU0sS0FBSyxVQUFVLFlBQVksUUFBUSxLQUFLLFNBQVMsUUFBUSxNQUFNLEtBQUssWUFBWSxXQUFXLFVBQVUsVUFBVSxZQUFZLFdBQVcsT0FBTyxPQUFPLE1BQU0sS0FBSyxZQUFZLFdBQVcsVUFBVSxVQUFVLE9BQU8sS0FBSyxTQUFTLE9BQU8sTUFBTSxLQUFLLFlBQVksUUFBUSxPQUFPLE1BQU0sS0FBSyxZQUFZLFdBQVcsWUFBWSxXQUFXLFlBQVksV0FBVyxPQUFPLE1BQU0sTUFBTSxNQUFNLFlBQVksUUFBUSxPQUFPLE1BQU0sT0FBTyxZQUFZLFdBQVcsVUFBVSxVQUFVLE9BQU8s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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLG1DQUFtQztBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDLE9BQU8sdUZBQXVGLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsVUFBVSxVQUFVLFVBQVUsVUFBVSxNQUFNLEtBQUssVUFBVSxVQUFVLFlBQVksT0FBTyxNQUFNLFlBQVksV0FBVyxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLFVBQVUsTUFBTSxLQUFLLFlBQVksV0FBVyxNQUFNLEtBQUssWUFBWSxXQUFXLFVBQVUsVUFBVSxZQUFZLGFBQWEsV0FBVyxZQUFZLFdBQVcsVUFBVSxVQUFVLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWSxhQUFhLFdBQVcsVUFBVSxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLFlBQVksYUFBYSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxXQUFXLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksV0FBVyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLFdBQVcsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxNQUFNLEtBQUssVUFBVSxZQUFZLFdBQVcsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLE9BQU8sS0FBSyxVQUFVLHVEQUF1RCxTQUFTLHNDQUFzQyx1REFBdUQsd0NBQXdDLDBDQUEwQyxvQkFBb0Isb0JBQW9CLG9CQUFvQixvQkFBb0IsR0FBRyxPQUFPLGdCQUFnQixpQkFBaUIsNkJBQTZCLEdBQUcsVUFBVSxtQkFBbUIsd0JBQXdCLDJDQUEyQyxxQ0FBcUMscUJBQXFCLHFDQUFxQyx5QkFBeUIsR0FBRyxVQUFVLG9CQUFvQiw2QkFBNkIsb0NBQW9DLHlCQUF5QixvQkFBb0IsbUJBQW1CLHlCQUF5Qix1QkFBdUIsR0FBRyxzQkFBc0IseUJBQXlCLGFBQWEsY0FBYyxtQkFBbUIsb0JBQW9CLGtCQUFrQixHQUFHLFdBQVcsbUJBQW1CLG9CQUFvQix3QkFBd0IsR0FBRyxxQkFBcUIseUJBQXlCLG1CQUFtQixrQkFBa0IseUJBQXlCLG9CQUFvQiw4QkFBOEIsMEJBQTBCLDRCQUE0QixrQkFBa0IsMkJBQTJCLHdCQUF3QixHQUFHLFlBQVksOEJBQThCLEdBQUcsZUFBZSx5QkFBeUIsZ0JBQWdCLGlCQUFpQixHQUFHLGVBQWUseUJBQXlCLGlCQUFpQixHQUFHLFlBQVksMEJBQTBCLG1CQUFtQixzQkFBc0Isb0JBQW9CLDBCQUEwQixxQ0FBcUMsbUJBQW1CLHlCQUF5QixrQkFBa0IsbUJBQW1CLG1CQUFtQixrQkFBa0IsNEJBQTRCLDZCQUE2QixHQUFHLGtCQUFrQixtQkFBbUIsa0JBQWtCLHlCQUF5Qix5QkFBeUIsZUFBZSxnQkFBZ0IsMEJBQTBCLGlDQUFpQyx3Q0FBd0MsR0FBRyxvQ0FBb0Msa0NBQWtDLEdBQUcscUJBQXFCLHlCQUF5QixvQkFBb0IsNkJBQTZCLDBCQUEwQixnQkFBZ0IsR0FBRywyQkFBMkIsaUJBQWlCLG1DQUFtQywwQkFBMEIsbUJBQW1CLG1EQUFtRCxtQ0FBbUMsdUNBQXVDLDBDQUEwQyw4QkFBOEIsd0JBQXdCLEdBQUcsWUFBWSxvQkFBb0Isd0JBQXdCLCtCQUErQixHQUFHLG1CQUFtQix1QkFBdUIsNkJBQTZCLGdDQUFnQyxpQ0FBaUMsd0JBQXdCLEdBQUcsUUFBUSx3QkFBd0IsaUNBQWlDLEdBQUcsc0JBQXNCLG9CQUFvQixvQ0FBb0MsR0FBRyxpQ0FBaUMsb0JBQW9CLEdBQUcscUNBQXFDLG9CQUFvQix3QkFBd0IsK0JBQStCLEdBQUcsb0NBQW9DLHVCQUF1QixzQkFBc0IsaUNBQWlDLEdBQUcsNEJBQTRCLG9CQUFvQiw2QkFBNkIsOEJBQThCLEdBQUcsK0JBQStCLG9CQUFvQiwwQkFBMEIseUJBQXlCLDBCQUEwQix5QkFBeUIsZ0JBQWdCLDRCQUE0QixrREFBa0QsR0FBRyw0QkFBNEIsb0JBQW9CLDBCQUEwQixrQkFBa0Isd0JBQXdCLEdBQUcsZ0NBQWdDLDhCQUE4QixHQUFHLHVDQUF1QyxvQkFBb0IsNkJBQTZCLGdCQUFnQixHQUFHLGVBQWUsb0JBQW9CLG9DQUFvQyxrQkFBa0IseUJBQXlCLDRCQUE0QixrREFBa0QsR0FBRyxxQkFBcUIsb0JBQW9CLDZCQUE2QiwwQkFBMEIsR0FBRyx5QkFBeUIsOEJBQThCLEdBQUcsaUJBQWlCLHFCQUFxQixHQUFHLGlCQUFpQixxQkFBcUIsR0FBRyxtQkFBbUI7QUFDMTRNO0FBQ0EsaUVBQWUsdUJBQXVCLEVBQUM7Ozs7Ozs7Ozs7O0FDelAxQjs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQSxnREFBZ0Q7QUFDaEQ7QUFDQTtBQUNBLHFGQUFxRjtBQUNyRjtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsaUJBQWlCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixxQkFBcUI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Ysc0ZBQXNGLHFCQUFxQjtBQUMzRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsaURBQWlELHFCQUFxQjtBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Ysc0RBQXNELHFCQUFxQjtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDcEZhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUN6QmE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxjQUFjO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNkQSxNQUFrRztBQUNsRyxNQUF3RjtBQUN4RixNQUErRjtBQUMvRixNQUFrSDtBQUNsSCxNQUEyRztBQUMzRyxNQUEyRztBQUMzRyxNQUFzRztBQUN0RztBQUNBOztBQUVBOztBQUVBLDRCQUE0QixxR0FBbUI7QUFDL0Msd0JBQXdCLGtIQUFhOztBQUVyQyx1QkFBdUIsdUdBQWE7QUFDcEM7QUFDQSxpQkFBaUIsK0ZBQU07QUFDdkIsNkJBQTZCLHNHQUFrQjs7QUFFL0MsYUFBYSwwR0FBRyxDQUFDLHNGQUFPOzs7O0FBSWdEO0FBQ3hFLE9BQU8saUVBQWUsc0ZBQU8sSUFBSSxzRkFBTyxVQUFVLHNGQUFPLG1CQUFtQixFQUFDOzs7Ozs7Ozs7OztBQzFCaEU7O0FBRWI7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHdCQUF3QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixpQkFBaUI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiw0QkFBNEI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQiw2QkFBNkI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNuRmE7O0FBRWI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDakNhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNUYTs7QUFFYjtBQUNBO0FBQ0EsY0FBYyxLQUF3QyxHQUFHLHNCQUFpQixHQUFHLENBQUk7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ1RhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsaUZBQWlGO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDNURhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O1VDYkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOzs7OztXQ3pCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BEOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NsQkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOzs7OztXQ3JCQTs7Ozs7Ozs7Ozs7Ozs7O0FDQTZCO0FBQ2M7QUFDSjtBQUNtQjtBQUcxRCxNQUFNVCxLQUFLLEdBQUcsSUFBSStILHlEQUFTLENBQUMsQ0FBQztBQUM3QixNQUFNOUgsSUFBSSxHQUFHLElBQUlnSix1REFBUSxDQUFDLENBQUM7QUFDM0IsTUFBTUMsVUFBVSxHQUFHLElBQUlwSixtRUFBYyxDQUFDRSxLQUFLLEVBQUVDLElBQUksQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvc2NyaXB0cy9jb250cm9sbGVycy9tYWluQ29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9zY3JpcHRzL21vZGVscy9BUElzLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3NjcmlwdHMvbW9kZWxzL2NpdHlJbmZvLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3NjcmlwdHMvbW9kZWxzL2N1cnJlbnRXZWF0aGVyLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3NjcmlwdHMvbW9kZWxzL2ZvcmVjYXN0V2VhdGhlci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9zY3JpcHRzL21vZGVscy9tYWluTW9kZWwuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvc2NyaXB0cy92aWV3cy9jaXR5SW5mb1ZpZXcuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvc2NyaXB0cy92aWV3cy9jdXJyZW50V2VhdGhlclZpZXcuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvc2NyaXB0cy92aWV3cy9mb3JlY2FzdFdlYXRoZXJWaWV3LmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3NjcmlwdHMvdmlld3MvbWFpblZpZXcuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvc3R5bGVzL25vbWFybGl6ZS5jc3MiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvc3R5bGVzL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvc3R5bGVzL3N0eWxlLmNzcz9mZjk0Iiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9zY3JpcHRzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIE1haW5Db250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdmlldykge1xuICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgICAgIHRoaXMuY2l0eSA9IHt9O1xuICAgICAgICB0aGlzLnVuaXQgPSBcIm1ldHJpY1wiO1xuICAgICAgICB0aGlzLmNpdHkgPSBcIm5ldyB5b3JrXCI7XG4gICAgICAgIHRoaXMubG9hZHBhZ2UodGhpcy5jaXR5KTtcblxuXG4gICAgfVxuXG5cbiAgICBhc3luYyBsb2FkcGFnZShjaXR5KSB7XG4gICAgICAgIHRoaXMuY2l0eSA9IGNpdHk7XG5cbiAgICAgICAgY29uc3QgY2l0eUluZm8gPSBhd2FpdCB0aGlzLm1vZGVsLmdldENpdHlJbmZvKGNpdHksIHRoaXMudW5pdCk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRXZWF0aGVyID0gYXdhaXQgdGhpcy5tb2RlbC5nZXRDdXJyZW50V2VhdGhlcihjaXR5LCB0aGlzLnVuaXQpO1xuICAgICAgICBjb25zdCBmb3JlY2FzdFdlYXRoZXIgPSBhd2FpdCB0aGlzLm1vZGVsLmdldEZvcmVjYXN0V2VhdGhlcihjaXR5LCB0aGlzLnVuaXQpO1xuXG5cbiAgICAgICAgdGhpcy52aWV3LmFwcGVuZENpdHlJbmZvKGNpdHlJbmZvKTtcbiAgICAgICAgdGhpcy52aWV3LmFwcGVuZEN1cnJyZW50V2VhdGhlcihjdXJyZW50V2VhdGhlcik7XG4gICAgICAgIHRoaXMudmlldy5hcHBlbmRGb3JlY2FzdFdlYXRoZXIoZm9yZWNhc3RXZWF0aGVyKTtcbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQVBJcyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudXJsR2VuZXJhdG9yID0gbmV3IFVybEdlbmVyZXRvcignZDM4OTdjMTQ4OWMwZDhlY2VhOGFlY2FiOTFkYTRkMWQnKTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRHZW9Db29yZGluYXRlcyhjaXR5KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSB0aGlzLnVybEdlbmVyYXRvci5nZW5lcmF0ZUdlb0Nvb3Jkc1VybChjaXR5KTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xuICAgICAgICAgICAgY29uc3QgZ2VvQ29kaW5nRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIGNvbnN0IHsgbGF0LCBsb24gfSA9IGdlb0NvZGluZ0RhdGFbMF07XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3InKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICByZXR1cm4geyBsYXQsIGxvbiB9XG5cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIGdldEN1cnJlbnRXZWF0aGVyRGF0YShjaXR5LCB1bml0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGxhdCwgbG9uIH0gPSBhd2FpdCB0aGlzLmdldEdlb0Nvb3JkaW5hdGVzKGNpdHkpO1xuICAgICAgICAgICAgY29uc3QgdXJsID0gdGhpcy51cmxHZW5lcmF0b3IuZ2VuZXJhdGVDdXJyZW50V2VhdGhlcihsYXQsIGxvbiwgdW5pdCk7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgeyBtb2RlOiAnY29ycycgfSk7XG4gICAgICAgICAgICBjb25zdCB3ZWF0aGVyRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcnJvcicpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIHJldHVybiB3ZWF0aGVyRGF0YTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0Rm9yZWNhc3RXZWF0aGVyRGF0YShjaXR5LCB1bml0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGxhdCwgbG9uIH0gPSBhd2FpdCB0aGlzLmdldEdlb0Nvb3JkaW5hdGVzKGNpdHkpO1xuICAgICAgICAgICAgY29uc3QgdXJsID0gdGhpcy51cmxHZW5lcmF0b3IuZ2VuZXJhdGVGb3JlY2FzdFdlYXRoZXIobGF0LCBsb24sIHVuaXQpO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbW9kZTogJ2NvcnMnIH0pO1xuICAgICAgICAgICAgY29uc3QgZm9yZWNhc3REYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICByZXR1cm4gZm9yZWNhc3REYXRhO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNsYXNzIFVybEdlbmVyZXRvciB7XG4gICAgY29uc3RydWN0b3IoYXBwSWQpIHtcbiAgICAgICAgdGhpcy5iYXNlVXJsID0gXCJodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmdcIjtcbiAgICAgICAgdGhpcy5hcHBJZCA9IGFwcElkO1xuICAgIH1cbiAgICBnZW5lcmF0ZUdlb0Nvb3Jkc1VybChjaXR5KSB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmJhc2VVcmx9L2dlby8xLjAvZGlyZWN0P3E9JHtjaXR5fSZhcHBpZD0ke3RoaXMuYXBwSWR9YDtcbiAgICB9XG4gICAgZ2VuZXJhdGVDdXJyZW50V2VhdGhlcihsYXQsIGxvbiwgdW5pdCkge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5iYXNlVXJsfS9kYXRhLzIuNS93ZWF0aGVyP2xhdD0ke2xhdH0mbG9uPSR7bG9ufSZhcHBpZD0ke3RoaXMuYXBwSWR9JnVuaXRzPSR7dW5pdH1gO1xuICAgIH1cbiAgICBnZW5lcmF0ZUZvcmVjYXN0V2VhdGhlcihsYXQsIGxvbiwgdW5pdCkge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5iYXNlVXJsfS9kYXRhLzIuNS9mb3JlY2FzdD9sYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mY250PSZhcHBpZD0ke3RoaXMuYXBwSWR9JnVuaXRzPSR7dW5pdH1gO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDaXR5SW5mbyB7XG4gICAgY29uc3RydWN0b3IoQXBpRGF0YSkge1xuICAgICAgICB0aGlzLmNpdHlEZXNjcmlwdGlvbiA9IHRoaXMuY3JlYXRlQ2l0eURlc2NyaXB0aW9uKEFwaURhdGEpO1xuICAgICAgICB0aGlzLmRhdGVEZXNjcmlwdGlvbiA9IHRoaXMuY3JlYXRlRGF0ZURlc2NyaXB0aW9uKEFwaURhdGEpO1xuXG4gICAgfVxuXG4gICAgY3JlYXRlQ2l0eURlc2NyaXB0aW9uKEFwaURhdGEpIHtcbiAgICAgICAgY29uc3QgY2l0eSA9IEFwaURhdGEubmFtZTtcbiAgICAgICAgY29uc3QgeyBjb3VudHJ5IH0gPSBBcGlEYXRhLnN5cztcblxuICAgICAgICByZXR1cm4gYCR7Y2l0eX0sICR7Y291bnRyeX1gO1xuICAgIH1cblxuICAgIGNyZWF0ZURhdGVEZXNjcmlwdGlvbihBcGlEYXRhKSB7XG4gICAgICAgIGNvbnN0IGRheSA9IHRoaXMuZ2V0RGF5KCk7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gdGhpcy5nZXRNb250aCgpO1xuICAgICAgICBjb25zdCBkYXRlID0gdGhpcy5nZXREYXRlKCk7XG5cbiAgICAgICAgcmV0dXJuIGAke2RheX0sICR7bW9udGh9ICR7ZGF0ZX1gO1xuICAgIH1cblxuICAgIGdldERheSgpIHtcbiAgICAgICAgY29uc3Qgd2Vla2RheSA9IFtcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCJdO1xuICAgICAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICAgICAgY29uc3QgZGF5ID0gd2Vla2RheVtkLmdldERheSgpXTtcbiAgICAgICAgcmV0dXJuIGRheTtcbiAgICB9XG5cbiAgICBnZXRNb250aCgpIHtcbiAgICAgICAgY29uc3QgbW9udGhOYW1lcyA9IFtcbiAgICAgICAgICAgIFwiSmFudWFyeVwiLFxuICAgICAgICAgICAgXCJGZWJydWFyeVwiLFxuICAgICAgICAgICAgXCJNYXJjaFwiLFxuICAgICAgICAgICAgXCJBcHJpbFwiLFxuICAgICAgICAgICAgXCJNYXlcIixcbiAgICAgICAgICAgIFwiSnVuZVwiLFxuICAgICAgICAgICAgXCJKdWx5XCIsXG4gICAgICAgICAgICBcIkF1Z3VzdFwiLFxuICAgICAgICAgICAgXCJTZXB0ZW1iZXJcIixcbiAgICAgICAgICAgIFwiT2N0b2JlclwiLFxuICAgICAgICAgICAgXCJOb3ZlbWJlclwiLFxuICAgICAgICAgICAgXCJEZWNlbWJlclwiLFxuICAgICAgICBdO1xuICAgICAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICAgICAgY29uc3QgbW9udGggPSBtb250aE5hbWVzW2QuZ2V0TW9udGgoKV07XG4gICAgICAgIHJldHVybiBtb250aDtcbiAgICB9XG4gICAgZ2V0RGF0ZSgpIHtcbiAgICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGNvbnN0IGRhdGUgPSBkLmdldERhdGUoKTtcbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3VycmVudFdlYXRoZXIge1xuICAgIGNvbnN0cnVjdG9yKGN1cnJlbnRXZWF0aGVyRGF0YSwgdW5pdCkge1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gdGhpcy5nZXRUZW1wZXJhdHVyZShNYXRoLnJvdW5kKGN1cnJlbnRXZWF0aGVyRGF0YS5tYWluLnRlbXApLCB1bml0KTtcbiAgICAgICAgdGhpcy5mZWVsc0xpa2VUZW1wID0gdGhpcy5nZXRUZW1wZXJhdHVyZShNYXRoLnJvdW5kKGN1cnJlbnRXZWF0aGVyRGF0YS5tYWluLmZlZWxzX2xpa2UpLCB1bml0KTtcbiAgICAgICAgdGhpcy5odW1pZGl0eSA9IGAke2N1cnJlbnRXZWF0aGVyRGF0YS5tYWluLmh1bWlkaXR5fSVgO1xuICAgICAgICB0aGlzLndpbmRTcGVlZCA9IGAke2N1cnJlbnRXZWF0aGVyRGF0YS53aW5kLnNwZWVkfW0vc2A7XG4gICAgICAgIHRoaXMucHJlc3N1cmUgPSBgJHtjdXJyZW50V2VhdGhlckRhdGEubWFpbi5wcmVzc3VyZX0gaFBhYDtcbiAgICAgICAgdGhpcy5zdW5yaXNlID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlUaW1lKGN1cnJlbnRXZWF0aGVyRGF0YS5zeXMuc3VucmlzZSwgY3VycmVudFdlYXRoZXJEYXRhLnRpbWV6b25lKTtcbiAgICAgICAgdGhpcy5zdW5zZXQgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eVRpbWUoY3VycmVudFdlYXRoZXJEYXRhLnN5cy5zdW5zZXQsIGN1cnJlbnRXZWF0aGVyRGF0YS50aW1lem9uZSk7XG4gICAgICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbkRlc2MgPSBjdXJyZW50V2VhdGhlckRhdGEud2VhdGhlclswXS5kZXNjcmlwdGlvbjtcbiAgICAgICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uSW1nID0gdGhpcy5nZXR3ZWF0aGVyQ29uZGl0aW9uSW1nKFxuICAgICAgICAgICAgY3VycmVudFdlYXRoZXJEYXRhLndlYXRoZXJbMF0ubWFpbixcbiAgICAgICAgICAgIGN1cnJlbnRXZWF0aGVyRGF0YS5zeXMuc3VucmlzZSxcbiAgICAgICAgICAgIGN1cnJlbnRXZWF0aGVyRGF0YS5zeXMuc3Vuc2V0LFxuICAgICAgICAgICAgY3VycmVudFdlYXRoZXJEYXRhLnRpbWV6b25lXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZFZpZGVvID0gdGhpcy5nZXRCYWNrZ3JvdW5kVmlkZW8odGhpcy53ZWF0aGVyQ29uZGl0aW9uSW1nKTtcblxuICAgIH1cblxuICAgIGdldFRlbXBlcmF0dXJlKGRlZ3JlZXMsIHVuaXQpIHtcbiAgICAgICAgcmV0dXJuIHVuaXQgPT09IFwibWV0cmljXCIgPyBgJHtkZWdyZWVzfSDihINgIDogYCR7ZGVncmVlc30g4oSJYDtcbiAgICB9XG5cbiAgICBjb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKHVuaXhUaW1lLCB0aW1lem9uZSkge1xuICAgICAgICBjb25zdCBsb2NhbERhdGUgPSB1bml4VGltZSA9PT0gMCA/IG5ldyBEYXRlIDogbmV3IERhdGUodW5peFRpbWUgKiAxMDAwKTtcbiAgICAgICAgY29uc3QgdXRjVW5peFRpbWUgPSBsb2NhbERhdGUuZ2V0VGltZSgpICsgKGxvY2FsRGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpICogNjAwMDApO1xuICAgICAgICBjb25zdCB1bml4VGltZUluU2VhcmNoZWRDaXR5ID0gdXRjVW5peFRpbWUgKyB0aW1lem9uZSAqIDEwMDA7XG4gICAgICAgIGNvbnN0IGRhdGVJblNlYXJjaGVkQ2l0eSA9IG5ldyBEYXRlKHVuaXhUaW1lSW5TZWFyY2hlZENpdHkpXG4gICAgICAgIHJldHVybiBkYXRlSW5TZWFyY2hlZENpdHk7XG4gICAgfVxuXG4gICAgY29udmVydFRvU2VhcmNoZWRDaXR5VGltZSh1bml4VGltZSwgdGltZXpvbmUpIHtcbiAgICAgICAgY29uc3QgZGF0ZUluU2VhcmNoZWRDaXR5ID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKHVuaXhUaW1lLCB0aW1lem9uZSk7XG4gICAgICAgIGNvbnN0IGhvdXJzID0gZGF0ZUluU2VhcmNoZWRDaXR5LmdldEhvdXJzKCk7XG4gICAgICAgIGNvbnN0IG1pbnV0ZXMgPSBgJHtkYXRlSW5TZWFyY2hlZENpdHkuZ2V0TWludXRlcygpfWA7XG4gICAgICAgIGNvbnN0IGZvcm1hdHRlZFRpbWUgPSBgJHtob3Vyc306JHttaW51dGVzfWA7XG4gICAgICAgIHJldHVybiBmb3JtYXR0ZWRUaW1lO1xuICAgIH1cblxuICAgIGdldHdlYXRoZXJDb25kaXRpb25JbWcodmFsdWUsIHN1bnJpc2VVbml4LCBzdW5zZXRVbml4LCB0aW1lem9uZSkge1xuICAgICAgICBpZiAodmFsdWUgPT09IFwiRHJpenpsZVwiKSByZXR1cm4gXCJyYWluXCI7XG4gICAgICAgIGNvbnN0IG1pc3RFcXVpdmFsZW50ZXMgPSBbXCJTbW9rZVwiLCBcIkhhemVcIiwgXCJEdXN0XCIsIFwiRm9nXCIsIFwiU2FuZFwiLCBcIkR1c3RcIiwgXCJBc2hcIiwgXCJTcXVhbGxcIiwgXCJUb3JuYWRvXCJdO1xuICAgICAgICBpZiAobWlzdEVxdWl2YWxlbnRlcy5pbmNsdWRlcyh2YWx1ZSkpIHJldHVybiBcIk1pc3RcIjtcbiAgICAgICAgaWYgKHZhbHVlICE9PSBcIkNsZWFyXCIpIHJldHVybiB2YWx1ZTtcbiAgICAgICAgY29uc3QgY3VycmVudERhdGUgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoMCwgdGltZXpvbmUpO1xuICAgICAgICBjb25zdCBzdW5yaXNlRGF0ZSA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZShzdW5yaXNlVW5peCwgdGltZXpvbmUpO1xuICAgICAgICBjb25zdCBzdW5zZXREYXRlID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKHN1bnNldFVuaXgsIHRpbWV6b25lKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnREYXRlID4gc3VucmlzZURhdGUgJiYgY3VycmVudERhdGUgPCBzdW5zZXREYXRlID8gYCR7dmFsdWV9RGF5YCA6IGAke3ZhbHVlfU5pZ2h0YDtcbiAgICB9XG5cbiAgICBnZXRCYWNrZ3JvdW5kVmlkZW8od2VhdGhlckNvbmRpdGlvbikge1xuICAgICAgICBjb25zdCB2aWRlb0xpbmtzID0ge1xuICAgICAgICAgICAgQ2xlYXJEYXk6IFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzQyMDIyMTE0NS5oZC5tcDQ/cz0zOTU5YmNiZjQ4MjlhOTVjZTRiMjk0MDE5MjA3NGQ3NDY5ZmY5ODRiJnByb2ZpbGVfaWQ9MTc1Jm9hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MVwiLFxuICAgICAgICAgICAgQ2xlYXJOaWdodDogXCJodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvMzMzNTg0NTk5LnNkLm1wND9zPWRmMjFlY2E2MThmOTc0OWNmMmY3MzRmZWU3Yzk0ZmMxYTA5ZDBmNTQmYW1wO3Byb2ZpbGVfaWQ9MTY0JmFtcDtvYXV0aDJfdG9rZW5faWQ9NTc0NDc3NjFcIixcbiAgICAgICAgICAgIENsb3VkczogXCJodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvNDQ0MTkyOTc4LmhkLm1wND9zPTE4YWI3MzQ1NjJkOGM0ZWEwZWMyZmVkN2YxNmYzZWRmNjE1OGRkY2MmcHJvZmlsZV9pZD0xNzImb2F1dGgyX3Rva2VuX2lkPTU3NDQ3NzYxXCIsXG4gICAgICAgICAgICBNaXN0OiBcImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9leHRlcm5hbC8zNTAyNDEwODguaGQubXA0P3M9M2EyODc0MjZlMDE0NmRhYjZlYTczOGY0NjI5YzZmMDk4OWE4OTYwMyZwcm9maWxlX2lkPTE3MiZvYXV0aDJfdG9rZW5faWQ9NTc0NDc3NjFcIixcbiAgICAgICAgICAgIFJhaW46IFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3Byb2dyZXNzaXZlX3JlZGlyZWN0L3BsYXliYWNrLzcwODYyOTgyMy9yZW5kaXRpb24vNzIwcC9maWxlLm1wND9sb2M9ZXh0ZXJuYWwmb2F1dGgyX3Rva2VuX2lkPTU3NDQ3NzYxJnNpZ25hdHVyZT05OTUxZTQ1MTMzNGZkZmJjZjllYjZiOGM5MzNmZDAxZGQxMmE1NGEwM2ZkYjM3MWYwZGE4NjRhMTdhYWVhZjI5XCIsXG4gICAgICAgICAgICBNaXN0OiBcImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9leHRlcm5hbC8zNTAyNDEwODguaGQubXA0P3M9M2EyODc0MjZlMDE0NmRhYjZlYTczOGY0NjI5YzZmMDk4OWE4OTYwMyZwcm9maWxlX2lkPTE3MiZvYXV0aDJfdG9rZW5faWQ9NTc0NDc3NjFcIixcbiAgICAgICAgICAgIFRodW5kZXJzdG9ybTogXCJodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvNDgwMjIzODk2LmhkLm1wND9zPWU0Yjk0ZjBiNTcwMGJmYTY4Y2I2ZjAyYjQxZjk0ZWNjYTkxMjQyZTkmcHJvZmlsZV9pZD0xNjkmb2F1dGgyX3Rva2VuX2lkPTU3NDQ3NzYxXCJcblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2aWRlb0xpbmtzW3dlYXRoZXJDb25kaXRpb25dO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBGb3JlY2FzdFdlYXRoZXIge1xuICAgIGNvbnN0cnVjdG9yKGZvcmVjYXN0V2VhdGhlckRhdGEsIHVuaXQpIHtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSA9IHRoaXMuZ2V0VGVtcGVyYXR1cmUoZm9yZWNhc3RXZWF0aGVyRGF0YSwgdW5pdCk7XG4gICAgfVxuXG4gICAgZ2V0VGVtcGVyYXR1cmUoZm9yZWNhc3RXZWF0aGVyRGF0YSwgdW5pdCkge1xuICAgICAgICBjb25zdCB0ZW1wZXJhdHVyZXMgPSBbXTtcbiAgICAgICAgZm9yZWNhc3RXZWF0aGVyRGF0YS5saXN0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gTWF0aC5yb3VuZChpdGVtLm1haW4udGVtcCk7XG4gICAgICAgICAgICBjb25zdCB0ZW1wV2l0aFVuaXQgPSB0aGlzLmdldFRlbXBlcmF0dXJlVW5pdCh0ZW1wLCB1bml0KTtcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlcy5wdXNoKHRlbXBXaXRoVW5pdCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGVtcGVyYXR1cmVzO1xuICAgIH1cblxuICAgIGdldFRlbXBlcmF0dXJlVW5pdChkZWdyZWUsIHVuaXQpIHtcbiAgICAgICAgcmV0dXJuIHVuaXQgPT09IFwibWV0cmljXCIgPyBgJHtkZWdyZWV94oSDYCA6IGAke2RlZ3JlZX3ihIlgO1xuICAgIH1cbn0iLCJpbXBvcnQgQVBJcyBmcm9tIFwiLi9BUElzXCI7XG5pbXBvcnQgQ2l0eUluZm8gZnJvbSBcIi4vY2l0eUluZm9cIjtcbmltcG9ydCBDdXJyZW50V2VhdGhlciBmcm9tIFwiLi9jdXJyZW50V2VhdGhlclwiO1xuaW1wb3J0IEZvcmVjYXN0V2VhdGhlciBmcm9tIFwiLi9mb3JlY2FzdFdlYXRoZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFpbk1vZGVsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5kYXRhID0ge307XG4gICAgICAgIHRoaXMuQVBJcyA9IG5ldyBBUElzKCk7XG4gICAgfVxuICAgIGFzeW5jIGdldENpdHlJbmZvKGNpdHksIHVuaXQpIHtcbiAgICAgICAgY29uc3QgQXBpRGF0YSA9IGF3YWl0IHRoaXMuQVBJcy5nZXRDdXJyZW50V2VhdGhlckRhdGEoY2l0eSwgdW5pdCk7XG4gICAgICAgIGNvbnN0IGNpdHlJbmZvID0gbmV3IENpdHlJbmZvKEFwaURhdGEpO1xuICAgICAgICByZXR1cm4gY2l0eUluZm87XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0Q3VycmVudFdlYXRoZXIoY2l0eSwgdW5pdCkge1xuICAgICAgICBjb25zdCBjdXJyZW50V2VhdGhlckRhdGEgPSBhd2FpdCB0aGlzLkFQSXMuZ2V0Q3VycmVudFdlYXRoZXJEYXRhKGNpdHksIHVuaXQpO1xuICAgICAgICBjb25zdCBjdXJyZW50V2VhdGhlciA9IG5ldyBDdXJyZW50V2VhdGhlcihjdXJyZW50V2VhdGhlckRhdGEsIHVuaXQpO1xuICAgICAgICByZXR1cm4gY3VycmVudFdlYXRoZXI7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0Rm9yZWNhc3RXZWF0aGVyKGNpdHksIHVuaXQpIHtcbiAgICAgICAgY29uc3QgZm9yZWNhc3RXZWF0aGVyRGF0YSA9IGF3YWl0IHRoaXMuQVBJcy5nZXRGb3JlY2FzdFdlYXRoZXJEYXRhKGNpdHksIHVuaXQpO1xuICAgICAgICBjb25zdCBmb3JlY2FzdFdlYXRoZXIgPSBuZXcgRm9yZWNhc3RXZWF0aGVyKGZvcmVjYXN0V2VhdGhlckRhdGEsIHVuaXQpO1xuICAgICAgICByZXR1cm4gZm9yZWNhc3RXZWF0aGVyO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDaXR5SW5mb1ZpZXcge1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGNpdHlJbmZvTW9kZWwpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy5tb2RlbCA9IGNpdHlJbmZvTW9kZWw7XG4gICAgICAgIHRoaXMuY2l0eSA9IGNpdHlJbmZvTW9kZWwuY2l0eURlc2NyaXB0aW9uO1xuICAgICAgICB0aGlzLmRhdGUgPSBjaXR5SW5mb01vZGVsLmRhdGVEZXNjcmlwdGlvbjtcbiAgICB9XG5cbiAgICBnZXQgY2l0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdoMScpO1xuICAgIH1cbiAgICBzZXQgY2l0eSh2YWx1ZSkge1xuICAgICAgICB0aGlzLmNpdHkudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICB9XG4gICAgZ2V0IGRhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignaDInKTtcbiAgICB9XG4gICAgc2V0IGRhdGUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5kYXRlLnRleHRDb250ZW50ID0gdmFsdWU7XG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1cnJlbnRXZWF0aGVyVmlldyB7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgY3VycmVudFdlYXRoZXJNb2RlbCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLm1vZGVsID0gY3VycmVudFdlYXRoZXJNb2RlbDtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSA9IGN1cnJlbnRXZWF0aGVyTW9kZWwudGVtcGVyYXR1cmU7XG4gICAgICAgIHRoaXMuZmVlbHNMaWtlVGVtcCA9IGN1cnJlbnRXZWF0aGVyTW9kZWwuZmVlbHNMaWtlVGVtcDtcbiAgICAgICAgdGhpcy5odW1pZGl0eSA9IGN1cnJlbnRXZWF0aGVyTW9kZWwuaHVtaWRpdHk7XG4gICAgICAgIHRoaXMud2luZFNwZWVkID0gY3VycmVudFdlYXRoZXJNb2RlbC53aW5kU3BlZWQ7XG4gICAgICAgIHRoaXMucHJlc3N1cmUgPSBjdXJyZW50V2VhdGhlck1vZGVsLnByZXNzdXJlO1xuICAgICAgICB0aGlzLnN1bnJpc2UgPSBjdXJyZW50V2VhdGhlck1vZGVsLnN1bnJpc2U7XG4gICAgICAgIHRoaXMuc3Vuc2V0ID0gY3VycmVudFdlYXRoZXJNb2RlbC5zdW5zZXQ7XG4gICAgICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbkRlc2MgPSBjdXJyZW50V2VhdGhlck1vZGVsLndlYXRoZXJDb25kaXRpb25EZXNjO1xuICAgICAgICB0aGlzLndlYXRoZXJDb25kaXRpb25JbWcgPSBjdXJyZW50V2VhdGhlck1vZGVsLndlYXRoZXJDb25kaXRpb25JbWc7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZFZpZGVvID0gY3VycmVudFdlYXRoZXJNb2RlbC5iYWNrZ3JvdW5kVmlkZW87XG5cbiAgICB9XG4gICAgd2VhdGhlckNvbG9yKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PSBcIlJhaW5cIikge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdjb2xvci1yYWluJyk7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT0gXCJNaXN0XCIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnY29sb3ItbWlzdCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHRlbXBlcmF0dXJlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2gxJyk7XG4gICAgfVxuXG4gICAgc2V0IHRlbXBlcmF0dXJlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmUudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgZmVlbHNMaWtlVGVtcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZmVlbHMtbGlrZScpO1xuICAgIH1cblxuICAgIHNldCBmZWVsc0xpa2VUZW1wKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZmVlbHNMaWtlVGVtcC50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBodW1pZGl0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuaHVtaWRpdHknKTtcbiAgICB9XG5cbiAgICBzZXQgaHVtaWRpdHkodmFsdWUpIHtcbiAgICAgICAgdGhpcy5odW1pZGl0eS50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCB3aW5kU3BlZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLndpbmQtc3BlZWQnKTtcbiAgICB9XG5cbiAgICBzZXQgd2luZFNwZWVkKHZhbHVlKSB7XG4gICAgICAgIHRoaXMud2luZFNwZWVkLnRleHRDb250ZW50ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IHByZXNzdXJlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcmVzc3VyZScpO1xuICAgIH1cblxuICAgIHNldCBwcmVzc3VyZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLnByZXNzdXJlLnRleHRDb250ZW50ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IHN1bnJpc2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnN1bnJpc2UnKVxuICAgIH1cbiAgICBzZXQgc3VucmlzZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLnN1bnJpc2UudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgc3Vuc2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdW5zZXQnKVxuICAgIH1cbiAgICBzZXQgc3Vuc2V0KHZhbHVlKSB7XG4gICAgICAgIHRoaXMuc3Vuc2V0LnRleHRDb250ZW50ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IHdlYXRoZXJDb25kaXRpb25EZXNjKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2gyJyk7XG4gICAgfVxuICAgIHNldCB3ZWF0aGVyQ29uZGl0aW9uRGVzYyh2YWx1ZSkge1xuICAgICAgICB0aGlzLndlYXRoZXJDb25kaXRpb25EZXNjLnRleHRDb250ZW50ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IHdlYXRoZXJDb25kaXRpb25JbWcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignaW1nJyk7XG4gICAgfVxuXG4gICAgc2V0IHdlYXRoZXJDb25kaXRpb25JbWcodmFsdWUpIHtcbiAgICAgICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uSW1nLnNyYyA9IGAuL2ltYWdlcy8ke3ZhbHVlfS5wbmdgO1xuICAgICAgICB0aGlzLndlYXRoZXJDb2xvcih2YWx1ZSk7XG5cbiAgICB9XG5cbiAgICBnZXQgYmFja2dyb3VuZFZpZGVvKCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZGVvJyk7XG4gICAgfVxuICAgIHNldCBiYWNrZ3JvdW5kVmlkZW8odmFsdWUpIHtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kVmlkZW8uc3JjID0gdmFsdWU7XG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvcmVjYXN0V2VhdGhlclZpZXcge1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGZvcmVjYXN0V2VhdGhlck1vZGVsKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMubW9kZWwgPSBmb3JlY2FzdFdlYXRoZXJNb2RlbDtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZXMgPSBmb3JlY2FzdFdlYXRoZXJNb2RlbC50ZW1wZXJhdHVyZTtcblxuICAgIH1cblxuICAgIGdldCB0ZW1wZXJhdHVyZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZvcmVjYXN0X19pdGVtX190ZW1wZXJhdHVyZScpO1xuICAgIH1cblxuICAgIHNldCB0ZW1wZXJhdHVyZXModmFsdWUpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA4OyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMudGVtcGVyYXR1cmVzW2ldLnRleHRDb250ZW50ID0gdmFsdWVbaV07XG5cbiAgICAgICAgfVxuICAgIH1cblxufSIsImltcG9ydCBDaXR5SW5mb1ZpZXcgZnJvbSBcIi4vY2l0eUluZm9WaWV3XCI7XG5pbXBvcnQgQ3VycmVudFdlYXRoZXJWaWV3IGZyb20gXCIuL2N1cnJlbnRXZWF0aGVyVmlld1wiO1xuaW1wb3J0IEZvcmVjYXN0V2VhdGhlclZpZXcgZnJvbSBcIi4vZm9yZWNhc3RXZWF0aGVyVmlld1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYWluVmlldyB7XG4gICAgYXBwZW5kQ2l0eUluZm8oY2l0eUluZm8pIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaXR5LWluZm8nKTtcbiAgICAgICAgbmV3IENpdHlJbmZvVmlldyhlbGVtZW50LCBjaXR5SW5mbyk7XG4gICAgfVxuXG4gICAgYXBwZW5kQ3VycnJlbnRXZWF0aGVyKGN1cnJlbnRXZWF0aGVyKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cnJlbnQtd2VhdGhlclwiKTtcbiAgICAgICAgbmV3IEN1cnJlbnRXZWF0aGVyVmlldyhlbGVtZW50LCBjdXJyZW50V2VhdGhlcik7XG4gICAgfVxuXG4gICAgYXBwZW5kRm9yZWNhc3RXZWF0aGVyKGZvcmVjYXN0V2VhdGhlcikge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZvcmVjYXN0Jyk7XG4gICAgICAgIG5ldyBGb3JlY2FzdFdlYXRoZXJWaWV3KGVsZW1lbnQsIGZvcmVjYXN0V2VhdGhlcik7XG4gICAgfVxuXG59IiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cblxuXG4vKiBEb2N1bWVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxuICovXG5cbmh0bWwge1xuICAgIGxpbmUtaGVpZ2h0OiAxLjE1O1xuICAgIC8qIDEgKi9cbiAgICAtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IDEwMCU7XG4gICAgLyogMiAqL1xufVxuXG5cbi8qIFNlY3Rpb25zXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuLyoqXG4gICAqIFJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cbiAgICovXG5cbmJvZHkge1xuICAgIG1hcmdpbjogMDtcbn1cblxuXG4vKipcbiAgICogUmVuZGVyIHRoZSBcXGBtYWluXFxgIGVsZW1lbnQgY29uc2lzdGVudGx5IGluIElFLlxuICAgKi9cblxubWFpbiB7XG4gICAgZGlzcGxheTogYmxvY2s7XG59XG5cblxuLyoqXG4gICAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIFxcYGgxXFxgIGVsZW1lbnRzIHdpdGhpbiBcXGBzZWN0aW9uXFxgIGFuZFxuICAgKiBcXGBhcnRpY2xlXFxgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cbiAgICovXG5cbmgxIHtcbiAgICBmb250LXNpemU6IDJlbTtcbiAgICBtYXJnaW46IDAuNjdlbSAwO1xufVxuXG5cbi8qIEdyb3VwaW5nIGNvbnRlbnRcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4vKipcbiAgICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gRmlyZWZveC5cbiAgICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXG4gICAqL1xuXG5ociB7XG4gICAgYm94LXNpemluZzogY29udGVudC1ib3g7XG4gICAgLyogMSAqL1xuICAgIGhlaWdodDogMDtcbiAgICAvKiAxICovXG4gICAgb3ZlcmZsb3c6IHZpc2libGU7XG4gICAgLyogMiAqL1xufVxuXG5cbi8qKlxuICAgKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICAgKiAyLiBDb3JyZWN0IHRoZSBvZGQgXFxgZW1cXGAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxuICAgKi9cblxucHJlIHtcbiAgICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7XG4gICAgLyogMSAqL1xuICAgIGZvbnQtc2l6ZTogMWVtO1xuICAgIC8qIDIgKi9cbn1cblxuXG4vKiBUZXh0LWxldmVsIHNlbWFudGljc1xuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbi8qKlxuICAgKiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBvbiBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXG4gICAqL1xuXG5hIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbn1cblxuXG4vKipcbiAgICogMS4gUmVtb3ZlIHRoZSBib3R0b20gYm9yZGVyIGluIENocm9tZSA1Ny1cbiAgICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cbiAgICovXG5cbmFiYnJbdGl0bGVdIHtcbiAgICBib3JkZXItYm90dG9tOiBub25lO1xuICAgIC8qIDEgKi9cbiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgICAvKiAyICovXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkO1xuICAgIC8qIDIgKi9cbn1cblxuXG4vKipcbiAgICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cbiAgICovXG5cbmIsXG5zdHJvbmcge1xuICAgIGZvbnQtd2VpZ2h0OiBib2xkZXI7XG59XG5cblxuLyoqXG4gICAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gICAqIDIuIENvcnJlY3QgdGhlIG9kZCBcXGBlbVxcYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXG4gICAqL1xuXG5jb2RlLFxua2JkLFxuc2FtcCB7XG4gICAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlO1xuICAgIC8qIDEgKi9cbiAgICBmb250LXNpemU6IDFlbTtcbiAgICAvKiAyICovXG59XG5cblxuLyoqXG4gICAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICAgKi9cblxuc21hbGwge1xuICAgIGZvbnQtc2l6ZTogODAlO1xufVxuXG5cbi8qKlxuICAgKiBQcmV2ZW50IFxcYHN1YlxcYCBhbmQgXFxgc3VwXFxgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxuICAgKiBhbGwgYnJvd3NlcnMuXG4gICAqL1xuXG5zdWIsXG5zdXAge1xuICAgIGZvbnQtc2l6ZTogNzUlO1xuICAgIGxpbmUtaGVpZ2h0OiAwO1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG5cbnN1YiB7XG4gICAgYm90dG9tOiAtMC4yNWVtO1xufVxuXG5zdXAge1xuICAgIHRvcDogLTAuNWVtO1xufVxuXG5cbi8qIEVtYmVkZGVkIGNvbnRlbnRcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4vKipcbiAgICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC5cbiAgICovXG5cbmltZyB7XG4gICAgYm9yZGVyLXN0eWxlOiBub25lO1xufVxuXG5cbi8qIEZvcm1zXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuLyoqXG4gICAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzLlxuICAgKiAyLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXG4gICAqL1xuXG5idXR0b24sXG5pbnB1dCxcbm9wdGdyb3VwLFxuc2VsZWN0LFxudGV4dGFyZWEge1xuICAgIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xuICAgIC8qIDEgKi9cbiAgICBmb250LXNpemU6IDEwMCU7XG4gICAgLyogMSAqL1xuICAgIGxpbmUtaGVpZ2h0OiAxLjE1O1xuICAgIC8qIDEgKi9cbiAgICBtYXJnaW46IDA7XG4gICAgLyogMiAqL1xufVxuXG5cbi8qKlxuICAgKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cbiAgICogMS4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZS5cbiAgICovXG5cbmJ1dHRvbixcbmlucHV0IHtcbiAgICAvKiAxICovXG4gICAgb3ZlcmZsb3c6IHZpc2libGU7XG59XG5cblxuLyoqXG4gICAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxuICAgKiAxLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXG4gICAqL1xuXG5idXR0b24sXG5zZWxlY3Qge1xuICAgIC8qIDEgKi9cbiAgICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcbn1cblxuXG4vKipcbiAgICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAgICovXG5cbmJ1dHRvbixcblt0eXBlPVwiYnV0dG9uXCJdLFxuW3R5cGU9XCJyZXNldFwiXSxcblt0eXBlPVwic3VibWl0XCJdIHtcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcbn1cblxuXG4vKipcbiAgICogUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cbiAgICovXG5cbmJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwiYnV0dG9uXCJdOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJyZXNldFwiXTo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwic3VibWl0XCJdOjotbW96LWZvY3VzLWlubmVyIHtcbiAgICBib3JkZXItc3R5bGU6IG5vbmU7XG4gICAgcGFkZGluZzogMDtcbn1cblxuXG4vKipcbiAgICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxuICAgKi9cblxuYnV0dG9uOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJidXR0b25cIl06LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cInJlc2V0XCJdOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJzdWJtaXRcIl06LW1vei1mb2N1c3Jpbmcge1xuICAgIG91dGxpbmU6IDFweCBkb3R0ZWQgQnV0dG9uVGV4dDtcbn1cblxuXG4vKipcbiAgICogQ29ycmVjdCB0aGUgcGFkZGluZyBpbiBGaXJlZm94LlxuICAgKi9cblxuZmllbGRzZXQge1xuICAgIHBhZGRpbmc6IDAuMzVlbSAwLjc1ZW0gMC42MjVlbTtcbn1cblxuXG4vKipcbiAgICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cbiAgICogMi4gQ29ycmVjdCB0aGUgY29sb3IgaW5oZXJpdGFuY2UgZnJvbSBcXGBmaWVsZHNldFxcYCBlbGVtZW50cyBpbiBJRS5cbiAgICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxuICAgKiAgICBcXGBmaWVsZHNldFxcYCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXG4gICAqL1xuXG5sZWdlbmQge1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgLyogMSAqL1xuICAgIGNvbG9yOiBpbmhlcml0O1xuICAgIC8qIDIgKi9cbiAgICBkaXNwbGF5OiB0YWJsZTtcbiAgICAvKiAxICovXG4gICAgbWF4LXdpZHRoOiAxMDAlO1xuICAgIC8qIDEgKi9cbiAgICBwYWRkaW5nOiAwO1xuICAgIC8qIDMgKi9cbiAgICB3aGl0ZS1zcGFjZTogbm9ybWFsO1xuICAgIC8qIDEgKi9cbn1cblxuXG4vKipcbiAgICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cbiAgICovXG5cbnByb2dyZXNzIHtcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG5cblxuLyoqXG4gICAqIFJlbW92ZSB0aGUgZGVmYXVsdCB2ZXJ0aWNhbCBzY3JvbGxiYXIgaW4gSUUgMTArLlxuICAgKi9cblxudGV4dGFyZWEge1xuICAgIG92ZXJmbG93OiBhdXRvO1xufVxuXG5cbi8qKlxuICAgKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cbiAgICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxuICAgKi9cblxuW3R5cGU9XCJjaGVja2JveFwiXSxcblt0eXBlPVwicmFkaW9cIl0ge1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgLyogMSAqL1xuICAgIHBhZGRpbmc6IDA7XG4gICAgLyogMiAqL1xufVxuXG5cbi8qKlxuICAgKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXG4gICAqL1xuXG5bdHlwZT1cIm51bWJlclwiXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcblt0eXBlPVwibnVtYmVyXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcbiAgICBoZWlnaHQ6IGF1dG87XG59XG5cblxuLyoqXG4gICAqIDEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxuICAgKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cbiAgICovXG5cblt0eXBlPVwic2VhcmNoXCJdIHtcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IHRleHRmaWVsZDtcbiAgICAvKiAxICovXG4gICAgb3V0bGluZS1vZmZzZXQ6IC0ycHg7XG4gICAgLyogMiAqL1xufVxuXG5cbi8qKlxuICAgKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXG4gICAqL1xuXG5bdHlwZT1cInNlYXJjaFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xufVxuXG5cbi8qKlxuICAgKiAxLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxuICAgKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIFxcYGluaGVyaXRcXGAgaW4gU2FmYXJpLlxuICAgKi9cblxuIDo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xuICAgIC8qIDEgKi9cbiAgICBmb250OiBpbmhlcml0O1xuICAgIC8qIDIgKi9cbn1cblxuXG4vKiBJbnRlcmFjdGl2ZVxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbi8qXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFIDEwKywgYW5kIEZpcmVmb3guXG4gICAqL1xuXG5kZXRhaWxzIHtcbiAgICBkaXNwbGF5OiBibG9jaztcbn1cblxuXG4vKlxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBhbGwgYnJvd3NlcnMuXG4gICAqL1xuXG5zdW1tYXJ5IHtcbiAgICBkaXNwbGF5OiBsaXN0LWl0ZW07XG59XG5cblxuLyogTWlzY1xuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbi8qKlxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXG4gICAqL1xuXG50ZW1wbGF0ZSB7XG4gICAgZGlzcGxheTogbm9uZTtcbn1cblxuXG4vKipcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXG4gICAqL1xuXG5baGlkZGVuXSB7XG4gICAgZGlzcGxheTogbm9uZTtcbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvbm9tYXJsaXplLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSwyRUFBMkU7OztBQUczRTsrRUFDK0U7OztBQUcvRTs7O0VBR0U7O0FBRUY7SUFDSSxpQkFBaUI7SUFDakIsTUFBTTtJQUNOLDhCQUE4QjtJQUM5QixNQUFNO0FBQ1Y7OztBQUdBO2lGQUNpRjs7O0FBR2pGOztJQUVJOztB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QUNqQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiEgbm9ybWFsaXplLmNzcyB2OC4wLjEgfCBNSVQgTGljZW5zZSB8IGdpdGh1Yi5jb20vbmVjb2xhcy9ub3JtYWxpemUuY3NzICovXFxuXFxuXFxuLyogRG9jdW1lbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBQcmV2ZW50IGFkanVzdG1lbnRzIG9mIGZvbnQgc2l6ZSBhZnRlciBvcmllbnRhdGlvbiBjaGFuZ2VzIGluIGlPUy5cXG4gKi9cXG5cXG5odG1sIHtcXG4gICAgbGluZS1oZWlnaHQ6IDEuMTU7XFxuICAgIC8qIDEgKi9cXG4gICAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlO1xcbiAgICAvKiAyICovXFxufVxcblxcblxcbi8qIFNlY3Rpb25zXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcblxcbi8qKlxcbiAgICogUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuXFxuYm9keSB7XFxuICAgIG1hcmdpbjogMDtcXG59XFxuXFxuXFxuLyoqXFxuICAgKiBSZW5kZXIgdGhlIGBtYWluYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cXG4gICAqL1xcblxcbm1haW4ge1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuXFxuLyoqXFxuICAgKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBgaDFgIGVsZW1lbnRzIHdpdGhpbiBgc2VjdGlvbmAgYW5kXFxuICAgKiBgYXJ0aWNsZWAgY29udGV4dHMgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpLlxcbiAgICovXFxuXFxuaDEge1xcbiAgICBmb250LXNpemU6IDJlbTtcXG4gICAgbWFyZ2luOiAwLjY3ZW0gMDtcXG59XFxuXFxuXFxuLyogR3JvdXBpbmcgY29udGVudFxcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG5cXG4vKipcXG4gICAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXFxuICAgKiAyLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlIGFuZCBJRS5cXG4gICAqL1xcblxcbmhyIHtcXG4gICAgYm94LXNpemluZzogY29udGVudC1ib3g7XFxuICAgIC8qIDEgKi9cXG4gICAgaGVpZ2h0OiAwO1xcbiAgICAvKiAxICovXFxuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xcbiAgICAvKiAyICovXFxufVxcblxcblxcbi8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gICAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcblxcbnByZSB7XFxuICAgIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTtcXG4gICAgLyogMSAqL1xcbiAgICBmb250LXNpemU6IDFlbTtcXG4gICAgLyogMiAqL1xcbn1cXG5cXG5cXG4vKiBUZXh0LWxldmVsIHNlbWFudGljc1xcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG5cXG4vKipcXG4gICAqIFJlbW92ZSB0aGUgZ3JheSBiYWNrZ3JvdW5kIG9uIGFjdGl2ZSBsaW5rcyBpbiBJRSAxMC5cXG4gICAqL1xcblxcbmEge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG59XFxuXFxuXFxuLyoqXFxuICAgKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxcbiAgICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cXG4gICAqL1xcblxcbmFiYnJbdGl0bGVdIHtcXG4gICAgYm9yZGVyLWJvdHRvbTogbm9uZTtcXG4gICAgLyogMSAqL1xcbiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcXG4gICAgLyogMiAqL1xcbiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7XFxuICAgIC8qIDIgKi9cXG59XFxuXFxuXFxuLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxcbiAgICovXFxuXFxuYixcXG5zdHJvbmcge1xcbiAgICBmb250LXdlaWdodDogYm9sZGVyO1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG5cXG5jb2RlLFxcbmtiZCxcXG5zYW1wIHtcXG4gICAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlO1xcbiAgICAvKiAxICovXFxuICAgIGZvbnQtc2l6ZTogMWVtO1xcbiAgICAvKiAyICovXFxufVxcblxcblxcbi8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG5cXG5zbWFsbCB7XFxuICAgIGZvbnQtc2l6ZTogODAlO1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIFByZXZlbnQgYHN1YmAgYW5kIGBzdXBgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxcbiAgICogYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuXFxuc3ViLFxcbnN1cCB7XFxuICAgIGZvbnQtc2l6ZTogNzUlO1xcbiAgICBsaW5lLWhlaWdodDogMDtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcblxcbnN1YiB7XFxuICAgIGJvdHRvbTogLTAuMjVlbTtcXG59XFxuXFxuc3VwIHtcXG4gICAgdG9wOiAtMC41ZW07XFxufVxcblxcblxcbi8qIEVtYmVkZGVkIGNvbnRlbnRcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuXFxuLyoqXFxuICAgKiBSZW1vdmUgdGhlIGJvcmRlciBvbiBpbWFnZXMgaW5zaWRlIGxpbmtzIGluIElFIDEwLlxcbiAgICovXFxuXFxuaW1nIHtcXG4gICAgYm9yZGVyLXN0eWxlOiBub25lO1xcbn1cXG5cXG5cXG4vKiBGb3Jtc1xcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG5cXG4vKipcXG4gICAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICogMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxcbiAgICovXFxuXFxuYnV0dG9uLFxcbmlucHV0LFxcbm9wdGdyb3VwLFxcbnNlbGVjdCxcXG50ZXh0YXJlYSB7XFxuICAgIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xcbiAgICAvKiAxICovXFxuICAgIGZvbnQtc2l6ZTogMTAwJTtcXG4gICAgLyogMSAqL1xcbiAgICBsaW5lLWhlaWdodDogMS4xNTtcXG4gICAgLyogMSAqL1xcbiAgICBtYXJnaW46IDA7XFxuICAgIC8qIDIgKi9cXG59XFxuXFxuXFxuLyoqXFxuICAgKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cXG4gICAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXFxuICAgKi9cXG5cXG5idXR0b24sXFxuaW5wdXQge1xcbiAgICAvKiAxICovXFxuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxcbiAgICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxcbiAgICovXFxuXFxuYnV0dG9uLFxcbnNlbGVjdCB7XFxuICAgIC8qIDEgKi9cXG4gICAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XFxufVxcblxcblxcbi8qKlxcbiAgICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4gICAqL1xcblxcbmJ1dHRvbixcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl0sXFxuW3R5cGU9XFxcInJlc2V0XFxcIl0sXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdIHtcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XFxufVxcblxcblxcbi8qKlxcbiAgICogUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gICAqL1xcblxcbmJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcInJlc2V0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdOjotbW96LWZvY3VzLWlubmVyIHtcXG4gICAgYm9yZGVyLXN0eWxlOiBub25lO1xcbiAgICBwYWRkaW5nOiAwO1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIFJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cXG4gICAqL1xcblxcbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl06LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcInJlc2V0XFxcIl06LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdOi1tb3otZm9jdXNyaW5nIHtcXG4gICAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gICAqL1xcblxcbmZpZWxkc2V0IHtcXG4gICAgcGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIHRleHQgd3JhcHBpbmcgaW4gRWRnZSBhbmQgSUUuXFxuICAgKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gSUUuXFxuICAgKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XFxuICAgKiAgICBgZmllbGRzZXRgIGVsZW1lbnRzIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcblxcbmxlZ2VuZCB7XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICAgIC8qIDEgKi9cXG4gICAgY29sb3I6IGluaGVyaXQ7XFxuICAgIC8qIDIgKi9cXG4gICAgZGlzcGxheTogdGFibGU7XFxuICAgIC8qIDEgKi9cXG4gICAgbWF4LXdpZHRoOiAxMDAlO1xcbiAgICAvKiAxICovXFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIC8qIDMgKi9cXG4gICAgd2hpdGUtc3BhY2U6IG5vcm1hbDtcXG4gICAgLyogMSAqL1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXFxuICAgKi9cXG5cXG5wcm9ncmVzcyB7XFxuICAgIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuXFxuXFxuLyoqXFxuICAgKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cXG4gICAqL1xcblxcbnRleHRhcmVhIHtcXG4gICAgb3ZlcmZsb3c6IGF1dG87XFxufVxcblxcblxcbi8qKlxcbiAgICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gSUUgMTAuXFxuICAgKiAyLiBSZW1vdmUgdGhlIHBhZGRpbmcgaW4gSUUgMTAuXFxuICAgKi9cXG5cXG5bdHlwZT1cXFwiY2hlY2tib3hcXFwiXSxcXG5bdHlwZT1cXFwicmFkaW9cXFwiXSB7XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICAgIC8qIDEgKi9cXG4gICAgcGFkZGluZzogMDtcXG4gICAgLyogMiAqL1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIENvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIENocm9tZS5cXG4gICAqL1xcblxcblt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcXG5bdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xcbiAgICBoZWlnaHQ6IGF1dG87XFxufVxcblxcblxcbi8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXFxuICAgKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cXG4gICAqL1xcblxcblt0eXBlPVxcXCJzZWFyY2hcXFwiXSB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkO1xcbiAgICAvKiAxICovXFxuICAgIG91dGxpbmUtb2Zmc2V0OiAtMnB4O1xcbiAgICAvKiAyICovXFxufVxcblxcblxcbi8qKlxcbiAgICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxcbiAgICovXFxuXFxuW3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICAgKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIGBpbmhlcml0YCBpbiBTYWZhcmkuXFxuICAgKi9cXG5cXG4gOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xcbiAgICAvKiAxICovXFxuICAgIGZvbnQ6IGluaGVyaXQ7XFxuICAgIC8qIDIgKi9cXG59XFxuXFxuXFxuLyogSW50ZXJhY3RpdmVcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuXFxuLypcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFIDEwKywgYW5kIEZpcmVmb3guXFxuICAgKi9cXG5cXG5kZXRhaWxzIHtcXG4gICAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcblxcbi8qXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG5cXG5zdW1tYXJ5IHtcXG4gICAgZGlzcGxheTogbGlzdC1pdGVtO1xcbn1cXG5cXG5cXG4vKiBNaXNjXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcblxcbi8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTArLlxcbiAgICovXFxuXFxudGVtcGxhdGUge1xcbiAgICBkaXNwbGF5OiBub25lO1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxcbiAgICovXFxuXFxuW2hpZGRlbl0ge1xcbiAgICBkaXNwbGF5OiBub25lO1xcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BVF9SVUxFX0lNUE9SVF8wX19fIGZyb20gXCItIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbm9tYXJsaXplLmNzc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyA9IG5ldyBVUkwoXCIuLi9pbWFnZXMvbWFnbmlmeS5wbmdcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLmkoX19fQ1NTX0xPQURFUl9BVF9SVUxFX0lNUE9SVF8wX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYDpyb290IHtcbiAgICAtLWNsci1uZXV0cmFsOiBoc2woMCwgMCUsIDEwMCUpO1xuICAgIC0tY2xyLW5ldXRyYWwtdHJhbnNwOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMTcxKTtcbiAgICAtLWZmLXByaW1hcnk6ICdGcmVlaGFuZCcsIGN1cnNpdmU7XG4gICAgLyogZm9udCB3ZWlnaHQqL1xuICAgIC0tZnctMzAwOiAzMDA7XG4gICAgLS1mdy00MDA6IDQwMDtcbiAgICAtLWZ3LTUwMDogNTAwO1xuICAgIC0tZnctNjAwOiA2MDA7XG4gICAgLS1mdy03MDA6IDcwMDtcbn1cblxuKiB7XG4gICAgbWFyZ2luOiAwO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuYm9keSB7XG4gICAgd2lkdGg6IDEwMHZ3O1xuICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxNDIsIDIyNywgMjMzKTtcbiAgICBmb250LWZhbWlseTogdmFyKC0tZmYtcHJpbWFyeSk7XG4gICAgY29sb3I6ICNmZmZmZmY7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWZmLXByaW1hcnkpO1xuICAgIGZvbnQtc2l6ZTogMS4yNXJlbTtcbn1cblxubWFpbiB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBoZWlnaHQ6IDEwMHZoO1xuICAgIHdpZHRoOiAxMDB2dztcbiAgICBwYWRkaW5nOiA0cmVtIDJyZW07XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxuLnZpZGVvLWNvbnRhaW5lciB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogMDtcbiAgICBsZWZ0OiAwO1xuICAgIHdpZHRoOiAxMDB2dztcbiAgICBoZWlnaHQ6IDEwMHZoO1xuICAgIHotaW5kZXg6IC01O1xufVxuXG52aWRlbyB7XG4gICAgd2lkdGg6IDEwMHZ3O1xuICAgIGhlaWdodDogMTAwdmg7XG4gICAgb2JqZWN0LWZpdDogY292ZXI7XG59XG5cbi51bml0Qyxcbi51bml0RiB7XG4gICAgZm9udC1zaXplOiAwLjg1cmVtO1xuICAgIGhlaWdodDogMTZweDtcbiAgICB3aWR0aDogMTZweDtcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGNvbG9yOiBoc2woMCwgMCUsIDAlKTtcbiAgICB6LWluZGV4OiAyMDtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICB0ZXh0LXNoYWRvdzogbm9uZTtcbn1cblxuLnVuaXRGIHtcbiAgICBjb2xvcjogaHNsKDAsIDAlLCAxMDAlKTtcbn1cblxuLmNoZWNrYm94IHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAzcmVtO1xuICAgIGxlZnQ6IDNyZW07XG59XG5cbi5jaGVja2JveCB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIG9wYWNpdHk6IDA7XG59XG5cbi5sYWJlbCB7XG4gICAgYm9yZGVyLXJhZGl1czogNTBweDtcbiAgICB3aWR0aDogNTAwcHg7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgcGFkZGluZzogNXB4O1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICByaWdodDogNTBweDtcbiAgICBmbG9hdDogcmlnaHQ7XG4gICAgaGVpZ2h0OiAyNnB4O1xuICAgIHdpZHRoOiA1MHB4O1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMS41KTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMTExO1xufVxuXG4ubGFiZWwgLmJhbGwge1xuICAgIGhlaWdodDogMjBweDtcbiAgICB3aWR0aDogMjBweDtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogMnB4O1xuICAgIGxlZnQ6IDJweDtcbiAgICBiYWNrZ3JvdW5kOiAjZjVmNGY0O1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwcHgpO1xuICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjJzIGxpbmVhcjtcbn1cblxuLmNoZWNrYm94OmNoZWNrZWQrLmxhYmVsIC5iYWxsIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMjRweCk7XG59XG5cbi5zZWFyY2gtd3JhcHBlciB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogMTBweDtcbn1cblxuLnNlYXJjaC13cmFwcGVyIGlucHV0IHtcbiAgICB3aWR0aDogNDAlO1xuICAgIHBhZGRpbmc6IDEwcHggMTBweCAxMHB4IDQwcHg7XG4gICAgYm9yZGVyLXJhZGl1czogMnJlbTtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCR7X19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fX30pO1xuICAgIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogMTBweCBjZW50ZXI7XG4gICAgYmFja2dyb3VuZC1zaXplOiBjYWxjKDFyZW0gKyAwLjV2dyk7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG4gICAgdGV4dC1zaGFkb3c6IG5vbmU7XG59XG5cbiNlcnJvciB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgICBmb250LXNpemU6IDEuNXJlbTtcbiAgICBjb2xvcjogaHNsKDAsIDEwMCUsIDUwJSk7XG59XG5cbi5jaXR5LWluZm8gaDEge1xuICAgIG1hcmdpbjogMC4zcmVtIDA7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuMXJlbTtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy02MDApO1xuICAgIGZvbnQtc2l6ZTogMi41cmVtO1xufVxuXG5oMiB7XG4gICAgZm9udC1zaXplOiAxLjVyZW07XG4gICAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTMwMCk7XG59XG5cbi5jdXJyZW50LXdlYXRoZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG59XG5cbi5jdXJyZW50LXdlYXRoZXJfX2NvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbn1cblxuLmN1cnJlbnQtd2VhdGhlcl9fY29udGFpbmVyIGltZyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1zZWxmOiBzdGFydDtcbiAgICB3aWR0aDogY2FsYyg3cmVtICsgMTB2dyk7XG59XG5cbi5jdXJyZW50LXdlYXRoZXJfY29pbnRhaW5lciBoMSB7XG4gICAgbWFyZ2luOiAwLjNyZW0gMDtcbiAgICBmb250LXNpemU6IDRyZW07XG4gICAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTQwMCk7XG59XG5cbi5jdXJyZW50LXdlYXRoZXJfX3RlbXAge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuLmN1cnJlbnQtd2VhdGhlcl9fZGV0YWlscyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGFsaWduLXNlbGY6IGNlbnRlcjtcbiAgICBoZWlnaHQ6IG1heC1jb250ZW50O1xuICAgIHBhZGRpbmc6IDJyZW0gNHJlbTtcbiAgICBnYXA6IDRyZW07XG4gICAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNsci1uZXV0cmFsLXRyYW5zcCk7XG59XG5cbi5jdXJyZW50LXdlYXRoZXJfX2l0ZW0ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDAuNXJlbTtcbiAgICBmb250LXNpemU6IDEuNXJlbTtcbn1cblxuLmN1cnJlbnQtd2VhdGhlcl9faXRlbSBpbWcge1xuICAgIHdpZHRoOiBjYWxjKDFyZW0gKyAxdncpO1xufVxuXG4uY3VycmVudC13ZWF0aGVyX19kZXRhaWxzX19jb2x1bW4ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBnYXA6IDFyZW07XG59XG5cbi5mb3JlY2FzdCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBwYWRkaW5nOiAxcmVtIDJyZW07XG4gICAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNsci1uZXV0cmFsLXRyYW5zcCk7XG59XG5cbi5mb3JlY2FzdF9faXRlbSB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5mb3JlY2FzdF9faXRlbSBpbWcge1xuICAgIHdpZHRoOiBjYWxjKDJyZW0gKyAzdncpO1xufVxuXG4uY29sb3ItcmFpbiB7XG4gICAgY29sb3I6ICMxYzFkMWI7XG59XG5cbi5jb2xvci1taXN0IHtcbiAgICBjb2xvcjogIzA3MDcwNztcbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUNBO0lBQ0ksK0JBQStCO0lBQy9CLGdEQUFnRDtJQUNoRCxpQ0FBaUM7SUFDakMsZUFBZTtJQUNmLGFBQWE7SUFDYixhQUFhO0lBQ2IsYUFBYTtJQUNiLGFBQWE7SUFDYixhQUFhO0FBQ2pCOztBQUVBO0lBQ0ksU0FBUztJQUNULFVBQVU7SUFDVixzQkFBc0I7QUFDMUI7O0FBRUE7SUFDSSxZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLG9DQUFvQztJQUNwQyw4QkFBOEI7SUFDOUIsY0FBYztJQUNkLDhCQUE4QjtJQUM5QixrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLDZCQUE2QjtJQUM3QixrQkFBa0I7SUFDbEIsYUFBYTtJQUNiLFlBQVk7SUFDWixrQkFBa0I7SUFDbEIsZ0JBQWdCO0FBQ3BCOztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLE1BQU07SUFDTixPQUFPO0lBQ1AsWUFBWTtJQUNaLGFBQWE7SUFDYixXQUFXO0FBQ2Y7O0FBRUE7SUFDSSxZQUFZO0lBQ1osYUFBYTtJQUNiLGlCQUFpQjtBQUNyQjs7QUFFQTs7SUFFSSxrQkFBa0I7SUFDbEIsWUFBWTtJQUNaLFdBQVc7SUFDWCxrQkFBa0I7SUFDbEIsYUFBYTtJQUNiLHVCQUF1QjtJQUN2QixtQkFBbUI7SUFDbkIscUJBQXFCO0lBQ3JCLFdBQVc7SUFDWCxvQkFBb0I7SUFDcEIsaUJBQWlCO0FBQ3JCOztBQUVBO0lBQ0ksdUJBQXVCO0FBQzNCOztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLFNBQVM7SUFDVCxVQUFVO0FBQ2Q7O0FBRUE7SUFDSSxrQkFBa0I7SUFDbEIsVUFBVTtBQUNkOztBQUVBO0lBQ0ksbUJBQW1CO0lBQ25CLFlBQVk7SUFDWixlQUFlO0lBQ2YsYUFBYTtJQUNiLG1CQUFtQjtJQUNuQiw4QkFBOEI7SUFDOUIsWUFBWTtJQUNaLGtCQUFrQjtJQUNsQixXQUFXO0lBQ1gsWUFBWTtJQUNaLFlBQVk7SUFDWixXQUFXO0lBQ1gscUJBQXFCO0lBQ3JCLHNCQUFzQjtBQUMxQjs7QUFFQTtJQUNJLFlBQVk7SUFDWixXQUFXO0lBQ1gsa0JBQWtCO0lBQ2xCLGtCQUFrQjtJQUNsQixRQUFRO0lBQ1IsU0FBUztJQUNULG1CQUFtQjtJQUNuQiwwQkFBMEI7SUFDMUIsaUNBQWlDO0FBQ3JDOztBQUVBO0lBQ0ksMkJBQTJCO0FBQy9COztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25CLFNBQVM7QUFDYjs7QUFFQTtJQUNJLFVBQVU7SUFDViw0QkFBNEI7SUFDNUIsbUJBQW1CO0lBQ25CLFlBQVk7SUFDWix5REFBNEM7SUFDNUMsNEJBQTRCO0lBQzVCLGdDQUFnQztJQUNoQyxtQ0FBbUM7SUFDbkMsdUJBQXVCO0lBQ3ZCLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixpQkFBaUI7SUFDakIsd0JBQXdCO0FBQzVCOztBQUVBO0lBQ0ksZ0JBQWdCO0lBQ2hCLHNCQUFzQjtJQUN0Qix5QkFBeUI7SUFDekIsMEJBQTBCO0lBQzFCLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLGlCQUFpQjtJQUNqQiwwQkFBMEI7QUFDOUI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsNkJBQTZCO0FBQ2pDOztBQUVBO0lBQ0ksYUFBYTtBQUNqQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixpQkFBaUI7SUFDakIsd0JBQXdCO0FBQzVCOztBQUVBO0lBQ0ksZ0JBQWdCO0lBQ2hCLGVBQWU7SUFDZiwwQkFBMEI7QUFDOUI7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsa0JBQWtCO0lBQ2xCLG1CQUFtQjtJQUNuQixrQkFBa0I7SUFDbEIsU0FBUztJQUNULHFCQUFxQjtJQUNyQiwyQ0FBMkM7QUFDL0M7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLFdBQVc7SUFDWCxpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSx1QkFBdUI7QUFDM0I7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLFNBQVM7QUFDYjs7QUFFQTtJQUNJLGFBQWE7SUFDYiw2QkFBNkI7SUFDN0IsV0FBVztJQUNYLGtCQUFrQjtJQUNsQixxQkFBcUI7SUFDckIsMkNBQTJDO0FBQy9DOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixtQkFBbUI7QUFDdkI7O0FBRUE7SUFDSSx1QkFBdUI7QUFDM0I7O0FBRUE7SUFDSSxjQUFjO0FBQ2xCOztBQUVBO0lBQ0ksY0FBYztBQUNsQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAaW1wb3J0IHVybCguL25vbWFybGl6ZS5jc3MpO1xcbjpyb290IHtcXG4gICAgLS1jbHItbmV1dHJhbDogaHNsKDAsIDAlLCAxMDAlKTtcXG4gICAgLS1jbHItbmV1dHJhbC10cmFuc3A6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xNzEpO1xcbiAgICAtLWZmLXByaW1hcnk6ICdGcmVlaGFuZCcsIGN1cnNpdmU7XFxuICAgIC8qIGZvbnQgd2VpZ2h0Ki9cXG4gICAgLS1mdy0zMDA6IDMwMDtcXG4gICAgLS1mdy00MDA6IDQwMDtcXG4gICAgLS1mdy01MDA6IDUwMDtcXG4gICAgLS1mdy02MDA6IDYwMDtcXG4gICAgLS1mdy03MDA6IDcwMDtcXG59XFxuXFxuKiB7XFxuICAgIG1hcmdpbjogMDtcXG4gICAgcGFkZGluZzogMDtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG59XFxuXFxuYm9keSB7XFxuICAgIHdpZHRoOiAxMDB2dztcXG4gICAgbWluLWhlaWdodDogMTAwdmg7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxNDIsIDIyNywgMjMzKTtcXG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWZmLXByaW1hcnkpO1xcbiAgICBjb2xvcjogI2ZmZmZmZjtcXG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWZmLXByaW1hcnkpO1xcbiAgICBmb250LXNpemU6IDEuMjVyZW07XFxufVxcblxcbm1haW4ge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICBoZWlnaHQ6IDEwMHZoO1xcbiAgICB3aWR0aDogMTAwdnc7XFxuICAgIHBhZGRpbmc6IDRyZW0gMnJlbTtcXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcXG59XFxuXFxuLnZpZGVvLWNvbnRhaW5lciB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgdG9wOiAwO1xcbiAgICBsZWZ0OiAwO1xcbiAgICB3aWR0aDogMTAwdnc7XFxuICAgIGhlaWdodDogMTAwdmg7XFxuICAgIHotaW5kZXg6IC01O1xcbn1cXG5cXG52aWRlbyB7XFxuICAgIHdpZHRoOiAxMDB2dztcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXG4gICAgb2JqZWN0LWZpdDogY292ZXI7XFxufVxcblxcbi51bml0QyxcXG4udW5pdEYge1xcbiAgICBmb250LXNpemU6IDAuODVyZW07XFxuICAgIGhlaWdodDogMTZweDtcXG4gICAgd2lkdGg6IDE2cHg7XFxuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGNvbG9yOiBoc2woMCwgMCUsIDAlKTtcXG4gICAgei1pbmRleDogMjA7XFxuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbiAgICB0ZXh0LXNoYWRvdzogbm9uZTtcXG59XFxuXFxuLnVuaXRGIHtcXG4gICAgY29sb3I6IGhzbCgwLCAwJSwgMTAwJSk7XFxufVxcblxcbi5jaGVja2JveCB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgdG9wOiAzcmVtO1xcbiAgICBsZWZ0OiAzcmVtO1xcbn1cXG5cXG4uY2hlY2tib3gge1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIG9wYWNpdHk6IDA7XFxufVxcblxcbi5sYWJlbCB7XFxuICAgIGJvcmRlci1yYWRpdXM6IDUwcHg7XFxuICAgIHdpZHRoOiA1MDBweDtcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICAgIHBhZGRpbmc6IDVweDtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICByaWdodDogNTBweDtcXG4gICAgZmxvYXQ6IHJpZ2h0O1xcbiAgICBoZWlnaHQ6IDI2cHg7XFxuICAgIHdpZHRoOiA1MHB4O1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEuNSk7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMxMTE7XFxufVxcblxcbi5sYWJlbCAuYmFsbCB7XFxuICAgIGhlaWdodDogMjBweDtcXG4gICAgd2lkdGg6IDIwcHg7XFxuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICB0b3A6IDJweDtcXG4gICAgbGVmdDogMnB4O1xcbiAgICBiYWNrZ3JvdW5kOiAjZjVmNGY0O1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTtcXG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMnMgbGluZWFyO1xcbn1cXG5cXG4uY2hlY2tib3g6Y2hlY2tlZCsubGFiZWwgLmJhbGwge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMjRweCk7XFxufVxcblxcbi5zZWFyY2gtd3JhcHBlciB7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgZ2FwOiAxMHB4O1xcbn1cXG5cXG4uc2VhcmNoLXdyYXBwZXIgaW5wdXQge1xcbiAgICB3aWR0aDogNDAlO1xcbiAgICBwYWRkaW5nOiAxMHB4IDEwcHggMTBweCA0MHB4O1xcbiAgICBib3JkZXItcmFkaXVzOiAycmVtO1xcbiAgICBib3JkZXI6IG5vbmU7XFxuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybCguLi9pbWFnZXMvbWFnbmlmeS5wbmcpO1xcbiAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAxMHB4IGNlbnRlcjtcXG4gICAgYmFja2dyb3VuZC1zaXplOiBjYWxjKDFyZW0gKyAwLjV2dyk7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcbiAgICB0ZXh0LXNoYWRvdzogbm9uZTtcXG59XFxuXFxuI2Vycm9yIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG4gICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAgIGNvbG9yOiBoc2woMCwgMTAwJSwgNTAlKTtcXG59XFxuXFxuLmNpdHktaW5mbyBoMSB7XFxuICAgIG1hcmdpbjogMC4zcmVtIDA7XFxuICAgIGxldHRlci1zcGFjaW5nOiAwLjFyZW07XFxuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxuICAgIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy02MDApO1xcbiAgICBmb250LXNpemU6IDIuNXJlbTtcXG59XFxuXFxuaDIge1xcbiAgICBmb250LXNpemU6IDEuNXJlbTtcXG4gICAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTMwMCk7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXIge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9fY29udGFpbmVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9fY29udGFpbmVyIGltZyB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGFsaWduLXNlbGY6IHN0YXJ0O1xcbiAgICB3aWR0aDogY2FsYyg3cmVtICsgMTB2dyk7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfY29pbnRhaW5lciBoMSB7XFxuICAgIG1hcmdpbjogMC4zcmVtIDA7XFxuICAgIGZvbnQtc2l6ZTogNHJlbTtcXG4gICAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTQwMCk7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfX3RlbXAge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9fZGV0YWlscyB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGFsaWduLXNlbGY6IGNlbnRlcjtcXG4gICAgaGVpZ2h0OiBtYXgtY29udGVudDtcXG4gICAgcGFkZGluZzogMnJlbSA0cmVtO1xcbiAgICBnYXA6IDRyZW07XFxuICAgIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY2xyLW5ldXRyYWwtdHJhbnNwKTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9faXRlbSB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGdhcDogMC41cmVtO1xcbiAgICBmb250LXNpemU6IDEuNXJlbTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9faXRlbSBpbWcge1xcbiAgICB3aWR0aDogY2FsYygxcmVtICsgMXZ3KTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9fZGV0YWlsc19fY29sdW1uIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgZ2FwOiAxcmVtO1xcbn1cXG5cXG4uZm9yZWNhc3Qge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIHBhZGRpbmc6IDFyZW0gMnJlbTtcXG4gICAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbC10cmFuc3ApO1xcbn1cXG5cXG4uZm9yZWNhc3RfX2l0ZW0ge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4uZm9yZWNhc3RfX2l0ZW0gaW1nIHtcXG4gICAgd2lkdGg6IGNhbGMoMnJlbSArIDN2dyk7XFxufVxcblxcbi5jb2xvci1yYWluIHtcXG4gICAgY29sb3I6ICMxYzFkMWI7XFxufVxcblxcbi5jb2xvci1taXN0IHtcXG4gICAgY29sb3I6ICMwNzA3MDc7XFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIGlmICghdXJsKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICB1cmwgPSBTdHJpbmcodXJsLl9fZXNNb2R1bGUgPyB1cmwuZGVmYXVsdCA6IHVybCk7XG5cbiAgLy8gSWYgdXJsIGlzIGFscmVhZHkgd3JhcHBlZCBpbiBxdW90ZXMsIHJlbW92ZSB0aGVtXG4gIGlmICgvXlsnXCJdLipbJ1wiXSQvLnRlc3QodXJsKSkge1xuICAgIHVybCA9IHVybC5zbGljZSgxLCAtMSk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaGFzaCkge1xuICAgIHVybCArPSBvcHRpb25zLmhhc2g7XG4gIH1cblxuICAvLyBTaG91bGQgdXJsIGJlIHdyYXBwZWQ/XG4gIC8vIFNlZSBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXZhbHVlcy0zLyN1cmxzXG4gIGlmICgvW1wiJygpIFxcdFxcbl18KCUyMCkvLnRlc3QodXJsKSB8fCBvcHRpb25zLm5lZWRRdW90ZXMpIHtcbiAgICByZXR1cm4gXCJcXFwiXCIuY29uY2F0KHVybC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIiksIFwiXFxcIlwiKTtcbiAgfVxuICByZXR1cm4gdXJsO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyYztcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSB7XG5cdFx0XHR2YXIgaSA9IHNjcmlwdHMubGVuZ3RoIC0gMTtcblx0XHRcdHdoaWxlIChpID4gLTEgJiYgIXNjcmlwdFVybCkgc2NyaXB0VXJsID0gc2NyaXB0c1tpLS1dLnNyYztcblx0XHR9XG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsIl9fd2VicGFja19yZXF1aXJlX18uYiA9IGRvY3VtZW50LmJhc2VVUkkgfHwgc2VsZi5sb2NhdGlvbi5ocmVmO1xuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG4vLyBubyBvbiBjaHVua3MgbG9hZGVkXG5cbi8vIG5vIGpzb25wIGZ1bmN0aW9uIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgJy4uL3N0eWxlcy9zdHlsZS5jc3MnO1xuaW1wb3J0IE1haW5Nb2RlbCBmcm9tICcuL21vZGVscy9tYWluTW9kZWwnO1xuaW1wb3J0IE1haW5WaWV3IGZyb20gJy4vdmlld3MvbWFpblZpZXcnXG5pbXBvcnQgTWFpbkNvbnRyb2xsZXIgZnJvbSAnLi9jb250cm9sbGVycy9tYWluQ29udHJvbGxlcic7XG5cblxuY29uc3QgbW9kZWwgPSBuZXcgTWFpbk1vZGVsKCk7XG5jb25zdCB2aWV3ID0gbmV3IE1haW5WaWV3KCk7XG5jb25zdCBjb250cm9sbGVyID0gbmV3IE1haW5Db250cm9sbGVyKG1vZGVsLCB2aWV3KTsiXSwibmFtZXMiOlsiTWFpbkNvbnRyb2xsZXIiLCJjb25zdHJ1Y3RvciIsIm1vZGVsIiwidmlldyIsImNpdHkiLCJ1bml0IiwibG9hZHBhZ2UiLCJjaXR5SW5mbyIsImdldENpdHlJbmZvIiwiY3VycmVudFdlYXRoZXIiLCJnZXRDdXJyZW50V2VhdGhlciIsImZvcmVjYXN0V2VhdGhlciIsImdldEZvcmVjYXN0V2VhdGhlciIsImFwcGVuZENpdHlJbmZvIiwiYXBwZW5kQ3VycnJlbnRXZWF0aGVyIiwiYXBwZW5kRm9yZWNhc3RXZWF0aGVyIiwiQVBJcyIsInVybEdlbmVyYXRvciIsIlVybEdlbmVyZXRvciIsImdldEdlb0Nvb3JkaW5hdGVzIiwidXJsIiwiZ2VuZXJhdGVHZW9Db29yZHNVcmwiLCJyZXNwb25zZSIsImZldGNoIiwibW9kZSIsImdlb0NvZGluZ0RhdGEiLCJqc29uIiwibGF0IiwibG9uIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInN0eWxlIiwiZGlzcGxheSIsImVycm9yIiwiY29uc29sZSIsImxvZyIsImdldEN1cnJlbnRXZWF0aGVyRGF0YSIsImdlbmVyYXRlQ3VycmVudFdlYXRoZXIiLCJ3ZWF0aGVyRGF0YSIsImdldEZvcmVjYXN0V2VhdGhlckRhdGEiLCJnZW5lcmF0ZUZvcmVjYXN0V2VhdGhlciIsImZvcmVjYXN0RGF0YSIsImFwcElkIiwiYmFzZVVybCIsIkNpdHlJbmZvIiwiQXBpRGF0YSIsImNpdHlEZXNjcmlwdGlvbiIsImNyZWF0ZUNpdHlEZXNjcmlwdGlvbiIsImRhdGVEZXNjcmlwdGlvbiIsImNyZWF0ZURhdGVEZXNjcmlwdGlvbiIsIm5hbWUiLCJjb3VudHJ5Iiwic3lzIiwiZGF5IiwiZ2V0RGF5IiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwid2Vla2RheSIsImQiLCJEYXRlIiwibW9udGhOYW1lcyIsIkN1cnJlbnRXZWF0aGVyIiwiY3VycmVudFdlYXRoZXJEYXRhIiwidGVtcGVyYXR1cmUiLCJnZXRUZW1wZXJhdHVyZSIsIk1hdGgiLCJyb3VuZCIsIm1haW4iLCJ0ZW1wIiwiZmVlbHNMaWtlVGVtcCIsImZlZWxzX2xpa2UiLCJodW1pZGl0eSIsIndpbmRTcGVlZCIsIndpbmQiLCJzcGVlZCIsInByZXNzdXJlIiwic3VucmlzZSIsImNvbnZlcnRUb1NlYXJjaGVkQ2l0eVRpbWUiLCJ0aW1lem9uZSIsInN1bnNldCIsIndlYXRoZXJDb25kaXRpb25EZXNjIiwid2VhdGhlciIsImRlc2NyaXB0aW9uIiwid2VhdGhlckNvbmRpdGlvbkltZyIsImdldHdlYXRoZXJDb25kaXRpb25JbWciLCJiYWNrZ3JvdW5kVmlkZW8iLCJnZXRCYWNrZ3JvdW5kVmlkZW8iLCJkZWdyZWVzIiwiY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZSIsInVuaXhUaW1lIiwibG9jYWxEYXRlIiwidXRjVW5peFRpbWUiLCJnZXRUaW1lIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJ1bml4VGltZUluU2VhcmNoZWRDaXR5IiwiZGF0ZUluU2VhcmNoZWRDaXR5IiwiaG91cnMiLCJnZXRIb3VycyIsIm1pbnV0ZXMiLCJnZXRNaW51dGVzIiwiZm9ybWF0dGVkVGltZSIsInZhbHVlIiwic3VucmlzZVVuaXgiLCJzdW5zZXRVbml4IiwibWlzdEVxdWl2YWxlbnRlcyIsImluY2x1ZGVzIiwiY3VycmVudERhdGUiLCJzdW5yaXNlRGF0ZSIsInN1bnNldERhdGUiLCJ3ZWF0aGVyQ29uZGl0aW9uIiwidmlkZW9MaW5rcyIsIkNsZWFyRGF5IiwiQ2xlYXJOaWdodCIsIkNsb3VkcyIsIk1pc3QiLCJSYWluIiwiVGh1bmRlcnN0b3JtIiwiRm9yZWNhc3RXZWF0aGVyIiwiZm9yZWNhc3RXZWF0aGVyRGF0YSIsInRlbXBlcmF0dXJlcyIsImxpc3QiLCJmb3JFYWNoIiwiaXRlbSIsInRlbXBXaXRoVW5pdCIsImdldFRlbXBlcmF0dXJlVW5pdCIsInB1c2giLCJkZWdyZWUiLCJNYWluTW9kZWwiLCJkYXRhIiwiQ2l0eUluZm9WaWV3IiwiZWxlbWVudCIsImNpdHlJbmZvTW9kZWwiLCJxdWVyeVNlbGVjdG9yIiwidGV4dENvbnRlbnQiLCJDdXJyZW50V2VhdGhlclZpZXciLCJjdXJyZW50V2VhdGhlck1vZGVsIiwid2VhdGhlckNvbG9yIiwiYm9keSIsImNsYXNzTGlzdCIsImFkZCIsInNyYyIsIkZvcmVjYXN0V2VhdGhlclZpZXciLCJmb3JlY2FzdFdlYXRoZXJNb2RlbCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpIiwiTWFpblZpZXciLCJjb250cm9sbGVyIl0sInNvdXJjZVJvb3QiOiIifQ==