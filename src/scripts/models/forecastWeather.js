export default class ForecastWeather {
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