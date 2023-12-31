export default class CurrentWeatherView {
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
        this.nowWeatherCondition = currentWeatherModel.weatherConditionImg;
        this.nowTemperature = currentWeatherModel.temperature;


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
        return this.element.querySelector('.sunrise')
    }
    set sunrise(value) {
        this.sunrise.textContent = value;
    }

    get sunset() {
        return this.element.querySelector('.sunset')
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

    get nowWeatherCondition() {
        return document.getElementById('forecast__item__current__condition');
    }
    set nowWeatherCondition(value) {
        this.nowWeatherCondition.src = `./images/${value}.png`;
    }

    get nowTemperature() {
        return document.getElementById('forecast__item__current__temp');
    }

    set nowTemperature(value) {
        this.nowTemperature.textContent = value;
    }
}