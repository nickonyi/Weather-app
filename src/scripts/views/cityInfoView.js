export default class CityInfoView {
    constructor(element, cityInfoModel) {
        this.element = element;
        this.model = cityInfoModel;
        this.city = cityInfoModel.cityDescription;
    }

    get city() {
        return this.element.querySelector('h1');
    }
    set city(value) {
        this.city.textContent = value;
    }
}