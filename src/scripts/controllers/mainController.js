export default class MainController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.city = {};
        this.unit = "metric";


        const search = document.getElementById('search');
        const checkbox = document.getElementById('checkbox-unit');

        search.addEventListener('blur', (e) => this.loadpage(search.value));
        search.addEventListener('keypress', e => this.checkIfEnter(e));
        window.addEventListener('load', () => this.loadpage('nairobi'));
        checkbox.addEventListener('change', e => this.changeTemperature(e));


    }


    async loadpage(city) {
        document.getElementById('video').playbackRate = 0.5;
        this.city = city;

        const cityInfo = await this.model.getCityInfo(city, this.unit);
        const currentWeather = await this.model.getCurrentWeather(city, this.unit);
        const forecastWeather = await this.model.getForecastWeather(city, this.unit);



        this.view.appendCityInfo(cityInfo);
        this.view.appendCurrrentWeather(currentWeather);
        this.view.appendForecastWeather(forecastWeather);
    }

    checkIfEnter(e) {
        if (e.key === 'Enter') search.blur();
    }

    changeTemperature(e) {
        const unit = e.currentTarget.checked ? "imperial" : "metric";
        this.view.changeUnitTemp(unit);
        this.unit = unit;
        this.loadpage(this.city);
    }
}