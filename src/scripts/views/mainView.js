import CityInfoView from "./cityInfoView";

export default class MainView {
    appendCityInfo(cityInfo) {
        const element = document.getElementById('city-info');
        new CityInfoView(element, cityInfo);

    }
}