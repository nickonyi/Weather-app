export default class CurrentWeather {
    constructor(currentWeatherData, unit) {
        this.temperature = this.getTemperature(Math.round(currentWeatherData.main.temp), unit);
        this.feelsLikeTemp = this.getTemperature(Math.round(currentWeatherData.main.feels_like), unit);
        this.humidity = `${currentWeatherData.main.humidity}%`;
        this.windSpeed = `${currentWeatherData.wind.speed}m/s`;
        this.pressure = `${currentWeatherData.main.pressure} hPa`;
        this.sunrise = this.convertToSearchedCityTime(currentWeatherData.sys.sunrise, currentWeatherData.timezone);
        this.sunset = this.convertToSearchedCityTime(currentWeatherData.sys.sunset, currentWeatherData.timezone);

    }

    getTemperature(degrees, unit) {
        return unit === "metric" ? `${degrees} ℃` : `${degrees} ℉`;
    }
    convertToSearchedCityDate(unixTime, timezone) {
        const localDate = unixTime === 0 ? new Date : new Date(unixTime * 1000);
        const utcUnixTime = localDate.getTime() + (localDate.getTimezoneOffset() * 60000);
        const unixTimeInSearchedCity = utcUnixTime + timezone * 1000;
        const dateInSearchedCity = new Date(unixTimeInSearchedCity)
        return dateInSearchedCity;
    }
    convertToSearchedCityTime(unixTime, timezone) {
        const dateInSearchedCity = this.convertToSearchedCityDate(unixTime, timezone);
        const hours = dateInSearchedCity.getHours();
        const minutes = `${dateInSearchedCity.getMinutes()}`;
        const formattedTime = `${hours}:${minutes}`;
        return formattedTime;
    }
}