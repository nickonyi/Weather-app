import '../styles/style.css';
import MainModel from './models/mainModel';
import MainView from './views/mainView'
import MainController from './controllers/mainController';


const model = new MainModel();
const view = new MainView();
const controller = new MainController(model, view);
























//import APIs from "./models/APIs";



//const newAp = new APIs();
//const cordinates = newAp.getGeoCoordinates('mombasa');
//console.log(cordinates);
//
//const wet = newAp.getCurrentWeatherData('kitale', 'metric');
//console.log(wet);
//
//const fore = newAp.getForecastWeatherData('nairobi', 'metric');
//console.log(fore);