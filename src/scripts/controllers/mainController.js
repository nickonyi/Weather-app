export default class MainController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.city = {};
        this.unit = "metric";
        this.city = "Mombasa";
        this.loadpage(this.city);

    }


    async loadpage(city) {
        this.city = city;

        const cityInfo = await this.model.getCityInfo(city, this.unit);
        this.view.appendCityInfo(cityInfo);
    }
}