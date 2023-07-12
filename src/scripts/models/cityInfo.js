export default class CityInfo {
    constructor(ApiData) {
        this.cityDescription = this.createCityDescription(ApiData);

    }

    createCityDescription(ApiData) {
        const city = ApiData.name;
        const { country } = ApiData.sys;

        return `${city},${country}`;
    }

}