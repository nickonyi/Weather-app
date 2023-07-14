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
        this.backgroundVideo = this.getBackgroundVideo(this.weatherConditionImg);

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

    getBackgroundVideo(weatherCondition) {
        const videoLinks = {
            ClearDay: "https://player.vimeo.com/external/420221145.hd.mp4?s=3959bcbf4829a95ce4b2940192074d7469ff984b&profile_id=175&oauth2_token_id=57447761",
            ClearNight: "https://player.vimeo.com/external/333584599.sd.mp4?s=df21eca618f9749cf2f734fee7c94fc1a09d0f54&amp;profile_id=164&amp;oauth2_token_id=57447761",
            Clouds: "https://player.vimeo.com/external/444192978.hd.mp4?s=18ab734562d8c4ea0ec2fed7f16f3edf6158ddcc&profile_id=172&oauth2_token_id=57447761",
            Mist: "https://player.vimeo.com/external/350241088.hd.mp4?s=3a287426e0146dab6ea738f4629c6f0989a89603&profile_id=172&oauth2_token_id=57447761",
            Rain: "https://player.vimeo.com/progressive_redirect/playback/708629823/rendition/720p/file.mp4?loc=external&oauth2_token_id=57447761&signature=9951e451334fdfbcf9eb6b8c933fd01dd12a54a03fdb371f0da864a17aaeaf29",
            Mist: "https://player.vimeo.com/external/350241088.hd.mp4?s=3a287426e0146dab6ea738f4629c6f0989a89603&profile_id=172&oauth2_token_id=57447761",
            Thunderstorm: "https://player.vimeo.com/external/480223896.hd.mp4?s=e4b94f0b5700bfa68cb6f02b41f94ecca91242e9&profile_id=169&oauth2_token_id=57447761"

        }
        return videoLinks[weatherCondition];
    }
}