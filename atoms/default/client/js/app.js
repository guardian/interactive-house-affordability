import { Map as mapGl, Popup as Popup } from 'maplibre-gl';
import dark from 'assets/gv-dark.json'
import dataRaw from 'assets/sheet.json'
import Formula from 'shared/js/components/Formula.js'
import Validate from 'shared/js/components/Validation.js'
import postcodes from 'assets/areas-codes.json'

const tooltip = document.querySelector('#gv-map-tooltip');
const errorMessage = document.querySelector('#error-mesage');
const form = document.querySelector('#gv-form')
const next = document.querySelector('#nextBtn')
const prev = document.querySelector('#prevBtn')
const reset = document.querySelector('#resetBtn')
const tabs = document.querySelectorAll('.gv-tab')
const salaryInput = document.querySelector('#gv-salary-input')
const searchInput = document.querySelector('#gv-autoComplete')



const data = dataRaw.sheets.Master;

const bounds = [[-7.57216793459, 49.959999905], [1.68153079591, 58.6350001085]];
const maxBounds = [[-24, 49.959999905], [18, 58.6350001085]];

let map = new mapGl({
    container: 'gv-map', // container id
    style: dark,
    //bounds: bounds,
    zoom: 5.5,
    center:[-0.118092,54.509865],
    interactive: true,
    maxZoom:10,
    maxBounds: maxBounds,
   // scrollZoom:false,
    boxZoom:true
    
});

map.on("wheel", event => {

    console.log('on wheel')

    //TODO: Display sscroll mesagge

    if (event.originalEvent.ctrlKey) {
        return;
    }

    if (event.originalEvent.metaKey) {
        return;
    }

    if (event.originalEvent.altKey) {
        return;
    }

    event.preventDefault();
});


map.on("load", () => {

});

const onValidate = (callback) => {

    if(callback.type === 'salary'){

    }
    else if(callback.type === 'search'){

        let code = callback.value.detail.selection.value.code.split(' - ')[0]

        let match = data.find(d => d.Postcode_district === code)

        map.flyTo({
            zoom:10,
            center: [match.x,match.y],
            essential: true
        });
    }
}

const validationForm = new Validate({
    form:form,
    next:next,
    prev:prev,
    salaryInput:salaryInput,
    searchInput:searchInput,
    postcodes:postcodes,
    errorMessage:errorMessage,
    reset:reset,
    callback:onValidate,
    currentTab:0,
    tabs:tabs
})



