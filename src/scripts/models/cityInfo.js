export default class cityInfo {
    constructor(ApiData) {
        this.cityDescription = this.createCityDescription(ApiData);
        this.dateDescription = this.createDateDescription(ApiData);
    }

    createCityDescription(ApiData) {
        const city = ApiData.name;
        const { country } = ApiData.sys;

        return `${city},${country}`;
    }

}