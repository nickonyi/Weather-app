export default class CurrentWeather {
    constructor(currentWeatherData, unit) {
        this.temperature = this.getTemperature(Math.round(currentWeatherData.main.temp), unit);
        this.feelsLikeTemp = this.getTemperature(Math.round(currentWeatherData.main.feels_like), unit);
        this.humidity = `${currentWeatherData.main.humidity}%`;
        this.windSpeed = `${currentWeatherData.wind.speed}m/s`;
        this.pressure = `${currentWeatherData.main.pressure} hPa`;
        this.sunrise = this.convertToSearchedCityTime(currentWeatherData.sys.sunrise, currentWeatherData.timezone);
        this.sunset = this.convertToSearchedCityTime(currentWeatherData.sys.sunset, currentWeatherData.timezone);
        this.weatherConditionDesc = currentWeatherData.weather[0].description;
        this.weatherConditionImg = this.getweatherConditionImg(
            currentWeatherData.weather[0].main,
            currentWeatherData.sys.sunrise,
            currentWeatherData.sys.sunset,
            currentWeatherData.timezone
        );
        console.log(this.weatherConditionImg);
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
}