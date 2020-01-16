//Css
import './css/app.css';
import './css/environmentDetails.css';
import './css/popup.css';
//Dependencies
import FormControls from './js/formControls';

//Start program
document.addEventListener('DOMContentLoaded', (event) => {
    window.prompt = window.require('electron-prompt');
    const formControls = new FormControls();
});