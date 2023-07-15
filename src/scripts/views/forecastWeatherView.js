export default class ForecastWeatherView {
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
            this.weatherConditions[i].src = `./images/${value[i-1]}.png`;
        }
    }

}