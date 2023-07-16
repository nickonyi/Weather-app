export default class ForecastWeather {
    constructor(forecastWeatherData, unit) {
        this.temperature = this.getTemperature(forecastWeatherData, unit);
        this.weatherCondition = this.getWeatherConditions(forecastWeatherData);
        this.time = this.getTime(forecastWeatherData);


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
        const { timezone } = forecastWeatherData.city;
        forecastWeatherData.list.forEach(item => {
            const cond = this.getWeatherConditionImg(item.weather[0].main, item.dt, sunriseUnix, sunsetUnix, timezone);
            weatherCondition.push(cond);
        });
        return weatherCondition;
    }

    getTime(forecastWeatherData) {
        const times = [];
        const { timezone } = forecastWeatherData.city;
        forecastWeatherData.list.forEach(item => {
            const time = this.convertToSearchedTime(item, timezone);
            times.push(time);
        });
        return times;
    }

    convertToSearchedTime(unixTime, timezone) {
        const localDate = new Date(unixTime.dt * 1000);
        const utcUnixTime = localDate.getTime() + localDate.getTimezoneOffset() * 60000;
        const unixTimeInSearchedCity = utcUnixTime + timezone * 1000;
        const dateInsearchedCity = new Date(unixTimeInSearchedCity);
        const hours = dateInsearchedCity.getHours();
        const time = `${hours}:00`;
        return time;
    }
}