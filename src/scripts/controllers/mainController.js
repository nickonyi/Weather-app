export default class MainController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.city = {};
        this.unit = "metric";
        this.city = "new york";
        this.loadpage(this.city);


    }


    async loadpage(city) {
        this.city = city;

        const cityInfo = await this.model.getCityInfo(city, this.unit);
        const currentWeather = await this.model.getCurrentWeather(city, this.unit);

        console.log(currentWeather);
        this.view.appendCityInfo(cityInfo);
        this.view.appendCurrrentWeather(currentWeather);
    }
}