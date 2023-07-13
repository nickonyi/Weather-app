import CityInfoView from "./cityInfoView";
import CurrentWeatherView from "./currentWeatherView";

export default class MainView {
    appendCityInfo(cityInfo) {
        const element = document.getElementById('city-info');
        new CityInfoView(element, cityInfo);
    }

    appendCurrrentWeather(currentWeather) {
        const element = document.getElementById("current-weather");
        new CurrentWeatherView(element, currentWeather);
    }

}