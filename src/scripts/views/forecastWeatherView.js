export default class ForecastWeatherView {
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