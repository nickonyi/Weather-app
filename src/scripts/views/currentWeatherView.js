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
}