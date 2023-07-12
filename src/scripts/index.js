import '../styles/style.css';
import APIs from "./models/APIs";

const newAp = new APIs();
const cordinates = newAp.getGeoCoordinates('mombasa');
console.log(cordinates);

const wet = newAp.getCurrentWeatherData('kitale', 'metric');
console.log(wet);

const fore = newAp.getForecastWeatherData('nairobi', 'metric');
console.log(fore);