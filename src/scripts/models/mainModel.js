import APIs from "./APIs";
import CityInfo from "./cityInfo";

export default class MainModel {
    constructor() {
        this.data = {};
        this.APIs = new APIs();
    }
    async getCityInfo(city, unit) {
        const ApiData = await this.APIs.getCurrentWeatherData(city, unit);
        const cityInfo = new CityInfo(ApiData);
        return cityInfo;
    }
}