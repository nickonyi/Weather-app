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
    this.city = "";
    this.loadpage(this.city);
  }
  async loadpage(city) {
    this.city = city;
    const cityInfo = await this.model.getCityInfo(city, this.unit);
    const currentWeather = await this.model.getCurrentWeather(city, this.unit);
    console.log(currentWeather);
    this.view.appendCityInfo(cityInfo);
    this.view.appendCurrrentWeather(currentWeather);
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
        mode: "cors"
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


class MainView {
  appendCityInfo(cityInfo) {
    const element = document.getElementById('city-info');
    new _cityInfoView__WEBPACK_IMPORTED_MODULE_0__["default"](element, cityInfo);
  }
  appendCurrrentWeather(currentWeather) {
    const element = document.getElementById("current-weather");
    new _currentWeatherView__WEBPACK_IMPORTED_MODULE_1__["default"](element, currentWeather);
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
    color: #205c14;
}

.color-mist {
    color: #5c949e;
}`, "",{"version":3,"sources":["webpack://./src/styles/style.css"],"names":[],"mappings":"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","sourcesContent":["@import url(./nomarlize.css);\n:root {\n    --clr-neutral: hsl(0, 0%, 100%);\n    --clr-neutral-transp: rgba(255, 255, 255, 0.171);\n    --ff-primary: 'Freehand', cursive;\n    /* font weight*/\n    --fw-300: 300;\n    --fw-400: 400;\n    --fw-500: 500;\n    --fw-600: 600;\n    --fw-700: 700;\n}\n\n* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nbody {\n    width: 100vw;\n    min-height: 100vh;\n    background-color: rgb(142, 227, 233);\n    font-family: var(--ff-primary);\n    color: #ffffff;\n    font-family: var(--ff-primary);\n    font-size: 1.25rem;\n}\n\nmain {\n    display: flex;\n    flex-direction: column;\n    justify-content: space-evenly;\n    position: relative;\n    height: 100vh;\n    width: 100vw;\n    padding: 4rem 2rem;\n    overflow: hidden;\n}\n\n.video-container {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100vw;\n    height: 100vh;\n    z-index: -5;\n}\n\nvideo {\n    width: 100vw;\n    height: 100vh;\n    object-fit: cover;\n}\n\n.unitC,\n.unitF {\n    font-size: 0.85rem;\n    height: 16px;\n    width: 16px;\n    border-radius: 8px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    color: hsl(0, 0%, 0%);\n    z-index: 20;\n    pointer-events: none;\n    text-shadow: none;\n}\n\n.unitF {\n    color: hsl(0, 0%, 100%);\n}\n\n.checkbox {\n    position: absolute;\n    top: 3rem;\n    left: 3rem;\n}\n\n.checkbox {\n    position: absolute;\n    opacity: 0;\n}\n\n.label {\n    border-radius: 50px;\n    width: 500px;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 5px;\n    position: relative;\n    right: 50px;\n    float: right;\n    height: 26px;\n    width: 50px;\n    transform: scale(1.5);\n    background-color: #111;\n}\n\n.label .ball {\n    height: 20px;\n    width: 20px;\n    border-radius: 50%;\n    position: absolute;\n    top: 2px;\n    left: 2px;\n    background: #f5f4f4;\n    transform: translateX(0px);\n    transition: transform 0.2s linear;\n}\n\n.checkbox:checked+.label .ball {\n    transform: translateX(24px);\n}\n\n.search-wrapper {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    gap: 10px;\n}\n\n.search-wrapper input {\n    width: 40%;\n    padding: 10px 10px 10px 40px;\n    border-radius: 2rem;\n    border: none;\n    background-image: url(../images/magnify.png);\n    background-repeat: no-repeat;\n    background-position: 10px center;\n    background-size: calc(1rem + 0.5vw);\n    background-color: white;\n    text-shadow: none;\n}\n\n#error {\n    display: none;\n    font-size: 1.5rem;\n    color: hsl(0, 100%, 50%);\n}\n\n.city-info h1 {\n    margin: 0.3rem 0;\n    letter-spacing: 0.1rem;\n    text-transform: uppercase;\n    font-weight: var(--fw-600);\n    font-size: 2.5rem;\n}\n\nh2 {\n    font-size: 1.5rem;\n    font-weight: var(--fw-300);\n}\n\n.current-weather {\n    display: flex;\n    justify-content: space-around;\n}\n\n.current-weather__container {\n    display: flex;\n}\n\n.current-weather__container img {\n    display: flex;\n    align-self: start;\n    width: calc(7rem + 10vw);\n}\n\n.current-weather_cointainer h1 {\n    margin: 0.3rem 0;\n    font-size: 4rem;\n    font-weight: var(--fw-400);\n}\n\n.current-weather__temp {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n}\n\n.current-weather__details {\n    display: flex;\n    align-items: center;\n    align-self: center;\n    height: max-content;\n    padding: 2rem 4rem;\n    gap: 4rem;\n    border-radius: 0.5rem;\n    background-color: var(--clr-neutral-transp);\n}\n\n.current-weather__item {\n    display: flex;\n    align-items: center;\n    gap: 0.5rem;\n    font-size: 1.5rem;\n}\n\n.current-weather__item img {\n    width: calc(1rem + 1vw);\n}\n\n.current-weather__details__column {\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n}\n\n.forecast {\n    display: flex;\n    justify-content: space-around;\n    width: 100%;\n    padding: 1rem 2rem;\n    border-radius: 0.5rem;\n    background-color: var(--clr-neutral-transp);\n}\n\n.forecast__item {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n}\n\n.forecast__item img {\n    width: calc(2rem + 3vw);\n}\n\n.color-rain {\n    color: #205c14;\n}\n\n.color-mist {\n    color: #5c949e;\n}"],"sourceRoot":""}]);
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
const d = new Date();
console.log(d);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFlLE1BQU1BLGNBQWMsQ0FBQztFQUNoQ0MsV0FBV0EsQ0FBQ0MsS0FBSyxFQUFFQyxJQUFJLEVBQUU7SUFDckIsSUFBSSxDQUFDRCxLQUFLLEdBQUdBLEtBQUs7SUFDbEIsSUFBSSxDQUFDQyxJQUFJLEdBQUdBLElBQUk7SUFDaEIsSUFBSSxDQUFDQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsSUFBSSxDQUFDQyxJQUFJLEdBQUcsUUFBUTtJQUNwQixJQUFJLENBQUNELElBQUksR0FBRyxFQUFFO0lBQ2QsSUFBSSxDQUFDRSxRQUFRLENBQUMsSUFBSSxDQUFDRixJQUFJLENBQUM7RUFHNUI7RUFHQSxNQUFNRSxRQUFRQSxDQUFDRixJQUFJLEVBQUU7SUFDakIsSUFBSSxDQUFDQSxJQUFJLEdBQUdBLElBQUk7SUFFaEIsTUFBTUcsUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDTCxLQUFLLENBQUNNLFdBQVcsQ0FBQ0osSUFBSSxFQUFFLElBQUksQ0FBQ0MsSUFBSSxDQUFDO0lBQzlELE1BQU1JLGNBQWMsR0FBRyxNQUFNLElBQUksQ0FBQ1AsS0FBSyxDQUFDUSxpQkFBaUIsQ0FBQ04sSUFBSSxFQUFFLElBQUksQ0FBQ0MsSUFBSSxDQUFDO0lBRTFFTSxPQUFPLENBQUNDLEdBQUcsQ0FBQ0gsY0FBYyxDQUFDO0lBQzNCLElBQUksQ0FBQ04sSUFBSSxDQUFDVSxjQUFjLENBQUNOLFFBQVEsQ0FBQztJQUNsQyxJQUFJLENBQUNKLElBQUksQ0FBQ1cscUJBQXFCLENBQUNMLGNBQWMsQ0FBQztFQUNuRDtBQUNKOzs7Ozs7Ozs7Ozs7OztBQ3ZCZSxNQUFNTSxJQUFJLENBQUM7RUFDdEJkLFdBQVdBLENBQUEsRUFBRztJQUNWLElBQUksQ0FBQ2UsWUFBWSxHQUFHLElBQUlDLFlBQVksQ0FBQyxrQ0FBa0MsQ0FBQztFQUM1RTtFQUVBLE1BQU1DLGlCQUFpQkEsQ0FBQ2QsSUFBSSxFQUFFO0lBQzFCLElBQUk7TUFDQSxNQUFNZSxHQUFHLEdBQUcsSUFBSSxDQUFDSCxZQUFZLENBQUNJLG9CQUFvQixDQUFDaEIsSUFBSSxDQUFDO01BQ3hELE1BQU1pQixRQUFRLEdBQUcsTUFBTUMsS0FBSyxDQUFDSCxHQUFHLEVBQUU7UUFBRUksSUFBSSxFQUFFO01BQU8sQ0FBQyxDQUFDO01BQ25ELE1BQU1DLGFBQWEsR0FBRyxNQUFNSCxRQUFRLENBQUNJLElBQUksQ0FBQyxDQUFDO01BQzNDLE1BQU07UUFBRUMsR0FBRztRQUFFQztNQUFJLENBQUMsR0FBR0gsYUFBYSxDQUFDLENBQUMsQ0FBQztNQUNyQ0ksUUFBUSxDQUFDQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUNDLEtBQUssQ0FBQ0MsT0FBTyxHQUFHLE1BQU07TUFDdkQsT0FBTztRQUFFTCxHQUFHO1FBQUVDO01BQUksQ0FBQztJQUV2QixDQUFDLENBQUMsT0FBT0ssS0FBSyxFQUFFO01BQ1pyQixPQUFPLENBQUNDLEdBQUcsQ0FBQ29CLEtBQUssQ0FBQztNQUNsQkosUUFBUSxDQUFDQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUNDLEtBQUssQ0FBQ0MsT0FBTyxHQUFHLE9BQU87TUFDeEQsT0FBTyxJQUFJO0lBQ2Y7RUFDSjtFQUNBLE1BQU1FLHFCQUFxQkEsQ0FBQzdCLElBQUksRUFBRUMsSUFBSSxFQUFFO0lBQ3BDLElBQUk7TUFDQSxNQUFNO1FBQUVxQixHQUFHO1FBQUVDO01BQUksQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDVCxpQkFBaUIsQ0FBQ2QsSUFBSSxDQUFDO01BQ3ZELE1BQU1lLEdBQUcsR0FBRyxJQUFJLENBQUNILFlBQVksQ0FBQ2tCLHNCQUFzQixDQUFDUixHQUFHLEVBQUVDLEdBQUcsRUFBRXRCLElBQUksQ0FBQztNQUNwRSxNQUFNZ0IsUUFBUSxHQUFHLE1BQU1DLEtBQUssQ0FBQ0gsR0FBRyxFQUFFO1FBQUVJLElBQUksRUFBRTtNQUFPLENBQUMsQ0FBQztNQUNuRCxNQUFNWSxXQUFXLEdBQUcsTUFBTWQsUUFBUSxDQUFDSSxJQUFJLENBQUMsQ0FBQztNQUN6Q0csUUFBUSxDQUFDQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUNDLEtBQUssQ0FBQ0MsT0FBTyxHQUFHLE1BQU07TUFDdkQsT0FBT0ksV0FBVztJQUN0QixDQUFDLENBQUMsT0FBT0gsS0FBSyxFQUFFO01BQ1pyQixPQUFPLENBQUNDLEdBQUcsQ0FBQ29CLEtBQUssQ0FBQztNQUNsQkosUUFBUSxDQUFDQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUNDLEtBQUssQ0FBQ0MsT0FBTyxHQUFHLE9BQU87TUFDeEQsT0FBTyxJQUFJO0lBQ2Y7RUFDSjtFQUVBLE1BQU1LLHNCQUFzQkEsQ0FBQ2hDLElBQUksRUFBRUMsSUFBSSxFQUFFO0lBQ3JDLElBQUk7TUFDQSxNQUFNO1FBQUVxQixHQUFHO1FBQUVDO01BQUksQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDVCxpQkFBaUIsQ0FBQ2QsSUFBSSxDQUFDO01BQ3ZELE1BQU1lLEdBQUcsR0FBRyxJQUFJLENBQUNILFlBQVksQ0FBQ3FCLHVCQUF1QixDQUFDWCxHQUFHLEVBQUVDLEdBQUcsRUFBRXRCLElBQUksQ0FBQztNQUNyRSxNQUFNZ0IsUUFBUSxHQUFHLE1BQU1DLEtBQUssQ0FBQ0gsR0FBRyxFQUFFO1FBQUVJLElBQUksRUFBRTtNQUFPLENBQUMsQ0FBQztNQUNuRCxNQUFNZSxZQUFZLEdBQUcsTUFBTWpCLFFBQVEsQ0FBQ0ksSUFBSSxDQUFDLENBQUM7TUFDMUNHLFFBQVEsQ0FBQ0MsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDQyxLQUFLLENBQUNDLE9BQU8sR0FBRyxNQUFNO01BQ3ZELE9BQU9PLFlBQVk7SUFDdkIsQ0FBQyxDQUFDLE9BQU9OLEtBQUssRUFBRTtNQUNackIsT0FBTyxDQUFDQyxHQUFHLENBQUNvQixLQUFLLENBQUM7TUFDbEJKLFFBQVEsQ0FBQ0MsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDQyxLQUFLLENBQUNDLE9BQU8sR0FBRyxPQUFPO01BQ3hELE9BQU8sSUFBSTtJQUNmO0VBQ0o7QUFDSjtBQUVBLE1BQU1kLFlBQVksQ0FBQztFQUNmaEIsV0FBV0EsQ0FBQ3NDLEtBQUssRUFBRTtJQUNmLElBQUksQ0FBQ0MsT0FBTyxHQUFHLGdDQUFnQztJQUMvQyxJQUFJLENBQUNELEtBQUssR0FBR0EsS0FBSztFQUN0QjtFQUNBbkIsb0JBQW9CQSxDQUFDaEIsSUFBSSxFQUFFO0lBQ3ZCLE9BQVEsR0FBRSxJQUFJLENBQUNvQyxPQUFRLHFCQUFvQnBDLElBQUssVUFBUyxJQUFJLENBQUNtQyxLQUFNLEVBQUM7RUFDekU7RUFDQUwsc0JBQXNCQSxDQUFDUixHQUFHLEVBQUVDLEdBQUcsRUFBRXRCLElBQUksRUFBRTtJQUNuQyxPQUFRLEdBQUUsSUFBSSxDQUFDbUMsT0FBUSx5QkFBd0JkLEdBQUksUUFBT0MsR0FBSSxVQUFTLElBQUksQ0FBQ1ksS0FBTSxVQUFTbEMsSUFBSyxFQUFDO0VBQ3JHO0VBQ0FnQyx1QkFBdUJBLENBQUNYLEdBQUcsRUFBRUMsR0FBRyxFQUFFdEIsSUFBSSxFQUFFO0lBQ3BDLE9BQVEsR0FBRSxJQUFJLENBQUNtQyxPQUFRLDBCQUF5QmQsR0FBSSxRQUFPQyxHQUFJLGVBQWMsSUFBSSxDQUFDWSxLQUFNLFVBQVNsQyxJQUFLLEVBQUM7RUFDM0c7QUFDSjs7Ozs7Ozs7Ozs7Ozs7QUNqRWUsTUFBTW9DLFFBQVEsQ0FBQztFQUMxQnhDLFdBQVdBLENBQUN5QyxPQUFPLEVBQUU7SUFDakIsSUFBSSxDQUFDQyxlQUFlLEdBQUcsSUFBSSxDQUFDQyxxQkFBcUIsQ0FBQ0YsT0FBTyxDQUFDO0lBQzFELElBQUksQ0FBQ0csZUFBZSxHQUFHLElBQUksQ0FBQ0MscUJBQXFCLENBQUNKLE9BQU8sQ0FBQztFQUU5RDtFQUVBRSxxQkFBcUJBLENBQUNGLE9BQU8sRUFBRTtJQUMzQixNQUFNdEMsSUFBSSxHQUFHc0MsT0FBTyxDQUFDSyxJQUFJO0lBQ3pCLE1BQU07TUFBRUM7SUFBUSxDQUFDLEdBQUdOLE9BQU8sQ0FBQ08sR0FBRztJQUUvQixPQUFRLEdBQUU3QyxJQUFLLEtBQUk0QyxPQUFRLEVBQUM7RUFDaEM7RUFFQUYscUJBQXFCQSxDQUFDSixPQUFPLEVBQUU7SUFDM0IsTUFBTVEsR0FBRyxHQUFHLElBQUksQ0FBQ0MsTUFBTSxDQUFDLENBQUM7SUFDekIsTUFBTUMsS0FBSyxHQUFHLElBQUksQ0FBQ0MsUUFBUSxDQUFDLENBQUM7SUFDN0IsTUFBTUMsSUFBSSxHQUFHLElBQUksQ0FBQ0MsT0FBTyxDQUFDLENBQUM7SUFFM0IsT0FBUSxHQUFFTCxHQUFJLEtBQUlFLEtBQU0sSUFBR0UsSUFBSyxFQUFDO0VBQ3JDO0VBRUFILE1BQU1BLENBQUEsRUFBRztJQUNMLE1BQU1LLE9BQU8sR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQztJQUM5RixNQUFNQyxDQUFDLEdBQUcsSUFBSUMsSUFBSSxDQUFDLENBQUM7SUFDcEIsTUFBTVIsR0FBRyxHQUFHTSxPQUFPLENBQUNDLENBQUMsQ0FBQ04sTUFBTSxDQUFDLENBQUMsQ0FBQztJQUMvQixPQUFPRCxHQUFHO0VBQ2Q7RUFFQUcsUUFBUUEsQ0FBQSxFQUFHO0lBQ1AsTUFBTU0sVUFBVSxHQUFHLENBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixPQUFPLEVBQ1AsT0FBTyxFQUNQLEtBQUssRUFDTCxNQUFNLEVBQ04sTUFBTSxFQUNOLFFBQVEsRUFDUixXQUFXLEVBQ1gsU0FBUyxFQUNULFVBQVUsRUFDVixVQUFVLENBQ2I7SUFDRCxNQUFNRixDQUFDLEdBQUcsSUFBSUMsSUFBSSxDQUFDLENBQUM7SUFDcEIsTUFBTU4sS0FBSyxHQUFHTyxVQUFVLENBQUNGLENBQUMsQ0FBQ0osUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN0QyxPQUFPRCxLQUFLO0VBQ2hCO0VBQ0FHLE9BQU9BLENBQUEsRUFBRztJQUNOLE1BQU1FLENBQUMsR0FBRyxJQUFJQyxJQUFJLENBQUMsQ0FBQztJQUNwQixNQUFNSixJQUFJLEdBQUdHLENBQUMsQ0FBQ0YsT0FBTyxDQUFDLENBQUM7SUFDeEIsT0FBT0QsSUFBSTtFQUNmO0FBRUo7Ozs7Ozs7Ozs7Ozs7O0FDdERlLE1BQU1NLGNBQWMsQ0FBQztFQUNoQzNELFdBQVdBLENBQUM0RCxrQkFBa0IsRUFBRXhELElBQUksRUFBRTtJQUNsQyxJQUFJLENBQUN5RCxXQUFXLEdBQUcsSUFBSSxDQUFDQyxjQUFjLENBQUNDLElBQUksQ0FBQ0MsS0FBSyxDQUFDSixrQkFBa0IsQ0FBQ0ssSUFBSSxDQUFDQyxJQUFJLENBQUMsRUFBRTlELElBQUksQ0FBQztJQUN0RixJQUFJLENBQUMrRCxhQUFhLEdBQUcsSUFBSSxDQUFDTCxjQUFjLENBQUNDLElBQUksQ0FBQ0MsS0FBSyxDQUFDSixrQkFBa0IsQ0FBQ0ssSUFBSSxDQUFDRyxVQUFVLENBQUMsRUFBRWhFLElBQUksQ0FBQztJQUM5RixJQUFJLENBQUNpRSxRQUFRLEdBQUksR0FBRVQsa0JBQWtCLENBQUNLLElBQUksQ0FBQ0ksUUFBUyxHQUFFO0lBQ3RELElBQUksQ0FBQ0MsU0FBUyxHQUFJLEdBQUVWLGtCQUFrQixDQUFDVyxJQUFJLENBQUNDLEtBQU0sS0FBSTtJQUN0RCxJQUFJLENBQUNDLFFBQVEsR0FBSSxHQUFFYixrQkFBa0IsQ0FBQ0ssSUFBSSxDQUFDUSxRQUFTLE1BQUs7SUFDekQsSUFBSSxDQUFDQyxPQUFPLEdBQUcsSUFBSSxDQUFDQyx5QkFBeUIsQ0FBQ2Ysa0JBQWtCLENBQUNaLEdBQUcsQ0FBQzBCLE9BQU8sRUFBRWQsa0JBQWtCLENBQUNnQixRQUFRLENBQUM7SUFDMUcsSUFBSSxDQUFDQyxNQUFNLEdBQUcsSUFBSSxDQUFDRix5QkFBeUIsQ0FBQ2Ysa0JBQWtCLENBQUNaLEdBQUcsQ0FBQzZCLE1BQU0sRUFBRWpCLGtCQUFrQixDQUFDZ0IsUUFBUSxDQUFDO0lBQ3hHLElBQUksQ0FBQ0Usb0JBQW9CLEdBQUdsQixrQkFBa0IsQ0FBQ21CLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsV0FBVztJQUNyRSxJQUFJLENBQUNDLG1CQUFtQixHQUFHLElBQUksQ0FBQ0Msc0JBQXNCLENBQ2xEdEIsa0JBQWtCLENBQUNtQixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUNkLElBQUksRUFDbENMLGtCQUFrQixDQUFDWixHQUFHLENBQUMwQixPQUFPLEVBQzlCZCxrQkFBa0IsQ0FBQ1osR0FBRyxDQUFDNkIsTUFBTSxFQUM3QmpCLGtCQUFrQixDQUFDZ0IsUUFDdkIsQ0FBQztJQUNELElBQUksQ0FBQ08sZUFBZSxHQUFHLElBQUksQ0FBQ0Msa0JBQWtCLENBQUMsSUFBSSxDQUFDSCxtQkFBbUIsQ0FBQztFQUU1RTtFQUVBbkIsY0FBY0EsQ0FBQ3VCLE9BQU8sRUFBRWpGLElBQUksRUFBRTtJQUMxQixPQUFPQSxJQUFJLEtBQUssUUFBUSxHQUFJLEdBQUVpRixPQUFRLElBQUcsR0FBSSxHQUFFQSxPQUFRLElBQUc7RUFDOUQ7RUFFQUMseUJBQXlCQSxDQUFDQyxRQUFRLEVBQUVYLFFBQVEsRUFBRTtJQUMxQyxNQUFNWSxTQUFTLEdBQUdELFFBQVEsS0FBSyxDQUFDLEdBQUcsSUFBSTlCLElBQUksQ0FBRCxDQUFDLEdBQUcsSUFBSUEsSUFBSSxDQUFDOEIsUUFBUSxHQUFHLElBQUksQ0FBQztJQUN2RSxNQUFNRSxXQUFXLEdBQUdELFNBQVMsQ0FBQ0UsT0FBTyxDQUFDLENBQUMsR0FBSUYsU0FBUyxDQUFDRyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsS0FBTTtJQUNqRixNQUFNQyxzQkFBc0IsR0FBR0gsV0FBVyxHQUFHYixRQUFRLEdBQUcsSUFBSTtJQUM1RCxNQUFNaUIsa0JBQWtCLEdBQUcsSUFBSXBDLElBQUksQ0FBQ21DLHNCQUFzQixDQUFDO0lBQzNELE9BQU9DLGtCQUFrQjtFQUM3QjtFQUVBbEIseUJBQXlCQSxDQUFDWSxRQUFRLEVBQUVYLFFBQVEsRUFBRTtJQUMxQyxNQUFNaUIsa0JBQWtCLEdBQUcsSUFBSSxDQUFDUCx5QkFBeUIsQ0FBQ0MsUUFBUSxFQUFFWCxRQUFRLENBQUM7SUFDN0UsTUFBTWtCLEtBQUssR0FBR0Qsa0JBQWtCLENBQUNFLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLE1BQU1DLE9BQU8sR0FBSSxHQUFFSCxrQkFBa0IsQ0FBQ0ksVUFBVSxDQUFDLENBQUUsRUFBQztJQUNwRCxNQUFNQyxhQUFhLEdBQUksR0FBRUosS0FBTSxJQUFHRSxPQUFRLEVBQUM7SUFDM0MsT0FBT0UsYUFBYTtFQUN4QjtFQUVBaEIsc0JBQXNCQSxDQUFDaUIsS0FBSyxFQUFFQyxXQUFXLEVBQUVDLFVBQVUsRUFBRXpCLFFBQVEsRUFBRTtJQUM3RCxJQUFJdUIsS0FBSyxLQUFLLFNBQVMsRUFBRSxPQUFPLE1BQU07SUFDdEMsTUFBTUcsZ0JBQWdCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQztJQUNyRyxJQUFJQSxnQkFBZ0IsQ0FBQ0MsUUFBUSxDQUFDSixLQUFLLENBQUMsRUFBRSxPQUFPLE1BQU07SUFDbkQsSUFBSUEsS0FBSyxLQUFLLE9BQU8sRUFBRSxPQUFPQSxLQUFLO0lBQ25DLE1BQU1LLFdBQVcsR0FBRyxJQUFJLENBQUNsQix5QkFBeUIsQ0FBQyxDQUFDLEVBQUVWLFFBQVEsQ0FBQztJQUMvRCxNQUFNNkIsV0FBVyxHQUFHLElBQUksQ0FBQ25CLHlCQUF5QixDQUFDYyxXQUFXLEVBQUV4QixRQUFRLENBQUM7SUFDekUsTUFBTThCLFVBQVUsR0FBRyxJQUFJLENBQUNwQix5QkFBeUIsQ0FBQ2UsVUFBVSxFQUFFekIsUUFBUSxDQUFDO0lBQ3ZFLE9BQU80QixXQUFXLEdBQUdDLFdBQVcsSUFBSUQsV0FBVyxHQUFHRSxVQUFVLEdBQUksR0FBRVAsS0FBTSxLQUFJLEdBQUksR0FBRUEsS0FBTSxPQUFNO0VBQ2xHO0VBRUFmLGtCQUFrQkEsQ0FBQ3VCLGdCQUFnQixFQUFFO0lBQ2pDLE1BQU1DLFVBQVUsR0FBRztNQUNmQyxRQUFRLEVBQUUsdUlBQXVJO01BQ2pKQyxVQUFVLEVBQUUsK0lBQStJO01BQzNKQyxNQUFNLEVBQUUsdUlBQXVJO01BQy9JQyxJQUFJLEVBQUUsdUlBQXVJO01BQzdJQyxJQUFJLEVBQUUsMk1BQTJNO01BQ2pORCxJQUFJLEVBQUUsdUlBQXVJO01BQzdJRSxZQUFZLEVBQUU7SUFFbEIsQ0FBQztJQUNELE9BQU9OLFVBQVUsQ0FBQ0QsZ0JBQWdCLENBQUM7RUFDdkM7QUFDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoRTBCO0FBQ1E7QUFDWTtBQUUvQixNQUFNUSxTQUFTLENBQUM7RUFDM0JuSCxXQUFXQSxDQUFBLEVBQUc7SUFDVixJQUFJLENBQUNvSCxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsSUFBSSxDQUFDdEcsSUFBSSxHQUFHLElBQUlBLDZDQUFJLENBQUMsQ0FBQztFQUMxQjtFQUNBLE1BQU1QLFdBQVdBLENBQUNKLElBQUksRUFBRUMsSUFBSSxFQUFFO0lBQzFCLE1BQU1xQyxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMzQixJQUFJLENBQUNrQixxQkFBcUIsQ0FBQzdCLElBQUksRUFBRUMsSUFBSSxDQUFDO0lBQ2pFLE1BQU1FLFFBQVEsR0FBRyxJQUFJa0MsaURBQVEsQ0FBQ0MsT0FBTyxDQUFDO0lBQ3RDLE9BQU9uQyxRQUFRO0VBQ25CO0VBRUEsTUFBTUcsaUJBQWlCQSxDQUFDTixJQUFJLEVBQUVDLElBQUksRUFBRTtJQUNoQyxNQUFNd0Qsa0JBQWtCLEdBQUcsTUFBTSxJQUFJLENBQUM5QyxJQUFJLENBQUNrQixxQkFBcUIsQ0FBQzdCLElBQUksRUFBRUMsSUFBSSxDQUFDO0lBQzVFLE1BQU1JLGNBQWMsR0FBRyxJQUFJbUQsdURBQWMsQ0FBQ0Msa0JBQWtCLEVBQUV4RCxJQUFJLENBQUM7SUFDbkUsT0FBT0ksY0FBYztFQUN6QjtBQUNKOzs7Ozs7Ozs7Ozs7OztBQ3BCZSxNQUFNNkcsWUFBWSxDQUFDO0VBQzlCckgsV0FBV0EsQ0FBQ3NILE9BQU8sRUFBRUMsYUFBYSxFQUFFO0lBQ2hDLElBQUksQ0FBQ0QsT0FBTyxHQUFHQSxPQUFPO0lBQ3RCLElBQUksQ0FBQ3JILEtBQUssR0FBR3NILGFBQWE7SUFDMUIsSUFBSSxDQUFDcEgsSUFBSSxHQUFHb0gsYUFBYSxDQUFDN0UsZUFBZTtJQUN6QyxJQUFJLENBQUNXLElBQUksR0FBR2tFLGFBQWEsQ0FBQzNFLGVBQWU7RUFDN0M7RUFFQSxJQUFJekMsSUFBSUEsQ0FBQSxFQUFHO0lBQ1AsT0FBTyxJQUFJLENBQUNtSCxPQUFPLENBQUNFLGFBQWEsQ0FBQyxJQUFJLENBQUM7RUFDM0M7RUFDQSxJQUFJckgsSUFBSUEsQ0FBQ2dHLEtBQUssRUFBRTtJQUNaLElBQUksQ0FBQ2hHLElBQUksQ0FBQ3NILFdBQVcsR0FBR3RCLEtBQUs7RUFDakM7RUFDQSxJQUFJOUMsSUFBSUEsQ0FBQSxFQUFHO0lBQ1AsT0FBTyxJQUFJLENBQUNpRSxPQUFPLENBQUNFLGFBQWEsQ0FBQyxJQUFJLENBQUM7RUFDM0M7RUFDQSxJQUFJbkUsSUFBSUEsQ0FBQzhDLEtBQUssRUFBRTtJQUNaLElBQUksQ0FBQzlDLElBQUksQ0FBQ29FLFdBQVcsR0FBR3RCLEtBQUs7RUFDakM7QUFDSjs7Ozs7Ozs7Ozs7Ozs7QUNwQmUsTUFBTXVCLGtCQUFrQixDQUFDO0VBQ3BDMUgsV0FBV0EsQ0FBQ3NILE9BQU8sRUFBRUssbUJBQW1CLEVBQUU7SUFDdEMsSUFBSSxDQUFDTCxPQUFPLEdBQUdBLE9BQU87SUFDdEIsSUFBSSxDQUFDckgsS0FBSyxHQUFHMEgsbUJBQW1CO0lBQ2hDLElBQUksQ0FBQzlELFdBQVcsR0FBRzhELG1CQUFtQixDQUFDOUQsV0FBVztJQUNsRCxJQUFJLENBQUNNLGFBQWEsR0FBR3dELG1CQUFtQixDQUFDeEQsYUFBYTtJQUN0RCxJQUFJLENBQUNFLFFBQVEsR0FBR3NELG1CQUFtQixDQUFDdEQsUUFBUTtJQUM1QyxJQUFJLENBQUNDLFNBQVMsR0FBR3FELG1CQUFtQixDQUFDckQsU0FBUztJQUM5QyxJQUFJLENBQUNHLFFBQVEsR0FBR2tELG1CQUFtQixDQUFDbEQsUUFBUTtJQUM1QyxJQUFJLENBQUNDLE9BQU8sR0FBR2lELG1CQUFtQixDQUFDakQsT0FBTztJQUMxQyxJQUFJLENBQUNHLE1BQU0sR0FBRzhDLG1CQUFtQixDQUFDOUMsTUFBTTtJQUN4QyxJQUFJLENBQUNDLG9CQUFvQixHQUFHNkMsbUJBQW1CLENBQUM3QyxvQkFBb0I7SUFDcEUsSUFBSSxDQUFDRyxtQkFBbUIsR0FBRzBDLG1CQUFtQixDQUFDMUMsbUJBQW1CO0lBQ2xFLElBQUksQ0FBQ0UsZUFBZSxHQUFHd0MsbUJBQW1CLENBQUN4QyxlQUFlO0VBRTlEO0VBQ0F5QyxZQUFZQSxDQUFDekIsS0FBSyxFQUFFO0lBQ2hCLElBQUlBLEtBQUssSUFBSSxNQUFNLEVBQUU7TUFDakJ4RSxRQUFRLENBQUNrRyxJQUFJLENBQUNDLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFlBQVksQ0FBQztJQUM3QyxDQUFDLE1BQU0sSUFBSTVCLEtBQUssSUFBSSxNQUFNLEVBQUU7TUFDeEJ4RSxRQUFRLENBQUNrRyxJQUFJLENBQUNDLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFlBQVksQ0FBQztJQUM3QztFQUNKO0VBRUEsSUFBSWxFLFdBQVdBLENBQUEsRUFBRztJQUNkLE9BQU8sSUFBSSxDQUFDeUQsT0FBTyxDQUFDRSxhQUFhLENBQUMsSUFBSSxDQUFDO0VBQzNDO0VBRUEsSUFBSTNELFdBQVdBLENBQUNzQyxLQUFLLEVBQUU7SUFDbkIsSUFBSSxDQUFDdEMsV0FBVyxDQUFDNEQsV0FBVyxHQUFHdEIsS0FBSztFQUN4QztFQUVBLElBQUloQyxhQUFhQSxDQUFBLEVBQUc7SUFDaEIsT0FBTyxJQUFJLENBQUNtRCxPQUFPLENBQUNFLGFBQWEsQ0FBQyxhQUFhLENBQUM7RUFDcEQ7RUFFQSxJQUFJckQsYUFBYUEsQ0FBQ2dDLEtBQUssRUFBRTtJQUNyQixJQUFJLENBQUNoQyxhQUFhLENBQUNzRCxXQUFXLEdBQUd0QixLQUFLO0VBQzFDO0VBRUEsSUFBSTlCLFFBQVFBLENBQUEsRUFBRztJQUNYLE9BQU8sSUFBSSxDQUFDaUQsT0FBTyxDQUFDRSxhQUFhLENBQUMsV0FBVyxDQUFDO0VBQ2xEO0VBRUEsSUFBSW5ELFFBQVFBLENBQUM4QixLQUFLLEVBQUU7SUFDaEIsSUFBSSxDQUFDOUIsUUFBUSxDQUFDb0QsV0FBVyxHQUFHdEIsS0FBSztFQUNyQztFQUVBLElBQUk3QixTQUFTQSxDQUFBLEVBQUc7SUFDWixPQUFPLElBQUksQ0FBQ2dELE9BQU8sQ0FBQ0UsYUFBYSxDQUFDLGFBQWEsQ0FBQztFQUNwRDtFQUVBLElBQUlsRCxTQUFTQSxDQUFDNkIsS0FBSyxFQUFFO0lBQ2pCLElBQUksQ0FBQzdCLFNBQVMsQ0FBQ21ELFdBQVcsR0FBR3RCLEtBQUs7RUFDdEM7RUFFQSxJQUFJMUIsUUFBUUEsQ0FBQSxFQUFHO0lBQ1gsT0FBTyxJQUFJLENBQUM2QyxPQUFPLENBQUNFLGFBQWEsQ0FBQyxXQUFXLENBQUM7RUFDbEQ7RUFFQSxJQUFJL0MsUUFBUUEsQ0FBQzBCLEtBQUssRUFBRTtJQUNoQixJQUFJLENBQUMxQixRQUFRLENBQUNnRCxXQUFXLEdBQUd0QixLQUFLO0VBQ3JDO0VBRUEsSUFBSXpCLE9BQU9BLENBQUEsRUFBRztJQUNWLE9BQU8sSUFBSSxDQUFDNEMsT0FBTyxDQUFDRSxhQUFhLENBQUMsVUFBVSxDQUFDO0VBQ2pEO0VBQ0EsSUFBSTlDLE9BQU9BLENBQUN5QixLQUFLLEVBQUU7SUFDZixJQUFJLENBQUN6QixPQUFPLENBQUMrQyxXQUFXLEdBQUd0QixLQUFLO0VBQ3BDO0VBRUEsSUFBSXRCLE1BQU1BLENBQUEsRUFBRztJQUNULE9BQU8sSUFBSSxDQUFDeUMsT0FBTyxDQUFDRSxhQUFhLENBQUMsU0FBUyxDQUFDO0VBQ2hEO0VBQ0EsSUFBSTNDLE1BQU1BLENBQUNzQixLQUFLLEVBQUU7SUFDZCxJQUFJLENBQUN0QixNQUFNLENBQUM0QyxXQUFXLEdBQUd0QixLQUFLO0VBQ25DO0VBRUEsSUFBSXJCLG9CQUFvQkEsQ0FBQSxFQUFHO0lBQ3ZCLE9BQU8sSUFBSSxDQUFDd0MsT0FBTyxDQUFDRSxhQUFhLENBQUMsSUFBSSxDQUFDO0VBQzNDO0VBQ0EsSUFBSTFDLG9CQUFvQkEsQ0FBQ3FCLEtBQUssRUFBRTtJQUM1QixJQUFJLENBQUNyQixvQkFBb0IsQ0FBQzJDLFdBQVcsR0FBR3RCLEtBQUs7RUFDakQ7RUFFQSxJQUFJbEIsbUJBQW1CQSxDQUFBLEVBQUc7SUFDdEIsT0FBTyxJQUFJLENBQUNxQyxPQUFPLENBQUNFLGFBQWEsQ0FBQyxLQUFLLENBQUM7RUFDNUM7RUFFQSxJQUFJdkMsbUJBQW1CQSxDQUFDa0IsS0FBSyxFQUFFO0lBQzNCLElBQUksQ0FBQ2xCLG1CQUFtQixDQUFDK0MsR0FBRyxHQUFJLFlBQVc3QixLQUFNLE1BQUs7SUFDdEQsSUFBSSxDQUFDeUIsWUFBWSxDQUFDekIsS0FBSyxDQUFDO0VBRTVCO0VBRUEsSUFBSWhCLGVBQWVBLENBQUEsRUFBRztJQUNsQixPQUFPeEQsUUFBUSxDQUFDQyxjQUFjLENBQUMsT0FBTyxDQUFDO0VBQzNDO0VBQ0EsSUFBSXVELGVBQWVBLENBQUNnQixLQUFLLEVBQUU7SUFDdkIsSUFBSSxDQUFDaEIsZUFBZSxDQUFDNkMsR0FBRyxHQUFHN0IsS0FBSztFQUNwQztBQUNKOzs7Ozs7Ozs7Ozs7Ozs7O0FDckcwQztBQUNZO0FBRXZDLE1BQU04QixRQUFRLENBQUM7RUFDMUJySCxjQUFjQSxDQUFDTixRQUFRLEVBQUU7SUFDckIsTUFBTWdILE9BQU8sR0FBRzNGLFFBQVEsQ0FBQ0MsY0FBYyxDQUFDLFdBQVcsQ0FBQztJQUNwRCxJQUFJeUYscURBQVksQ0FBQ0MsT0FBTyxFQUFFaEgsUUFBUSxDQUFDO0VBQ3ZDO0VBRUFPLHFCQUFxQkEsQ0FBQ0wsY0FBYyxFQUFFO0lBQ2xDLE1BQU04RyxPQUFPLEdBQUczRixRQUFRLENBQUNDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQztJQUMxRCxJQUFJOEYsMkRBQWtCLENBQUNKLE9BQU8sRUFBRTlHLGNBQWMsQ0FBQztFQUNuRDtBQUVKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNkQTtBQUM2RztBQUNqQjtBQUM1Riw4QkFBOEIsbUZBQTJCLENBQUMsNEZBQXFDO0FBQy9GO0FBQ0E7OztBQUdBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDLE9BQU8sb0dBQW9HLE1BQU0sU0FBUyxRQUFRLE1BQU0sS0FBSyxZQUFZLFdBQVcsWUFBWSxXQUFXLE9BQU8sS0FBSyxTQUFTLE9BQU8sTUFBTSxLQUFLLFVBQVUsT0FBTyxNQUFNLE1BQU0sS0FBSyxVQUFVLFFBQVEsT0FBTyxNQUFNLEtBQUssVUFBVSxZQUFZLFFBQVEsS0FBSyxTQUFTLFFBQVEsTUFBTSxLQUFLLFlBQVksV0FBVyxVQUFVLFVBQVUsWUFBWSxXQUFXLE9BQU8sT0FBTyxNQUFNLEtBQUssWUFBWSxXQUFXLFVBQVUsVUFBVSxPQUFPLEtBQUssU0FBUyxPQUFPLE1BQU0sS0FBSyxZQUFZLFFBQVEsT0FBTyxNQUFNLEtBQUssWUFBWSxXQUFXLFlBQVksV0FBVyxZQUFZLFdBQVcsT0FBTyxNQUFNLE1BQU0sTUFBTSxZQUFZLFFBQVEsT0FBTyxNQUFNLE9BQU8sWUFBWSxXQUFXLFVBQVUsVUFBVSxPQUFPLE1BQU0sTUFBTSxLQUFLLFVBQVUsUUFBUSxPQUFPLE1BQU0sTUFBTSxVQUFVLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLE9BQU8sS0FBSyxVQUFVLE9BQU8sS0FBSyxTQUFTLE9BQU8sTUFBTSxLQUFLLFlBQVksUUFBUSxLQUFLLFNBQVMsUUFBUSxNQUFNLFNBQVMsWUFBWSxXQUFXLFVBQVUsVUFBVSxZQUFZLFdBQVcsVUFBVSxVQUFVLE9BQU8sT0FBTyxNQUFNLE1BQU0sVUFBVSxZQUFZLFFBQVEsT0FBTyxNQUFNLE1BQU0sVUFBVSxZQUFZLFFBQVEsTUFBTSxNQUFNLFFBQVEsWUFBWSxRQUFRLE1BQU0sTUFBTSxRQUFRLFlBQVksV0FBVyxPQUFPLE1BQU0sTUFBTSxRQUFRLFlBQVksUUFBUSxNQUFNLE1BQU0sS0FBSyxZQUFZLFFBQVEsU0FBUyxNQUFNLEtBQUssWUFBWSxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxZQUFZLFdBQVcsT0FBTyxNQUFNLE1BQU0sS0FBSyxZQUFZLFFBQVEsTUFBTSxNQUFNLEtBQUssVUFBVSxRQUFRLE9BQU8sTUFBTSxNQUFNLFlBQVksV0FBVyxVQUFVLFVBQVUsT0FBTyxNQUFNLE1BQU0sTUFBTSxVQUFVLFFBQVEsT0FBTyxNQUFNLEtBQUssWUFBWSxXQUFXLFlBQVksV0FBVyxPQUFPLE1BQU0sTUFBTSxLQUFLLFlBQVksUUFBUSxPQUFPLE1BQU0sS0FBSyxZQUFZLFdBQVcsVUFBVSxVQUFVLE9BQU8sS0FBSyxTQUFTLE9BQU8sTUFBTSxLQUFLLFVBQVUsUUFBUSxNQUFNLE1BQU0sS0FBSyxZQUFZLFFB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QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQyxPQUFPLHVGQUF1RixZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxZQUFZLE9BQU8sTUFBTSxZQUFZLFdBQVcsVUFBVSxZQUFZLFdBQVcsWUFBWSxhQUFhLGFBQWEsV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksV0FBVyxVQUFVLE1BQU0sS0FBSyxZQUFZLFdBQVcsTUFBTSxLQUFLLFlBQVksV0FBVyxVQUFVLFVBQVUsWUFBWSxhQUFhLFdBQVcsWUFBWSxXQUFXLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksYUFBYSxXQUFXLFVBQVUsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksV0FBVyxZQUFZLGFBQWEs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V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDbEJBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7Ozs7V0NyQkE7Ozs7Ozs7Ozs7Ozs7OztBQ0E2QjtBQUNjO0FBQ0o7QUFDbUI7QUFHMUQsTUFBTVAsS0FBSyxHQUFHLElBQUlrSCx5REFBUyxDQUFDLENBQUM7QUFDN0IsTUFBTWpILElBQUksR0FBRyxJQUFJK0gsdURBQVEsQ0FBQyxDQUFDO0FBQzNCLE1BQU1DLFVBQVUsR0FBRyxJQUFJbkksbUVBQWMsQ0FBQ0UsS0FBSyxFQUFFQyxJQUFJLENBQUM7QUFFbEQsTUFBTXNELENBQUMsR0FBRyxJQUFJQyxJQUFJLENBQUMsQ0FBQztBQUNwQi9DLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDNkMsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9zY3JpcHRzL2NvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3NjcmlwdHMvbW9kZWxzL0FQSXMuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvc2NyaXB0cy9tb2RlbHMvY2l0eUluZm8uanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvc2NyaXB0cy9tb2RlbHMvY3VycmVudFdlYXRoZXIuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvc2NyaXB0cy9tb2RlbHMvbWFpbk1vZGVsLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3NjcmlwdHMvdmlld3MvY2l0eUluZm9WaWV3LmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3NjcmlwdHMvdmlld3MvY3VycmVudFdlYXRoZXJWaWV3LmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3NjcmlwdHMvdmlld3MvbWFpblZpZXcuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvc3R5bGVzL25vbWFybGl6ZS5jc3MiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvc3R5bGVzL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvc3R5bGVzL3N0eWxlLmNzcz9mZjk0Iiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9zY3JpcHRzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIE1haW5Db250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdmlldykge1xuICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgICAgIHRoaXMuY2l0eSA9IHt9O1xuICAgICAgICB0aGlzLnVuaXQgPSBcIm1ldHJpY1wiO1xuICAgICAgICB0aGlzLmNpdHkgPSBcIlwiO1xuICAgICAgICB0aGlzLmxvYWRwYWdlKHRoaXMuY2l0eSk7XG5cblxuICAgIH1cblxuXG4gICAgYXN5bmMgbG9hZHBhZ2UoY2l0eSkge1xuICAgICAgICB0aGlzLmNpdHkgPSBjaXR5O1xuXG4gICAgICAgIGNvbnN0IGNpdHlJbmZvID0gYXdhaXQgdGhpcy5tb2RlbC5nZXRDaXR5SW5mbyhjaXR5LCB0aGlzLnVuaXQpO1xuICAgICAgICBjb25zdCBjdXJyZW50V2VhdGhlciA9IGF3YWl0IHRoaXMubW9kZWwuZ2V0Q3VycmVudFdlYXRoZXIoY2l0eSwgdGhpcy51bml0KTtcblxuICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50V2VhdGhlcik7XG4gICAgICAgIHRoaXMudmlldy5hcHBlbmRDaXR5SW5mbyhjaXR5SW5mbyk7XG4gICAgICAgIHRoaXMudmlldy5hcHBlbmRDdXJycmVudFdlYXRoZXIoY3VycmVudFdlYXRoZXIpO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBBUElzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy51cmxHZW5lcmF0b3IgPSBuZXcgVXJsR2VuZXJldG9yKCdkMzg5N2MxNDg5YzBkOGVjZWE4YWVjYWI5MWRhNGQxZCcpO1xuICAgIH1cblxuICAgIGFzeW5jIGdldEdlb0Nvb3JkaW5hdGVzKGNpdHkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IHRoaXMudXJsR2VuZXJhdG9yLmdlbmVyYXRlR2VvQ29vcmRzVXJsKGNpdHkpO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbW9kZTogXCJjb3JzXCIgfSk7XG4gICAgICAgICAgICBjb25zdCBnZW9Db2RpbmdEYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgY29uc3QgeyBsYXQsIGxvbiB9ID0gZ2VvQ29kaW5nRGF0YVswXTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcnJvcicpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIHJldHVybiB7IGxhdCwgbG9uIH1cblxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgZ2V0Q3VycmVudFdlYXRoZXJEYXRhKGNpdHksIHVuaXQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgbGF0LCBsb24gfSA9IGF3YWl0IHRoaXMuZ2V0R2VvQ29vcmRpbmF0ZXMoY2l0eSk7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSB0aGlzLnVybEdlbmVyYXRvci5nZW5lcmF0ZUN1cnJlbnRXZWF0aGVyKGxhdCwgbG9uLCB1bml0KTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6ICdjb3JzJyB9KTtcbiAgICAgICAgICAgIGNvbnN0IHdlYXRoZXJEYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yJykuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgcmV0dXJuIHdlYXRoZXJEYXRhO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBnZXRGb3JlY2FzdFdlYXRoZXJEYXRhKGNpdHksIHVuaXQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgbGF0LCBsb24gfSA9IGF3YWl0IHRoaXMuZ2V0R2VvQ29vcmRpbmF0ZXMoY2l0eSk7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSB0aGlzLnVybEdlbmVyYXRvci5nZW5lcmF0ZUZvcmVjYXN0V2VhdGhlcihsYXQsIGxvbiwgdW5pdCk7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgeyBtb2RlOiBcImNvcnNcIiB9KTtcbiAgICAgICAgICAgIGNvbnN0IGZvcmVjYXN0RGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgcmV0dXJuIGZvcmVjYXN0RGF0YTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBVcmxHZW5lcmV0b3Ige1xuICAgIGNvbnN0cnVjdG9yKGFwcElkKSB7XG4gICAgICAgIHRoaXMuYmFzZVVybCA9IFwiaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnXCI7XG4gICAgICAgIHRoaXMuYXBwSWQgPSBhcHBJZDtcbiAgICB9XG4gICAgZ2VuZXJhdGVHZW9Db29yZHNVcmwoY2l0eSkge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5iYXNlVXJsfS9nZW8vMS4wL2RpcmVjdD9xPSR7Y2l0eX0mYXBwaWQ9JHt0aGlzLmFwcElkfWA7XG4gICAgfVxuICAgIGdlbmVyYXRlQ3VycmVudFdlYXRoZXIobGF0LCBsb24sIHVuaXQpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuYmFzZVVybH0vZGF0YS8yLjUvd2VhdGhlcj9sYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mYXBwaWQ9JHt0aGlzLmFwcElkfSZ1bml0cz0ke3VuaXR9YDtcbiAgICB9XG4gICAgZ2VuZXJhdGVGb3JlY2FzdFdlYXRoZXIobGF0LCBsb24sIHVuaXQpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuYmFzZVVybH0vZGF0YS8yLjUvZm9yZWNhc3Q/bGF0PSR7bGF0fSZsb249JHtsb259JmNudD0mYXBwaWQ9JHt0aGlzLmFwcElkfSZ1bml0cz0ke3VuaXR9YDtcbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2l0eUluZm8ge1xuICAgIGNvbnN0cnVjdG9yKEFwaURhdGEpIHtcbiAgICAgICAgdGhpcy5jaXR5RGVzY3JpcHRpb24gPSB0aGlzLmNyZWF0ZUNpdHlEZXNjcmlwdGlvbihBcGlEYXRhKTtcbiAgICAgICAgdGhpcy5kYXRlRGVzY3JpcHRpb24gPSB0aGlzLmNyZWF0ZURhdGVEZXNjcmlwdGlvbihBcGlEYXRhKTtcblxuICAgIH1cblxuICAgIGNyZWF0ZUNpdHlEZXNjcmlwdGlvbihBcGlEYXRhKSB7XG4gICAgICAgIGNvbnN0IGNpdHkgPSBBcGlEYXRhLm5hbWU7XG4gICAgICAgIGNvbnN0IHsgY291bnRyeSB9ID0gQXBpRGF0YS5zeXM7XG5cbiAgICAgICAgcmV0dXJuIGAke2NpdHl9LCAke2NvdW50cnl9YDtcbiAgICB9XG5cbiAgICBjcmVhdGVEYXRlRGVzY3JpcHRpb24oQXBpRGF0YSkge1xuICAgICAgICBjb25zdCBkYXkgPSB0aGlzLmdldERheSgpO1xuICAgICAgICBjb25zdCBtb250aCA9IHRoaXMuZ2V0TW9udGgoKTtcbiAgICAgICAgY29uc3QgZGF0ZSA9IHRoaXMuZ2V0RGF0ZSgpO1xuXG4gICAgICAgIHJldHVybiBgJHtkYXl9LCAke21vbnRofSAke2RhdGV9YDtcbiAgICB9XG5cbiAgICBnZXREYXkoKSB7XG4gICAgICAgIGNvbnN0IHdlZWtkYXkgPSBbXCJTdW5kYXlcIiwgXCJNb25kYXlcIiwgXCJUdWVzZGF5XCIsIFwiV2VkbmVzZGF5XCIsIFwiVGh1cnNkYXlcIiwgXCJGcmlkYXlcIiwgXCJTYXR1cmRheVwiXTtcbiAgICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGNvbnN0IGRheSA9IHdlZWtkYXlbZC5nZXREYXkoKV07XG4gICAgICAgIHJldHVybiBkYXk7XG4gICAgfVxuXG4gICAgZ2V0TW9udGgoKSB7XG4gICAgICAgIGNvbnN0IG1vbnRoTmFtZXMgPSBbXG4gICAgICAgICAgICBcIkphbnVhcnlcIixcbiAgICAgICAgICAgIFwiRmVicnVhcnlcIixcbiAgICAgICAgICAgIFwiTWFyY2hcIixcbiAgICAgICAgICAgIFwiQXByaWxcIixcbiAgICAgICAgICAgIFwiTWF5XCIsXG4gICAgICAgICAgICBcIkp1bmVcIixcbiAgICAgICAgICAgIFwiSnVseVwiLFxuICAgICAgICAgICAgXCJBdWd1c3RcIixcbiAgICAgICAgICAgIFwiU2VwdGVtYmVyXCIsXG4gICAgICAgICAgICBcIk9jdG9iZXJcIixcbiAgICAgICAgICAgIFwiTm92ZW1iZXJcIixcbiAgICAgICAgICAgIFwiRGVjZW1iZXJcIixcbiAgICAgICAgXTtcbiAgICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gbW9udGhOYW1lc1tkLmdldE1vbnRoKCldO1xuICAgICAgICByZXR1cm4gbW9udGg7XG4gICAgfVxuICAgIGdldERhdGUoKSB7XG4gICAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBjb25zdCBkYXRlID0gZC5nZXREYXRlKCk7XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1cnJlbnRXZWF0aGVyIHtcbiAgICBjb25zdHJ1Y3RvcihjdXJyZW50V2VhdGhlckRhdGEsIHVuaXQpIHtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZSA9IHRoaXMuZ2V0VGVtcGVyYXR1cmUoTWF0aC5yb3VuZChjdXJyZW50V2VhdGhlckRhdGEubWFpbi50ZW1wKSwgdW5pdCk7XG4gICAgICAgIHRoaXMuZmVlbHNMaWtlVGVtcCA9IHRoaXMuZ2V0VGVtcGVyYXR1cmUoTWF0aC5yb3VuZChjdXJyZW50V2VhdGhlckRhdGEubWFpbi5mZWVsc19saWtlKSwgdW5pdCk7XG4gICAgICAgIHRoaXMuaHVtaWRpdHkgPSBgJHtjdXJyZW50V2VhdGhlckRhdGEubWFpbi5odW1pZGl0eX0lYDtcbiAgICAgICAgdGhpcy53aW5kU3BlZWQgPSBgJHtjdXJyZW50V2VhdGhlckRhdGEud2luZC5zcGVlZH1tL3NgO1xuICAgICAgICB0aGlzLnByZXNzdXJlID0gYCR7Y3VycmVudFdlYXRoZXJEYXRhLm1haW4ucHJlc3N1cmV9IGhQYWA7XG4gICAgICAgIHRoaXMuc3VucmlzZSA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5VGltZShjdXJyZW50V2VhdGhlckRhdGEuc3lzLnN1bnJpc2UsIGN1cnJlbnRXZWF0aGVyRGF0YS50aW1lem9uZSk7XG4gICAgICAgIHRoaXMuc3Vuc2V0ID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlUaW1lKGN1cnJlbnRXZWF0aGVyRGF0YS5zeXMuc3Vuc2V0LCBjdXJyZW50V2VhdGhlckRhdGEudGltZXpvbmUpO1xuICAgICAgICB0aGlzLndlYXRoZXJDb25kaXRpb25EZXNjID0gY3VycmVudFdlYXRoZXJEYXRhLndlYXRoZXJbMF0uZGVzY3JpcHRpb247XG4gICAgICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbkltZyA9IHRoaXMuZ2V0d2VhdGhlckNvbmRpdGlvbkltZyhcbiAgICAgICAgICAgIGN1cnJlbnRXZWF0aGVyRGF0YS53ZWF0aGVyWzBdLm1haW4sXG4gICAgICAgICAgICBjdXJyZW50V2VhdGhlckRhdGEuc3lzLnN1bnJpc2UsXG4gICAgICAgICAgICBjdXJyZW50V2VhdGhlckRhdGEuc3lzLnN1bnNldCxcbiAgICAgICAgICAgIGN1cnJlbnRXZWF0aGVyRGF0YS50aW1lem9uZVxuICAgICAgICApO1xuICAgICAgICB0aGlzLmJhY2tncm91bmRWaWRlbyA9IHRoaXMuZ2V0QmFja2dyb3VuZFZpZGVvKHRoaXMud2VhdGhlckNvbmRpdGlvbkltZyk7XG5cbiAgICB9XG5cbiAgICBnZXRUZW1wZXJhdHVyZShkZWdyZWVzLCB1bml0KSB7XG4gICAgICAgIHJldHVybiB1bml0ID09PSBcIm1ldHJpY1wiID8gYCR7ZGVncmVlc30g4oSDYCA6IGAke2RlZ3JlZXN9IOKEiWA7XG4gICAgfVxuXG4gICAgY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZSh1bml4VGltZSwgdGltZXpvbmUpIHtcbiAgICAgICAgY29uc3QgbG9jYWxEYXRlID0gdW5peFRpbWUgPT09IDAgPyBuZXcgRGF0ZSA6IG5ldyBEYXRlKHVuaXhUaW1lICogMTAwMCk7XG4gICAgICAgIGNvbnN0IHV0Y1VuaXhUaW1lID0gbG9jYWxEYXRlLmdldFRpbWUoKSArIChsb2NhbERhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSAqIDYwMDAwKTtcbiAgICAgICAgY29uc3QgdW5peFRpbWVJblNlYXJjaGVkQ2l0eSA9IHV0Y1VuaXhUaW1lICsgdGltZXpvbmUgKiAxMDAwO1xuICAgICAgICBjb25zdCBkYXRlSW5TZWFyY2hlZENpdHkgPSBuZXcgRGF0ZSh1bml4VGltZUluU2VhcmNoZWRDaXR5KVxuICAgICAgICByZXR1cm4gZGF0ZUluU2VhcmNoZWRDaXR5O1xuICAgIH1cblxuICAgIGNvbnZlcnRUb1NlYXJjaGVkQ2l0eVRpbWUodW5peFRpbWUsIHRpbWV6b25lKSB7XG4gICAgICAgIGNvbnN0IGRhdGVJblNlYXJjaGVkQ2l0eSA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZSh1bml4VGltZSwgdGltZXpvbmUpO1xuICAgICAgICBjb25zdCBob3VycyA9IGRhdGVJblNlYXJjaGVkQ2l0eS5nZXRIb3VycygpO1xuICAgICAgICBjb25zdCBtaW51dGVzID0gYCR7ZGF0ZUluU2VhcmNoZWRDaXR5LmdldE1pbnV0ZXMoKX1gO1xuICAgICAgICBjb25zdCBmb3JtYXR0ZWRUaW1lID0gYCR7aG91cnN9OiR7bWludXRlc31gO1xuICAgICAgICByZXR1cm4gZm9ybWF0dGVkVGltZTtcbiAgICB9XG5cbiAgICBnZXR3ZWF0aGVyQ29uZGl0aW9uSW1nKHZhbHVlLCBzdW5yaXNlVW5peCwgc3Vuc2V0VW5peCwgdGltZXpvbmUpIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSBcIkRyaXp6bGVcIikgcmV0dXJuIFwicmFpblwiO1xuICAgICAgICBjb25zdCBtaXN0RXF1aXZhbGVudGVzID0gW1wiU21va2VcIiwgXCJIYXplXCIsIFwiRHVzdFwiLCBcIkZvZ1wiLCBcIlNhbmRcIiwgXCJEdXN0XCIsIFwiQXNoXCIsIFwiU3F1YWxsXCIsIFwiVG9ybmFkb1wiXTtcbiAgICAgICAgaWYgKG1pc3RFcXVpdmFsZW50ZXMuaW5jbHVkZXModmFsdWUpKSByZXR1cm4gXCJNaXN0XCI7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gXCJDbGVhclwiKSByZXR1cm4gdmFsdWU7XG4gICAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKDAsIHRpbWV6b25lKTtcbiAgICAgICAgY29uc3Qgc3VucmlzZURhdGUgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoc3VucmlzZVVuaXgsIHRpbWV6b25lKTtcbiAgICAgICAgY29uc3Qgc3Vuc2V0RGF0ZSA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZShzdW5zZXRVbml4LCB0aW1lem9uZSk7XG4gICAgICAgIHJldHVybiBjdXJyZW50RGF0ZSA+IHN1bnJpc2VEYXRlICYmIGN1cnJlbnREYXRlIDwgc3Vuc2V0RGF0ZSA/IGAke3ZhbHVlfURheWAgOiBgJHt2YWx1ZX1OaWdodGA7XG4gICAgfVxuXG4gICAgZ2V0QmFja2dyb3VuZFZpZGVvKHdlYXRoZXJDb25kaXRpb24pIHtcbiAgICAgICAgY29uc3QgdmlkZW9MaW5rcyA9IHtcbiAgICAgICAgICAgIENsZWFyRGF5OiBcImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9leHRlcm5hbC80MjAyMjExNDUuaGQubXA0P3M9Mzk1OWJjYmY0ODI5YTk1Y2U0YjI5NDAxOTIwNzRkNzQ2OWZmOTg0YiZwcm9maWxlX2lkPTE3NSZvYXV0aDJfdG9rZW5faWQ9NTc0NDc3NjFcIixcbiAgICAgICAgICAgIENsZWFyTmlnaHQ6IFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzMzMzU4NDU5OS5zZC5tcDQ/cz1kZjIxZWNhNjE4Zjk3NDljZjJmNzM0ZmVlN2M5NGZjMWEwOWQwZjU0JmFtcDtwcm9maWxlX2lkPTE2NCZhbXA7b2F1dGgyX3Rva2VuX2lkPTU3NDQ3NzYxXCIsXG4gICAgICAgICAgICBDbG91ZHM6IFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzQ0NDE5Mjk3OC5oZC5tcDQ/cz0xOGFiNzM0NTYyZDhjNGVhMGVjMmZlZDdmMTZmM2VkZjYxNThkZGNjJnByb2ZpbGVfaWQ9MTcyJm9hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MVwiLFxuICAgICAgICAgICAgTWlzdDogXCJodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvMzUwMjQxMDg4LmhkLm1wND9zPTNhMjg3NDI2ZTAxNDZkYWI2ZWE3MzhmNDYyOWM2ZjA5ODlhODk2MDMmcHJvZmlsZV9pZD0xNzImb2F1dGgyX3Rva2VuX2lkPTU3NDQ3NzYxXCIsXG4gICAgICAgICAgICBSYWluOiBcImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9wcm9ncmVzc2l2ZV9yZWRpcmVjdC9wbGF5YmFjay83MDg2Mjk4MjMvcmVuZGl0aW9uLzcyMHAvZmlsZS5tcDQ/bG9jPWV4dGVybmFsJm9hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MSZzaWduYXR1cmU9OTk1MWU0NTEzMzRmZGZiY2Y5ZWI2YjhjOTMzZmQwMWRkMTJhNTRhMDNmZGIzNzFmMGRhODY0YTE3YWFlYWYyOVwiLFxuICAgICAgICAgICAgTWlzdDogXCJodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvMzUwMjQxMDg4LmhkLm1wND9zPTNhMjg3NDI2ZTAxNDZkYWI2ZWE3MzhmNDYyOWM2ZjA5ODlhODk2MDMmcHJvZmlsZV9pZD0xNzImb2F1dGgyX3Rva2VuX2lkPTU3NDQ3NzYxXCIsXG4gICAgICAgICAgICBUaHVuZGVyc3Rvcm06IFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzQ4MDIyMzg5Ni5oZC5tcDQ/cz1lNGI5NGYwYjU3MDBiZmE2OGNiNmYwMmI0MWY5NGVjY2E5MTI0MmU5JnByb2ZpbGVfaWQ9MTY5Jm9hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MVwiXG5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmlkZW9MaW5rc1t3ZWF0aGVyQ29uZGl0aW9uXTtcbiAgICB9XG59IiwiaW1wb3J0IEFQSXMgZnJvbSBcIi4vQVBJc1wiO1xuaW1wb3J0IENpdHlJbmZvIGZyb20gXCIuL2NpdHlJbmZvXCI7XG5pbXBvcnQgQ3VycmVudFdlYXRoZXIgZnJvbSBcIi4vY3VycmVudFdlYXRoZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFpbk1vZGVsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5kYXRhID0ge307XG4gICAgICAgIHRoaXMuQVBJcyA9IG5ldyBBUElzKCk7XG4gICAgfVxuICAgIGFzeW5jIGdldENpdHlJbmZvKGNpdHksIHVuaXQpIHtcbiAgICAgICAgY29uc3QgQXBpRGF0YSA9IGF3YWl0IHRoaXMuQVBJcy5nZXRDdXJyZW50V2VhdGhlckRhdGEoY2l0eSwgdW5pdCk7XG4gICAgICAgIGNvbnN0IGNpdHlJbmZvID0gbmV3IENpdHlJbmZvKEFwaURhdGEpO1xuICAgICAgICByZXR1cm4gY2l0eUluZm87XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0Q3VycmVudFdlYXRoZXIoY2l0eSwgdW5pdCkge1xuICAgICAgICBjb25zdCBjdXJyZW50V2VhdGhlckRhdGEgPSBhd2FpdCB0aGlzLkFQSXMuZ2V0Q3VycmVudFdlYXRoZXJEYXRhKGNpdHksIHVuaXQpO1xuICAgICAgICBjb25zdCBjdXJyZW50V2VhdGhlciA9IG5ldyBDdXJyZW50V2VhdGhlcihjdXJyZW50V2VhdGhlckRhdGEsIHVuaXQpO1xuICAgICAgICByZXR1cm4gY3VycmVudFdlYXRoZXI7XG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENpdHlJbmZvVmlldyB7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgY2l0eUluZm9Nb2RlbCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLm1vZGVsID0gY2l0eUluZm9Nb2RlbDtcbiAgICAgICAgdGhpcy5jaXR5ID0gY2l0eUluZm9Nb2RlbC5jaXR5RGVzY3JpcHRpb247XG4gICAgICAgIHRoaXMuZGF0ZSA9IGNpdHlJbmZvTW9kZWwuZGF0ZURlc2NyaXB0aW9uO1xuICAgIH1cblxuICAgIGdldCBjaXR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2gxJyk7XG4gICAgfVxuICAgIHNldCBjaXR5KHZhbHVlKSB7XG4gICAgICAgIHRoaXMuY2l0eS50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgIH1cbiAgICBnZXQgZGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdoMicpO1xuICAgIH1cbiAgICBzZXQgZGF0ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLmRhdGUudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3VycmVudFdlYXRoZXJWaWV3IHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBjdXJyZW50V2VhdGhlck1vZGVsKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMubW9kZWwgPSBjdXJyZW50V2VhdGhlck1vZGVsO1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlID0gY3VycmVudFdlYXRoZXJNb2RlbC50ZW1wZXJhdHVyZTtcbiAgICAgICAgdGhpcy5mZWVsc0xpa2VUZW1wID0gY3VycmVudFdlYXRoZXJNb2RlbC5mZWVsc0xpa2VUZW1wO1xuICAgICAgICB0aGlzLmh1bWlkaXR5ID0gY3VycmVudFdlYXRoZXJNb2RlbC5odW1pZGl0eTtcbiAgICAgICAgdGhpcy53aW5kU3BlZWQgPSBjdXJyZW50V2VhdGhlck1vZGVsLndpbmRTcGVlZDtcbiAgICAgICAgdGhpcy5wcmVzc3VyZSA9IGN1cnJlbnRXZWF0aGVyTW9kZWwucHJlc3N1cmU7XG4gICAgICAgIHRoaXMuc3VucmlzZSA9IGN1cnJlbnRXZWF0aGVyTW9kZWwuc3VucmlzZTtcbiAgICAgICAgdGhpcy5zdW5zZXQgPSBjdXJyZW50V2VhdGhlck1vZGVsLnN1bnNldDtcbiAgICAgICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uRGVzYyA9IGN1cnJlbnRXZWF0aGVyTW9kZWwud2VhdGhlckNvbmRpdGlvbkRlc2M7XG4gICAgICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbkltZyA9IGN1cnJlbnRXZWF0aGVyTW9kZWwud2VhdGhlckNvbmRpdGlvbkltZztcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kVmlkZW8gPSBjdXJyZW50V2VhdGhlck1vZGVsLmJhY2tncm91bmRWaWRlbztcblxuICAgIH1cbiAgICB3ZWF0aGVyQ29sb3IodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlID09IFwiUmFpblwiKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2NvbG9yLXJhaW4nKTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PSBcIk1pc3RcIikge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdjb2xvci1taXN0Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgdGVtcGVyYXR1cmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignaDEnKTtcbiAgICB9XG5cbiAgICBzZXQgdGVtcGVyYXR1cmUodmFsdWUpIHtcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZS50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBmZWVsc0xpa2VUZW1wKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mZWVscy1saWtlJyk7XG4gICAgfVxuXG4gICAgc2V0IGZlZWxzTGlrZVRlbXAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5mZWVsc0xpa2VUZW1wLnRleHRDb250ZW50ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IGh1bWlkaXR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5odW1pZGl0eScpO1xuICAgIH1cblxuICAgIHNldCBodW1pZGl0eSh2YWx1ZSkge1xuICAgICAgICB0aGlzLmh1bWlkaXR5LnRleHRDb250ZW50ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IHdpbmRTcGVlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcud2luZC1zcGVlZCcpO1xuICAgIH1cblxuICAgIHNldCB3aW5kU3BlZWQodmFsdWUpIHtcbiAgICAgICAgdGhpcy53aW5kU3BlZWQudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgcHJlc3N1cmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnByZXNzdXJlJyk7XG4gICAgfVxuXG4gICAgc2V0IHByZXNzdXJlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMucHJlc3N1cmUudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgc3VucmlzZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc3VucmlzZScpXG4gICAgfVxuICAgIHNldCBzdW5yaXNlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuc3VucmlzZS50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBzdW5zZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnN1bnNldCcpXG4gICAgfVxuICAgIHNldCBzdW5zZXQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5zdW5zZXQudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgd2VhdGhlckNvbmRpdGlvbkRlc2MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignaDInKTtcbiAgICB9XG4gICAgc2V0IHdlYXRoZXJDb25kaXRpb25EZXNjKHZhbHVlKSB7XG4gICAgICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbkRlc2MudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgd2VhdGhlckNvbmRpdGlvbkltZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcbiAgICB9XG5cbiAgICBzZXQgd2VhdGhlckNvbmRpdGlvbkltZyh2YWx1ZSkge1xuICAgICAgICB0aGlzLndlYXRoZXJDb25kaXRpb25JbWcuc3JjID0gYC4vaW1hZ2VzLyR7dmFsdWV9LnBuZ2A7XG4gICAgICAgIHRoaXMud2VhdGhlckNvbG9yKHZhbHVlKTtcblxuICAgIH1cblxuICAgIGdldCBiYWNrZ3JvdW5kVmlkZW8oKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlkZW8nKTtcbiAgICB9XG4gICAgc2V0IGJhY2tncm91bmRWaWRlbyh2YWx1ZSkge1xuICAgICAgICB0aGlzLmJhY2tncm91bmRWaWRlby5zcmMgPSB2YWx1ZTtcbiAgICB9XG59IiwiaW1wb3J0IENpdHlJbmZvVmlldyBmcm9tIFwiLi9jaXR5SW5mb1ZpZXdcIjtcbmltcG9ydCBDdXJyZW50V2VhdGhlclZpZXcgZnJvbSBcIi4vY3VycmVudFdlYXRoZXJWaWV3XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1haW5WaWV3IHtcbiAgICBhcHBlbmRDaXR5SW5mbyhjaXR5SW5mbykge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdHktaW5mbycpO1xuICAgICAgICBuZXcgQ2l0eUluZm9WaWV3KGVsZW1lbnQsIGNpdHlJbmZvKTtcbiAgICB9XG5cbiAgICBhcHBlbmRDdXJycmVudFdlYXRoZXIoY3VycmVudFdlYXRoZXIpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3VycmVudC13ZWF0aGVyXCIpO1xuICAgICAgICBuZXcgQ3VycmVudFdlYXRoZXJWaWV3KGVsZW1lbnQsIGN1cnJlbnRXZWF0aGVyKTtcbiAgICB9XG5cbn0iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgLyohIG5vcm1hbGl6ZS5jc3MgdjguMC4xIHwgTUlUIExpY2Vuc2UgfCBnaXRodWIuY29tL25lY29sYXMvbm9ybWFsaXplLmNzcyAqL1xuXG5cbi8qIERvY3VtZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXG4gKi9cblxuaHRtbCB7XG4gICAgbGluZS1oZWlnaHQ6IDEuMTU7XG4gICAgLyogMSAqL1xuICAgIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTtcbiAgICAvKiAyICovXG59XG5cblxuLyogU2VjdGlvbnNcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4vKipcbiAgICogUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxuICAgKi9cblxuYm9keSB7XG4gICAgbWFyZ2luOiAwO1xufVxuXG5cbi8qKlxuICAgKiBSZW5kZXIgdGhlIFxcYG1haW5cXGAgZWxlbWVudCBjb25zaXN0ZW50bHkgaW4gSUUuXG4gICAqL1xuXG5tYWluIHtcbiAgICBkaXNwbGF5OiBibG9jaztcbn1cblxuXG4vKipcbiAgICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gXFxgaDFcXGAgZWxlbWVudHMgd2l0aGluIFxcYHNlY3Rpb25cXGAgYW5kXG4gICAqIFxcYGFydGljbGVcXGAgY29udGV4dHMgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpLlxuICAgKi9cblxuaDEge1xuICAgIGZvbnQtc2l6ZTogMmVtO1xuICAgIG1hcmdpbjogMC42N2VtIDA7XG59XG5cblxuLyogR3JvdXBpbmcgY29udGVudFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbi8qKlxuICAgKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxuICAgKiAyLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlIGFuZCBJRS5cbiAgICovXG5cbmhyIHtcbiAgICBib3gtc2l6aW5nOiBjb250ZW50LWJveDtcbiAgICAvKiAxICovXG4gICAgaGVpZ2h0OiAwO1xuICAgIC8qIDEgKi9cbiAgICBvdmVyZmxvdzogdmlzaWJsZTtcbiAgICAvKiAyICovXG59XG5cblxuLyoqXG4gICAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gICAqIDIuIENvcnJlY3QgdGhlIG9kZCBcXGBlbVxcYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXG4gICAqL1xuXG5wcmUge1xuICAgIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTtcbiAgICAvKiAxICovXG4gICAgZm9udC1zaXplOiAxZW07XG4gICAgLyogMiAqL1xufVxuXG5cbi8qIFRleHQtbGV2ZWwgc2VtYW50aWNzXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuLyoqXG4gICAqIFJlbW92ZSB0aGUgZ3JheSBiYWNrZ3JvdW5kIG9uIGFjdGl2ZSBsaW5rcyBpbiBJRSAxMC5cbiAgICovXG5cbmEge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xufVxuXG5cbi8qKlxuICAgKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxuICAgKiAyLiBBZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgSUUsIE9wZXJhLCBhbmQgU2FmYXJpLlxuICAgKi9cblxuYWJiclt0aXRsZV0ge1xuICAgIGJvcmRlci1ib3R0b206IG5vbmU7XG4gICAgLyogMSAqL1xuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICAgIC8qIDIgKi9cbiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7XG4gICAgLyogMiAqL1xufVxuXG5cbi8qKlxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxuICAgKi9cblxuYixcbnN0cm9uZyB7XG4gICAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcbn1cblxuXG4vKipcbiAgICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAgICogMi4gQ29ycmVjdCB0aGUgb2RkIFxcYGVtXFxgIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAgICovXG5cbmNvZGUsXG5rYmQsXG5zYW1wIHtcbiAgICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7XG4gICAgLyogMSAqL1xuICAgIGZvbnQtc2l6ZTogMWVtO1xuICAgIC8qIDIgKi9cbn1cblxuXG4vKipcbiAgICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gICAqL1xuXG5zbWFsbCB7XG4gICAgZm9udC1zaXplOiA4MCU7XG59XG5cblxuLyoqXG4gICAqIFByZXZlbnQgXFxgc3ViXFxgIGFuZCBcXGBzdXBcXGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXG4gICAqIGFsbCBicm93c2Vycy5cbiAgICovXG5cbnN1YixcbnN1cCB7XG4gICAgZm9udC1zaXplOiA3NSU7XG4gICAgbGluZS1oZWlnaHQ6IDA7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuc3ViIHtcbiAgICBib3R0b206IC0wLjI1ZW07XG59XG5cbnN1cCB7XG4gICAgdG9wOiAtMC41ZW07XG59XG5cblxuLyogRW1iZWRkZWQgY29udGVudFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbi8qKlxuICAgKiBSZW1vdmUgdGhlIGJvcmRlciBvbiBpbWFnZXMgaW5zaWRlIGxpbmtzIGluIElFIDEwLlxuICAgKi9cblxuaW1nIHtcbiAgICBib3JkZXItc3R5bGU6IG5vbmU7XG59XG5cblxuLyogRm9ybXNcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4vKipcbiAgICogMS4gQ2hhbmdlIHRoZSBmb250IHN0eWxlcyBpbiBhbGwgYnJvd3NlcnMuXG4gICAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cbiAgICovXG5cbmJ1dHRvbixcbmlucHV0LFxub3B0Z3JvdXAsXG5zZWxlY3QsXG50ZXh0YXJlYSB7XG4gICAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XG4gICAgLyogMSAqL1xuICAgIGZvbnQtc2l6ZTogMTAwJTtcbiAgICAvKiAxICovXG4gICAgbGluZS1oZWlnaHQ6IDEuMTU7XG4gICAgLyogMSAqL1xuICAgIG1hcmdpbjogMDtcbiAgICAvKiAyICovXG59XG5cblxuLyoqXG4gICAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxuICAgKiAxLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlLlxuICAgKi9cblxuYnV0dG9uLFxuaW5wdXQge1xuICAgIC8qIDEgKi9cbiAgICBvdmVyZmxvdzogdmlzaWJsZTtcbn1cblxuXG4vKipcbiAgICogUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBFZGdlLCBGaXJlZm94LCBhbmQgSUUuXG4gICAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cbiAgICovXG5cbmJ1dHRvbixcbnNlbGVjdCB7XG4gICAgLyogMSAqL1xuICAgIHRleHQtdHJhbnNmb3JtOiBub25lO1xufVxuXG5cbi8qKlxuICAgKiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxuICAgKi9cblxuYnV0dG9uLFxuW3R5cGU9XCJidXR0b25cIl0sXG5bdHlwZT1cInJlc2V0XCJdLFxuW3R5cGU9XCJzdWJtaXRcIl0ge1xuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xufVxuXG5cbi8qKlxuICAgKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxuICAgKi9cblxuYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJidXR0b25cIl06Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cInJlc2V0XCJdOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJzdWJtaXRcIl06Oi1tb3otZm9jdXMtaW5uZXIge1xuICAgIGJvcmRlci1zdHlsZTogbm9uZTtcbiAgICBwYWRkaW5nOiAwO1xufVxuXG5cbi8qKlxuICAgKiBSZXN0b3JlIHRoZSBmb2N1cyBzdHlsZXMgdW5zZXQgYnkgdGhlIHByZXZpb3VzIHJ1bGUuXG4gICAqL1xuXG5idXR0b246LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cImJ1dHRvblwiXTotbW96LWZvY3VzcmluZyxcblt0eXBlPVwicmVzZXRcIl06LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cInN1Ym1pdFwiXTotbW96LWZvY3VzcmluZyB7XG4gICAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xufVxuXG5cbi8qKlxuICAgKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXG4gICAqL1xuXG5maWVsZHNldCB7XG4gICAgcGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xufVxuXG5cbi8qKlxuICAgKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxuICAgKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIFxcYGZpZWxkc2V0XFxgIGVsZW1lbnRzIGluIElFLlxuICAgKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XG4gICAqICAgIFxcYGZpZWxkc2V0XFxgIGVsZW1lbnRzIGluIGFsbCBicm93c2Vycy5cbiAgICovXG5cbmxlZ2VuZCB7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAvKiAxICovXG4gICAgY29sb3I6IGluaGVyaXQ7XG4gICAgLyogMiAqL1xuICAgIGRpc3BsYXk6IHRhYmxlO1xuICAgIC8qIDEgKi9cbiAgICBtYXgtd2lkdGg6IDEwMCU7XG4gICAgLyogMSAqL1xuICAgIHBhZGRpbmc6IDA7XG4gICAgLyogMyAqL1xuICAgIHdoaXRlLXNwYWNlOiBub3JtYWw7XG4gICAgLyogMSAqL1xufVxuXG5cbi8qKlxuICAgKiBBZGQgdGhlIGNvcnJlY3QgdmVydGljYWwgYWxpZ25tZW50IGluIENocm9tZSwgRmlyZWZveCwgYW5kIE9wZXJhLlxuICAgKi9cblxucHJvZ3Jlc3Mge1xuICAgIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuXG4vKipcbiAgICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXG4gICAqL1xuXG50ZXh0YXJlYSB7XG4gICAgb3ZlcmZsb3c6IGF1dG87XG59XG5cblxuLyoqXG4gICAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxuICAgKiAyLiBSZW1vdmUgdGhlIHBhZGRpbmcgaW4gSUUgMTAuXG4gICAqL1xuXG5bdHlwZT1cImNoZWNrYm94XCJdLFxuW3R5cGU9XCJyYWRpb1wiXSB7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAvKiAxICovXG4gICAgcGFkZGluZzogMDtcbiAgICAvKiAyICovXG59XG5cblxuLyoqXG4gICAqIENvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIENocm9tZS5cbiAgICovXG5cblt0eXBlPVwibnVtYmVyXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xuICAgIGhlaWdodDogYXV0bztcbn1cblxuXG4vKipcbiAgICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXG4gICAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxuICAgKi9cblxuW3R5cGU9XCJzZWFyY2hcIl0ge1xuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkO1xuICAgIC8qIDEgKi9cbiAgICBvdXRsaW5lLW9mZnNldDogLTJweDtcbiAgICAvKiAyICovXG59XG5cblxuLyoqXG4gICAqIFJlbW92ZSB0aGUgaW5uZXIgcGFkZGluZyBpbiBDaHJvbWUgYW5kIFNhZmFyaSBvbiBtYWNPUy5cbiAgICovXG5cblt0eXBlPVwic2VhcmNoXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG59XG5cblxuLyoqXG4gICAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gICAqIDIuIENoYW5nZSBmb250IHByb3BlcnRpZXMgdG8gXFxgaW5oZXJpdFxcYCBpbiBTYWZhcmkuXG4gICAqL1xuXG4gOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XG4gICAgLyogMSAqL1xuICAgIGZvbnQ6IGluaGVyaXQ7XG4gICAgLyogMiAqL1xufVxuXG5cbi8qIEludGVyYWN0aXZlXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuLypcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gRWRnZSwgSUUgMTArLCBhbmQgRmlyZWZveC5cbiAgICovXG5cbmRldGFpbHMge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xufVxuXG5cbi8qXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cbiAgICovXG5cbnN1bW1hcnkge1xuICAgIGRpc3BsYXk6IGxpc3QtaXRlbTtcbn1cblxuXG4vKiBNaXNjXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuLyoqXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cbiAgICovXG5cbnRlbXBsYXRlIHtcbiAgICBkaXNwbGF5OiBub25lO1xufVxuXG5cbi8qKlxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMC5cbiAgICovXG5cbltoaWRkZW5dIHtcbiAgICBkaXNwbGF5OiBub25lO1xufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlcy9ub21hcmxpemUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBLDJFQUEyRTs7O0FBRzNFOytF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RUk7O0FBRUo7SUFDSSxrQkFBa0I7QUFDdEI7OztBQUdBO2lGQUNpRjs7O0FBR2pGOztJQUVJOztBQUVKO0lBQ0ksYUFBYTtBQUNqQjs7O0FBR0E7O0lBRUk7O0FBRUo7SUFDSSxhQUFhO0FBQ2pCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cXG5cXG5cXG4vKiBEb2N1bWVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxcbiAqL1xcblxcbmh0bWwge1xcbiAgICBsaW5lLWhlaWdodDogMS4xNTtcXG4gICAgLyogMSAqL1xcbiAgICAtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IDEwMCU7XFxuICAgIC8qIDIgKi9cXG59XFxuXFxuXFxuLyogU2VjdGlvbnNcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuXFxuLyoqXFxuICAgKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG5cXG5ib2R5IHtcXG4gICAgbWFyZ2luOiAwO1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIFJlbmRlciB0aGUgYG1haW5gIGVsZW1lbnQgY29uc2lzdGVudGx5IGluIElFLlxcbiAgICovXFxuXFxubWFpbiB7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIGBoMWAgZWxlbWVudHMgd2l0aGluIGBzZWN0aW9uYCBhbmRcXG4gICAqIGBhcnRpY2xlYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXFxuICAgKi9cXG5cXG5oMSB7XFxuICAgIGZvbnQtc2l6ZTogMmVtO1xcbiAgICBtYXJnaW46IDAuNjdlbSAwO1xcbn1cXG5cXG5cXG4vKiBHcm91cGluZyBjb250ZW50XFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcblxcbi8qKlxcbiAgICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gRmlyZWZveC5cXG4gICAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxcbiAgICovXFxuXFxuaHIge1xcbiAgICBib3gtc2l6aW5nOiBjb250ZW50LWJveDtcXG4gICAgLyogMSAqL1xcbiAgICBoZWlnaHQ6IDA7XFxuICAgIC8qIDEgKi9cXG4gICAgb3ZlcmZsb3c6IHZpc2libGU7XFxuICAgIC8qIDIgKi9cXG59XFxuXFxuXFxuLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuXFxucHJlIHtcXG4gICAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlO1xcbiAgICAvKiAxICovXFxuICAgIGZvbnQtc2l6ZTogMWVtO1xcbiAgICAvKiAyICovXFxufVxcblxcblxcbi8qIFRleHQtbGV2ZWwgc2VtYW50aWNzXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcblxcbi8qKlxcbiAgICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxcbiAgICovXFxuXFxuYSB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIDEuIFJlbW92ZSB0aGUgYm90dG9tIGJvcmRlciBpbiBDaHJvbWUgNTctXFxuICAgKiAyLiBBZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgSUUsIE9wZXJhLCBhbmQgU2FmYXJpLlxcbiAgICovXFxuXFxuYWJiclt0aXRsZV0ge1xcbiAgICBib3JkZXItYm90dG9tOiBub25lO1xcbiAgICAvKiAxICovXFxuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xcbiAgICAvKiAyICovXFxuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDtcXG4gICAgLyogMiAqL1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXFxuICAgKi9cXG5cXG5iLFxcbnN0cm9uZyB7XFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkZXI7XFxufVxcblxcblxcbi8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gICAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcblxcbmNvZGUsXFxua2JkLFxcbnNhbXAge1xcbiAgICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7XFxuICAgIC8qIDEgKi9cXG4gICAgZm9udC1zaXplOiAxZW07XFxuICAgIC8qIDIgKi9cXG59XFxuXFxuXFxuLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcblxcbnNtYWxsIHtcXG4gICAgZm9udC1zaXplOiA4MCU7XFxufVxcblxcblxcbi8qKlxcbiAgICogUHJldmVudCBgc3ViYCBhbmQgYHN1cGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXFxuICAgKiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG5cXG5zdWIsXFxuc3VwIHtcXG4gICAgZm9udC1zaXplOiA3NSU7XFxuICAgIGxpbmUtaGVpZ2h0OiAwO1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuXFxuc3ViIHtcXG4gICAgYm90dG9tOiAtMC4yNWVtO1xcbn1cXG5cXG5zdXAge1xcbiAgICB0b3A6IC0wLjVlbTtcXG59XFxuXFxuXFxuLyogRW1iZWRkZWQgY29udGVudFxcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG5cXG4vKipcXG4gICAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXFxuICAgKi9cXG5cXG5pbWcge1xcbiAgICBib3JkZXItc3R5bGU6IG5vbmU7XFxufVxcblxcblxcbi8qIEZvcm1zXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcblxcbi8qKlxcbiAgICogMS4gQ2hhbmdlIHRoZSBmb250IHN0eWxlcyBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKiAyLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXFxuICAgKi9cXG5cXG5idXR0b24sXFxuaW5wdXQsXFxub3B0Z3JvdXAsXFxuc2VsZWN0LFxcbnRleHRhcmVhIHtcXG4gICAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XFxuICAgIC8qIDEgKi9cXG4gICAgZm9udC1zaXplOiAxMDAlO1xcbiAgICAvKiAxICovXFxuICAgIGxpbmUtaGVpZ2h0OiAxLjE1O1xcbiAgICAvKiAxICovXFxuICAgIG1hcmdpbjogMDtcXG4gICAgLyogMiAqL1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxcbiAgICogMS4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZS5cXG4gICAqL1xcblxcbmJ1dHRvbixcXG5pbnB1dCB7XFxuICAgIC8qIDEgKi9cXG4gICAgb3ZlcmZsb3c6IHZpc2libGU7XFxufVxcblxcblxcbi8qKlxcbiAgICogUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBFZGdlLCBGaXJlZm94LCBhbmQgSUUuXFxuICAgKiAxLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXFxuICAgKi9cXG5cXG5idXR0b24sXFxuc2VsZWN0IHtcXG4gICAgLyogMSAqL1xcbiAgICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcXG59XFxuXFxuXFxuLyoqXFxuICAgKiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiAgICovXFxuXFxuYnV0dG9uLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXSxcXG5bdHlwZT1cXFwicmVzZXRcXFwiXSxcXG5bdHlwZT1cXFwic3VibWl0XFxcIl0ge1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcXG59XFxuXFxuXFxuLyoqXFxuICAgKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAgICovXFxuXFxuYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXTo6LW1vei1mb2N1cy1pbm5lcixcXG5bdHlwZT1cXFwicmVzZXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lcixcXG5bdHlwZT1cXFwic3VibWl0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIge1xcbiAgICBib3JkZXItc3R5bGU6IG5vbmU7XFxuICAgIHBhZGRpbmc6IDA7XFxufVxcblxcblxcbi8qKlxcbiAgICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxcbiAgICovXFxuXFxuYnV0dG9uOi1tb3otZm9jdXNyaW5nLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXTotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwicmVzZXRcXFwiXTotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwic3VibWl0XFxcIl06LW1vei1mb2N1c3Jpbmcge1xcbiAgICBvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XFxufVxcblxcblxcbi8qKlxcbiAgICogQ29ycmVjdCB0aGUgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAgICovXFxuXFxuZmllbGRzZXQge1xcbiAgICBwYWRkaW5nOiAwLjM1ZW0gMC43NWVtIDAuNjI1ZW07XFxufVxcblxcblxcbi8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cXG4gICAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBJRS5cXG4gICAqIDMuIFJlbW92ZSB0aGUgcGFkZGluZyBzbyBkZXZlbG9wZXJzIGFyZSBub3QgY2F1Z2h0IG91dCB3aGVuIHRoZXkgemVybyBvdXRcXG4gICAqICAgIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuXFxubGVnZW5kIHtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgLyogMSAqL1xcbiAgICBjb2xvcjogaW5oZXJpdDtcXG4gICAgLyogMiAqL1xcbiAgICBkaXNwbGF5OiB0YWJsZTtcXG4gICAgLyogMSAqL1xcbiAgICBtYXgtd2lkdGg6IDEwMCU7XFxuICAgIC8qIDEgKi9cXG4gICAgcGFkZGluZzogMDtcXG4gICAgLyogMyAqL1xcbiAgICB3aGl0ZS1zcGFjZTogbm9ybWFsO1xcbiAgICAvKiAxICovXFxufVxcblxcblxcbi8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cXG4gICAqL1xcblxcbnByb2dyZXNzIHtcXG4gICAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG5cXG5cXG4vKipcXG4gICAqIFJlbW92ZSB0aGUgZGVmYXVsdCB2ZXJ0aWNhbCBzY3JvbGxiYXIgaW4gSUUgMTArLlxcbiAgICovXFxuXFxudGV4dGFyZWEge1xcbiAgICBvdmVyZmxvdzogYXV0bztcXG59XFxuXFxuXFxuLyoqXFxuICAgKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cXG4gICAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC5cXG4gICAqL1xcblxcblt0eXBlPVxcXCJjaGVja2JveFxcXCJdLFxcblt0eXBlPVxcXCJyYWRpb1xcXCJdIHtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgLyogMSAqL1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgICAvKiAyICovXFxufVxcblxcblxcbi8qKlxcbiAgICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxcbiAgICovXFxuXFxuW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxcblt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XFxuICAgIGhlaWdodDogYXV0bztcXG59XFxuXFxuXFxuLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cXG4gICAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxcbiAgICovXFxuXFxuW3R5cGU9XFxcInNlYXJjaFxcXCJdIHtcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7XFxuICAgIC8qIDEgKi9cXG4gICAgb3V0bGluZS1vZmZzZXQ6IC0ycHg7XFxuICAgIC8qIDIgKi9cXG59XFxuXFxuXFxuLyoqXFxuICAgKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXFxuICAgKi9cXG5cXG5bdHlwZT1cXFwic2VhcmNoXFxcIl06Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24ge1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XFxufVxcblxcblxcbi8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4gICAqIDIuIENoYW5nZSBmb250IHByb3BlcnRpZXMgdG8gYGluaGVyaXRgIGluIFNhZmFyaS5cXG4gICAqL1xcblxcbiA6Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XFxuICAgIC8qIDEgKi9cXG4gICAgZm9udDogaW5oZXJpdDtcXG4gICAgLyogMiAqL1xcbn1cXG5cXG5cXG4vKiBJbnRlcmFjdGl2ZVxcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG5cXG4vKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gRWRnZSwgSUUgMTArLCBhbmQgRmlyZWZveC5cXG4gICAqL1xcblxcbmRldGFpbHMge1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuXFxuLypcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcblxcbnN1bW1hcnkge1xcbiAgICBkaXNwbGF5OiBsaXN0LWl0ZW07XFxufVxcblxcblxcbi8qIE1pc2NcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuXFxuLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXFxuICAgKi9cXG5cXG50ZW1wbGF0ZSB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcblxcbi8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXFxuICAgKi9cXG5cXG5baGlkZGVuXSB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzBfX18gZnJvbSBcIi0hLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9ub21hcmxpemUuY3NzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fID0gbmV3IFVSTChcIi4uL2ltYWdlcy9tYWduaWZ5LnBuZ1wiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18uaShfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzBfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgOnJvb3Qge1xuICAgIC0tY2xyLW5ldXRyYWw6IGhzbCgwLCAwJSwgMTAwJSk7XG4gICAgLS1jbHItbmV1dHJhbC10cmFuc3A6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xNzEpO1xuICAgIC0tZmYtcHJpbWFyeTogJ0ZyZWVoYW5kJywgY3Vyc2l2ZTtcbiAgICAvKiBmb250IHdlaWdodCovXG4gICAgLS1mdy0zMDA6IDMwMDtcbiAgICAtLWZ3LTQwMDogNDAwO1xuICAgIC0tZnctNTAwOiA1MDA7XG4gICAgLS1mdy02MDA6IDYwMDtcbiAgICAtLWZ3LTcwMDogNzAwO1xufVxuXG4qIHtcbiAgICBtYXJnaW46IDA7XG4gICAgcGFkZGluZzogMDtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG5ib2R5IHtcbiAgICB3aWR0aDogMTAwdnc7XG4gICAgbWluLWhlaWdodDogMTAwdmg7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE0MiwgMjI3LCAyMzMpO1xuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1mZi1wcmltYXJ5KTtcbiAgICBjb2xvcjogI2ZmZmZmZjtcbiAgICBmb250LWZhbWlseTogdmFyKC0tZmYtcHJpbWFyeSk7XG4gICAgZm9udC1zaXplOiAxLjI1cmVtO1xufVxuXG5tYWluIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGhlaWdodDogMTAwdmg7XG4gICAgd2lkdGg6IDEwMHZ3O1xuICAgIHBhZGRpbmc6IDRyZW0gMnJlbTtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xufVxuXG4udmlkZW8tY29udGFpbmVyIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAwO1xuICAgIGxlZnQ6IDA7XG4gICAgd2lkdGg6IDEwMHZ3O1xuICAgIGhlaWdodDogMTAwdmg7XG4gICAgei1pbmRleDogLTU7XG59XG5cbnZpZGVvIHtcbiAgICB3aWR0aDogMTAwdnc7XG4gICAgaGVpZ2h0OiAxMDB2aDtcbiAgICBvYmplY3QtZml0OiBjb3Zlcjtcbn1cblxuLnVuaXRDLFxuLnVuaXRGIHtcbiAgICBmb250LXNpemU6IDAuODVyZW07XG4gICAgaGVpZ2h0OiAxNnB4O1xuICAgIHdpZHRoOiAxNnB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgY29sb3I6IGhzbCgwLCAwJSwgMCUpO1xuICAgIHotaW5kZXg6IDIwO1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgIHRleHQtc2hhZG93OiBub25lO1xufVxuXG4udW5pdEYge1xuICAgIGNvbG9yOiBoc2woMCwgMCUsIDEwMCUpO1xufVxuXG4uY2hlY2tib3gge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDNyZW07XG4gICAgbGVmdDogM3JlbTtcbn1cblxuLmNoZWNrYm94IHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgb3BhY2l0eTogMDtcbn1cblxuLmxhYmVsIHtcbiAgICBib3JkZXItcmFkaXVzOiA1MHB4O1xuICAgIHdpZHRoOiA1MDBweDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICBwYWRkaW5nOiA1cHg7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHJpZ2h0OiA1MHB4O1xuICAgIGZsb2F0OiByaWdodDtcbiAgICBoZWlnaHQ6IDI2cHg7XG4gICAgd2lkdGg6IDUwcHg7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxLjUpO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICMxMTE7XG59XG5cbi5sYWJlbCAuYmFsbCB7XG4gICAgaGVpZ2h0OiAyMHB4O1xuICAgIHdpZHRoOiAyMHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAycHg7XG4gICAgbGVmdDogMnB4O1xuICAgIGJhY2tncm91bmQ6ICNmNWY0ZjQ7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7XG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMnMgbGluZWFyO1xufVxuXG4uY2hlY2tib3g6Y2hlY2tlZCsubGFiZWwgLmJhbGwge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgyNHB4KTtcbn1cblxuLnNlYXJjaC13cmFwcGVyIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiAxMHB4O1xufVxuXG4uc2VhcmNoLXdyYXBwZXIgaW5wdXQge1xuICAgIHdpZHRoOiA0MCU7XG4gICAgcGFkZGluZzogMTBweCAxMHB4IDEwcHggNDBweDtcbiAgICBib3JkZXItcmFkaXVzOiAycmVtO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19ffSk7XG4gICAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAxMHB4IGNlbnRlcjtcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNhbGMoMXJlbSArIDAuNXZ3KTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgICB0ZXh0LXNoYWRvdzogbm9uZTtcbn1cblxuI2Vycm9yIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xuICAgIGNvbG9yOiBoc2woMCwgMTAwJSwgNTAlKTtcbn1cblxuLmNpdHktaW5mbyBoMSB7XG4gICAgbWFyZ2luOiAwLjNyZW0gMDtcbiAgICBsZXR0ZXItc3BhY2luZzogMC4xcmVtO1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTYwMCk7XG4gICAgZm9udC1zaXplOiAyLjVyZW07XG59XG5cbmgyIHtcbiAgICBmb250LXNpemU6IDEuNXJlbTtcbiAgICBmb250LXdlaWdodDogdmFyKC0tZnctMzAwKTtcbn1cblxuLmN1cnJlbnQtd2VhdGhlciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbn1cblxuLmN1cnJlbnQtd2VhdGhlcl9fY29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xufVxuXG4uY3VycmVudC13ZWF0aGVyX19jb250YWluZXIgaW1nIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLXNlbGY6IHN0YXJ0O1xuICAgIHdpZHRoOiBjYWxjKDdyZW0gKyAxMHZ3KTtcbn1cblxuLmN1cnJlbnQtd2VhdGhlcl9jb2ludGFpbmVyIGgxIHtcbiAgICBtYXJnaW46IDAuM3JlbSAwO1xuICAgIGZvbnQtc2l6ZTogNHJlbTtcbiAgICBmb250LXdlaWdodDogdmFyKC0tZnctNDAwKTtcbn1cblxuLmN1cnJlbnQtd2VhdGhlcl9fdGVtcCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuXG4uY3VycmVudC13ZWF0aGVyX19kZXRhaWxzIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYWxpZ24tc2VsZjogY2VudGVyO1xuICAgIGhlaWdodDogbWF4LWNvbnRlbnQ7XG4gICAgcGFkZGluZzogMnJlbSA0cmVtO1xuICAgIGdhcDogNHJlbTtcbiAgICBib3JkZXItcmFkaXVzOiAwLjVyZW07XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY2xyLW5ldXRyYWwtdHJhbnNwKTtcbn1cblxuLmN1cnJlbnQtd2VhdGhlcl9faXRlbSB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogMC41cmVtO1xuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xufVxuXG4uY3VycmVudC13ZWF0aGVyX19pdGVtIGltZyB7XG4gICAgd2lkdGg6IGNhbGMoMXJlbSArIDF2dyk7XG59XG5cbi5jdXJyZW50LXdlYXRoZXJfX2RldGFpbHNfX2NvbHVtbiB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGdhcDogMXJlbTtcbn1cblxuLmZvcmVjYXN0IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIHBhZGRpbmc6IDFyZW0gMnJlbTtcbiAgICBib3JkZXItcmFkaXVzOiAwLjVyZW07XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY2xyLW5ldXRyYWwtdHJhbnNwKTtcbn1cblxuLmZvcmVjYXN0X19pdGVtIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuLmZvcmVjYXN0X19pdGVtIGltZyB7XG4gICAgd2lkdGg6IGNhbGMoMnJlbSArIDN2dyk7XG59XG5cbi5jb2xvci1yYWluIHtcbiAgICBjb2xvcjogIzIwNWMxNDtcbn1cblxuLmNvbG9yLW1pc3Qge1xuICAgIGNvbG9yOiAjNWM5NDllO1xufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlcy9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQ0E7SUFDSSwrQkFBK0I7SUFDL0IsZ0RBQWdEO0lBQ2hELGlDQUFpQztJQUNqQyxlQUFlO0lBQ2YsYUFBYTtJQUNiLGFBQWE7SUFDYixhQUFhO0lBQ2IsYUFBYTtJQUNiLGFBQWE7QUFDakI7O0FBRUE7SUFDSSxTQUFTO0lBQ1QsVUFBVTtJQUNWLHNCQUFzQjtBQUMxQjs7QUFFQTtJQUNJLFlBQVk7SUFDWixpQkFBaUI7SUFDakIsb0NBQW9DO0lBQ3BDLDhCQUE4QjtJQUM5QixjQUFjO0lBQ2QsOEJBQThCO0lBQzlCLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsNkJBQTZCO0lBQzdCLGtCQUFrQjtJQUNsQixhQUFhO0lBQ2IsWUFBWTtJQUNaLGtCQUFrQjtJQUNsQixnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSSxrQkFBa0I7SUFDbEIsTUFBTTtJQUNOLE9BQU87SUFDUCxZQUFZO0lBQ1osYUFBYTtJQUNiLFdBQVc7QUFDZjs7QUFFQTtJQUNJLFlBQVk7SUFDWixhQUFhO0lBQ2IsaUJBQWlCO0FBQ3JCOztBQUVBOztJQUVJLGtCQUFrQjtJQUNsQixZQUFZO0lBQ1osV0FBVztJQUNYLGtCQUFrQjtJQUNsQixhQUFhO0lBQ2IsdUJBQXVCO0lBQ3ZCLG1CQUFtQjtJQUNuQixxQkFBcUI7SUFDckIsV0FBVztJQUNYLG9CQUFvQjtJQUNwQixpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSx1QkFBdUI7QUFDM0I7O0FBRUE7SUFDSSxrQkFBa0I7SUFDbEIsU0FBUztJQUNULFVBQVU7QUFDZDs7QUFFQTtJQUNJLGtCQUFrQjtJQUNsQixVQUFVO0FBQ2Q7O0FBRUE7SUFDSSxtQkFBbUI7SUFDbkIsWUFBWTtJQUNaLGVBQWU7SUFDZixhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLDhCQUE4QjtJQUM5QixZQUFZO0lBQ1osa0JBQWtCO0lBQ2xCLFdBQVc7SUFDWCxZQUFZO0lBQ1osWUFBWTtJQUNaLFdBQVc7SUFDWCxxQkFBcUI7SUFDckIsc0JBQXNCO0FBQzFCOztBQUVBO0lBQ0ksWUFBWTtJQUNaLFdBQVc7SUFDWCxrQkFBa0I7SUFDbEIsa0JBQWtCO0lBQ2xCLFFBQVE7SUFDUixTQUFTO0lBQ1QsbUJBQW1CO0lBQ25CLDBCQUEwQjtJQUMxQixpQ0FBaUM7QUFDckM7O0FBRUE7SUFDSSwyQkFBMkI7QUFDL0I7O0FBRUE7SUFDSSxrQkFBa0I7SUFDbEIsYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsU0FBUztBQUNiOztBQUVBO0lBQ0ksVUFBVTtJQUNWLDRCQUE0QjtJQUM1QixtQkFBbUI7SUFDbkIsWUFBWTtJQUNaLHlEQUE0QztJQUM1Qyw0QkFBNEI7SUFDNUIsZ0NBQWdDO0lBQ2hDLG1DQUFtQztJQUNuQyx1QkFBdUI7SUFDdkIsaUJBQWlCO0FBQ3JCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLGlCQUFpQjtJQUNqQix3QkFBd0I7QUFDNUI7O0FBRUE7SUFDSSxnQkFBZ0I7SUFDaEIsc0JBQXNCO0lBQ3RCLHlCQUF5QjtJQUN6QiwwQkFBMEI7SUFDMUIsaUJBQWlCO0FBQ3JCOztBQUVBO0lBQ0ksaUJBQWlCO0lBQ2pCLDBCQUEwQjtBQUM5Qjs7QUFFQTtJQUNJLGFBQWE7SUFDYiw2QkFBNkI7QUFDakM7O0FBRUE7SUFDSSxhQUFhO0FBQ2pCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLGlCQUFpQjtJQUNqQix3QkFBd0I7QUFDNUI7O0FBRUE7SUFDSSxnQkFBZ0I7SUFDaEIsZUFBZTtJQUNmLDBCQUEwQjtBQUM5Qjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsdUJBQXVCO0FBQzNCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQixrQkFBa0I7SUFDbEIsbUJBQW1CO0lBQ25CLGtCQUFrQjtJQUNsQixTQUFTO0lBQ1QscUJBQXFCO0lBQ3JCLDJDQUEyQztBQUMvQzs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsV0FBVztJQUNYLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsU0FBUztBQUNiOztBQUVBO0lBQ0ksYUFBYTtJQUNiLDZCQUE2QjtJQUM3QixXQUFXO0lBQ1gsa0JBQWtCO0lBQ2xCLHFCQUFxQjtJQUNyQiwyQ0FBMkM7QUFDL0M7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLGNBQWM7QUFDbEI7O0FBRUE7SUFDSSxjQUFjO0FBQ2xCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBpbXBvcnQgdXJsKC4vbm9tYXJsaXplLmNzcyk7XFxuOnJvb3Qge1xcbiAgICAtLWNsci1uZXV0cmFsOiBoc2woMCwgMCUsIDEwMCUpO1xcbiAgICAtLWNsci1uZXV0cmFsLXRyYW5zcDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE3MSk7XFxuICAgIC0tZmYtcHJpbWFyeTogJ0ZyZWVoYW5kJywgY3Vyc2l2ZTtcXG4gICAgLyogZm9udCB3ZWlnaHQqL1xcbiAgICAtLWZ3LTMwMDogMzAwO1xcbiAgICAtLWZ3LTQwMDogNDAwO1xcbiAgICAtLWZ3LTUwMDogNTAwO1xcbiAgICAtLWZ3LTYwMDogNjAwO1xcbiAgICAtLWZ3LTcwMDogNzAwO1xcbn1cXG5cXG4qIHtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG5ib2R5IHtcXG4gICAgd2lkdGg6IDEwMHZ3O1xcbiAgICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE0MiwgMjI3LCAyMzMpO1xcbiAgICBmb250LWZhbWlseTogdmFyKC0tZmYtcHJpbWFyeSk7XFxuICAgIGNvbG9yOiAjZmZmZmZmO1xcbiAgICBmb250LWZhbWlseTogdmFyKC0tZmYtcHJpbWFyeSk7XFxuICAgIGZvbnQtc2l6ZTogMS4yNXJlbTtcXG59XFxuXFxubWFpbiB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIGhlaWdodDogMTAwdmg7XFxuICAgIHdpZHRoOiAxMDB2dztcXG4gICAgcGFkZGluZzogNHJlbSAycmVtO1xcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG5cXG4udmlkZW8tY29udGFpbmVyIHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICB0b3A6IDA7XFxuICAgIGxlZnQ6IDA7XFxuICAgIHdpZHRoOiAxMDB2dztcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXG4gICAgei1pbmRleDogLTU7XFxufVxcblxcbnZpZGVvIHtcXG4gICAgd2lkdGg6IDEwMHZ3O1xcbiAgICBoZWlnaHQ6IDEwMHZoO1xcbiAgICBvYmplY3QtZml0OiBjb3ZlcjtcXG59XFxuXFxuLnVuaXRDLFxcbi51bml0RiB7XFxuICAgIGZvbnQtc2l6ZTogMC44NXJlbTtcXG4gICAgaGVpZ2h0OiAxNnB4O1xcbiAgICB3aWR0aDogMTZweDtcXG4gICAgYm9yZGVyLXJhZGl1czogOHB4O1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgY29sb3I6IGhzbCgwLCAwJSwgMCUpO1xcbiAgICB6LWluZGV4OiAyMDtcXG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICAgIHRleHQtc2hhZG93OiBub25lO1xcbn1cXG5cXG4udW5pdEYge1xcbiAgICBjb2xvcjogaHNsKDAsIDAlLCAxMDAlKTtcXG59XFxuXFxuLmNoZWNrYm94IHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICB0b3A6IDNyZW07XFxuICAgIGxlZnQ6IDNyZW07XFxufVxcblxcbi5jaGVja2JveCB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgb3BhY2l0eTogMDtcXG59XFxuXFxuLmxhYmVsIHtcXG4gICAgYm9yZGVyLXJhZGl1czogNTBweDtcXG4gICAgd2lkdGg6IDUwMHB4O1xcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gICAgcGFkZGluZzogNXB4O1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIHJpZ2h0OiA1MHB4O1xcbiAgICBmbG9hdDogcmlnaHQ7XFxuICAgIGhlaWdodDogMjZweDtcXG4gICAgd2lkdGg6IDUwcHg7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMS41KTtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzExMTtcXG59XFxuXFxuLmxhYmVsIC5iYWxsIHtcXG4gICAgaGVpZ2h0OiAyMHB4O1xcbiAgICB3aWR0aDogMjBweDtcXG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHRvcDogMnB4O1xcbiAgICBsZWZ0OiAycHg7XFxuICAgIGJhY2tncm91bmQ6ICNmNWY0ZjQ7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwcHgpO1xcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4ycyBsaW5lYXI7XFxufVxcblxcbi5jaGVja2JveDpjaGVja2VkKy5sYWJlbCAuYmFsbCB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgyNHB4KTtcXG59XFxuXFxuLnNlYXJjaC13cmFwcGVyIHtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBnYXA6IDEwcHg7XFxufVxcblxcbi5zZWFyY2gtd3JhcHBlciBpbnB1dCB7XFxuICAgIHdpZHRoOiA0MCU7XFxuICAgIHBhZGRpbmc6IDEwcHggMTBweCAxMHB4IDQwcHg7XFxuICAgIGJvcmRlci1yYWRpdXM6IDJyZW07XFxuICAgIGJvcmRlcjogbm9uZTtcXG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKC4uL2ltYWdlcy9tYWduaWZ5LnBuZyk7XFxuICAgIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICAgIGJhY2tncm91bmQtcG9zaXRpb246IDEwcHggY2VudGVyO1xcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNhbGMoMXJlbSArIDAuNXZ3KTtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICAgIHRleHQtc2hhZG93OiBub25lO1xcbn1cXG5cXG4jZXJyb3Ige1xcbiAgICBkaXNwbGF5OiBub25lO1xcbiAgICBmb250LXNpemU6IDEuNXJlbTtcXG4gICAgY29sb3I6IGhzbCgwLCAxMDAlLCA1MCUpO1xcbn1cXG5cXG4uY2l0eS1pbmZvIGgxIHtcXG4gICAgbWFyZ2luOiAwLjNyZW0gMDtcXG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuMXJlbTtcXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXG4gICAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTYwMCk7XFxuICAgIGZvbnQtc2l6ZTogMi41cmVtO1xcbn1cXG5cXG5oMiB7XFxuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgICBmb250LXdlaWdodDogdmFyKC0tZnctMzAwKTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlciB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19jb250YWluZXIge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19jb250YWluZXIgaW1nIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgYWxpZ24tc2VsZjogc3RhcnQ7XFxuICAgIHdpZHRoOiBjYWxjKDdyZW0gKyAxMHZ3KTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9jb2ludGFpbmVyIGgxIHtcXG4gICAgbWFyZ2luOiAwLjNyZW0gMDtcXG4gICAgZm9udC1zaXplOiA0cmVtO1xcbiAgICBmb250LXdlaWdodDogdmFyKC0tZnctNDAwKTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9fdGVtcCB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19kZXRhaWxzIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgYWxpZ24tc2VsZjogY2VudGVyO1xcbiAgICBoZWlnaHQ6IG1heC1jb250ZW50O1xcbiAgICBwYWRkaW5nOiAycmVtIDRyZW07XFxuICAgIGdhcDogNHJlbTtcXG4gICAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbC10cmFuc3ApO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19pdGVtIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgZ2FwOiAwLjVyZW07XFxuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19pdGVtIGltZyB7XFxuICAgIHdpZHRoOiBjYWxjKDFyZW0gKyAxdncpO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19kZXRhaWxzX19jb2x1bW4ge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBnYXA6IDFyZW07XFxufVxcblxcbi5mb3JlY2FzdCB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgcGFkZGluZzogMXJlbSAycmVtO1xcbiAgICBib3JkZXItcmFkaXVzOiAwLjVyZW07XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNsci1uZXV0cmFsLXRyYW5zcCk7XFxufVxcblxcbi5mb3JlY2FzdF9faXRlbSB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5mb3JlY2FzdF9faXRlbSBpbWcge1xcbiAgICB3aWR0aDogY2FsYygycmVtICsgM3Z3KTtcXG59XFxuXFxuLmNvbG9yLXJhaW4ge1xcbiAgICBjb2xvcjogIzIwNWMxNDtcXG59XFxuXFxuLmNvbG9yLW1pc3Qge1xcbiAgICBjb2xvcjogIzVjOTQ5ZTtcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgaWYgKCF1cmwpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG4gIHVybCA9IFN0cmluZyh1cmwuX19lc01vZHVsZSA/IHVybC5kZWZhdWx0IDogdXJsKTtcblxuICAvLyBJZiB1cmwgaXMgYWxyZWFkeSB3cmFwcGVkIGluIHF1b3RlcywgcmVtb3ZlIHRoZW1cbiAgaWYgKC9eWydcIl0uKlsnXCJdJC8udGVzdCh1cmwpKSB7XG4gICAgdXJsID0gdXJsLnNsaWNlKDEsIC0xKTtcbiAgfVxuICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgdXJsICs9IG9wdGlvbnMuaGFzaDtcbiAgfVxuXG4gIC8vIFNob3VsZCB1cmwgYmUgd3JhcHBlZD9cbiAgLy8gU2VlIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtdmFsdWVzLTMvI3VybHNcbiAgaWYgKC9bXCInKCkgXFx0XFxuXXwoJTIwKS8udGVzdCh1cmwpIHx8IG9wdGlvbnMubmVlZFF1b3Rlcykge1xuICAgIHJldHVybiBcIlxcXCJcIi5jb25jYXQodXJsLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKS5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKSwgXCJcXFwiXCIpO1xuICB9XG4gIHJldHVybiB1cmw7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHtcblx0XHRcdHZhciBpID0gc2NyaXB0cy5sZW5ndGggLSAxO1xuXHRcdFx0d2hpbGUgKGkgPiAtMSAmJiAhc2NyaXB0VXJsKSBzY3JpcHRVcmwgPSBzY3JpcHRzW2ktLV0uc3JjO1xuXHRcdH1cblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5iID0gZG9jdW1lbnQuYmFzZVVSSSB8fCBzZWxmLmxvY2F0aW9uLmhyZWY7XG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8ganNvbnAgZnVuY3Rpb24iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCAnLi4vc3R5bGVzL3N0eWxlLmNzcyc7XG5pbXBvcnQgTWFpbk1vZGVsIGZyb20gJy4vbW9kZWxzL21haW5Nb2RlbCc7XG5pbXBvcnQgTWFpblZpZXcgZnJvbSAnLi92aWV3cy9tYWluVmlldydcbmltcG9ydCBNYWluQ29udHJvbGxlciBmcm9tICcuL2NvbnRyb2xsZXJzL21haW5Db250cm9sbGVyJztcblxuXG5jb25zdCBtb2RlbCA9IG5ldyBNYWluTW9kZWwoKTtcbmNvbnN0IHZpZXcgPSBuZXcgTWFpblZpZXcoKTtcbmNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgTWFpbkNvbnRyb2xsZXIobW9kZWwsIHZpZXcpO1xuXG5jb25zdCBkID0gbmV3IERhdGUoKTtcbmNvbnNvbGUubG9nKGQpOyJdLCJuYW1lcyI6WyJNYWluQ29udHJvbGxlciIsImNvbnN0cnVjdG9yIiwibW9kZWwiLCJ2aWV3IiwiY2l0eSIsInVuaXQiLCJsb2FkcGFnZSIsImNpdHlJbmZvIiwiZ2V0Q2l0eUluZm8iLCJjdXJyZW50V2VhdGhlciIsImdldEN1cnJlbnRXZWF0aGVyIiwiY29uc29sZSIsImxvZyIsImFwcGVuZENpdHlJbmZvIiwiYXBwZW5kQ3VycnJlbnRXZWF0aGVyIiwiQVBJcyIsInVybEdlbmVyYXRvciIsIlVybEdlbmVyZXRvciIsImdldEdlb0Nvb3JkaW5hdGVzIiwidXJsIiwiZ2VuZXJhdGVHZW9Db29yZHNVcmwiLCJyZXNwb25zZSIsImZldGNoIiwibW9kZSIsImdlb0NvZGluZ0RhdGEiLCJqc29uIiwibGF0IiwibG9uIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInN0eWxlIiwiZGlzcGxheSIsImVycm9yIiwiZ2V0Q3VycmVudFdlYXRoZXJEYXRhIiwiZ2VuZXJhdGVDdXJyZW50V2VhdGhlciIsIndlYXRoZXJEYXRhIiwiZ2V0Rm9yZWNhc3RXZWF0aGVyRGF0YSIsImdlbmVyYXRlRm9yZWNhc3RXZWF0aGVyIiwiZm9yZWNhc3REYXRhIiwiYXBwSWQiLCJiYXNlVXJsIiwiQ2l0eUluZm8iLCJBcGlEYXRhIiwiY2l0eURlc2NyaXB0aW9uIiwiY3JlYXRlQ2l0eURlc2NyaXB0aW9uIiwiZGF0ZURlc2NyaXB0aW9uIiwiY3JlYXRlRGF0ZURlc2NyaXB0aW9uIiwibmFtZSIsImNvdW50cnkiLCJzeXMiLCJkYXkiLCJnZXREYXkiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJ3ZWVrZGF5IiwiZCIsIkRhdGUiLCJtb250aE5hbWVzIiwiQ3VycmVudFdlYXRoZXIiLCJjdXJyZW50V2VhdGhlckRhdGEiLCJ0ZW1wZXJhdHVyZSIsImdldFRlbXBlcmF0dXJlIiwiTWF0aCIsInJvdW5kIiwibWFpbiIsInRlbXAiLCJmZWVsc0xpa2VUZW1wIiwiZmVlbHNfbGlrZSIsImh1bWlkaXR5Iiwid2luZFNwZWVkIiwid2luZCIsInNwZWVkIiwicHJlc3N1cmUiLCJzdW5yaXNlIiwiY29udmVydFRvU2VhcmNoZWRDaXR5VGltZSIsInRpbWV6b25lIiwic3Vuc2V0Iiwid2VhdGhlckNvbmRpdGlvbkRlc2MiLCJ3ZWF0aGVyIiwiZGVzY3JpcHRpb24iLCJ3ZWF0aGVyQ29uZGl0aW9uSW1nIiwiZ2V0d2VhdGhlckNvbmRpdGlvbkltZyIsImJhY2tncm91bmRWaWRlbyIsImdldEJhY2tncm91bmRWaWRlbyIsImRlZ3JlZXMiLCJjb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlIiwidW5peFRpbWUiLCJsb2NhbERhdGUiLCJ1dGNVbml4VGltZSIsImdldFRpbWUiLCJnZXRUaW1lem9uZU9mZnNldCIsInVuaXhUaW1lSW5TZWFyY2hlZENpdHkiLCJkYXRlSW5TZWFyY2hlZENpdHkiLCJob3VycyIsImdldEhvdXJzIiwibWludXRlcyIsImdldE1pbnV0ZXMiLCJmb3JtYXR0ZWRUaW1lIiwidmFsdWUiLCJzdW5yaXNlVW5peCIsInN1bnNldFVuaXgiLCJtaXN0RXF1aXZhbGVudGVzIiwiaW5jbHVkZXMiLCJjdXJyZW50RGF0ZSIsInN1bnJpc2VEYXRlIiwic3Vuc2V0RGF0ZSIsIndlYXRoZXJDb25kaXRpb24iLCJ2aWRlb0xpbmtzIiwiQ2xlYXJEYXkiLCJDbGVhck5pZ2h0IiwiQ2xvdWRzIiwiTWlzdCIsIlJhaW4iLCJUaHVuZGVyc3Rvcm0iLCJNYWluTW9kZWwiLCJkYXRhIiwiQ2l0eUluZm9WaWV3IiwiZWxlbWVudCIsImNpdHlJbmZvTW9kZWwiLCJxdWVyeVNlbGVjdG9yIiwidGV4dENvbnRlbnQiLCJDdXJyZW50V2VhdGhlclZpZXciLCJjdXJyZW50V2VhdGhlck1vZGVsIiwid2VhdGhlckNvbG9yIiwiYm9keSIsImNsYXNzTGlzdCIsImFkZCIsInNyYyIsIk1haW5WaWV3IiwiY29udHJvbGxlciJdLCJzb3VyY2VSb290IjoiIn0=