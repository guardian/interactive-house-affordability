import Navigation from "shared/js/components/Navigation";
import Search from "shared/js/components/Search"
import Map from "shared/js/components/Map"
import postcodes from 'assets/areas-codes.json'
import dark from 'assets/gv-dark.json'
import Expression from 'shared/js/components/Expression.js'
import dataRaw from 'assets/sheet.json'

import Form from 'shared/js/components/Form'

const data = dataRaw.sheets.Master 

const tooltip = document.querySelector('#gv-map-tooltip');

const salaryInput = document.querySelector('#gv-salary-input')
const salaryErrorMessage = document.querySelector('#gv-salary__error-mesage');
const bedroomsSelect = document.querySelector('#gv-bedrooms-input')
const next = document.querySelector('#nextBtn')
const prev = document.querySelector('#prevBtn')
const tabs = document.querySelectorAll('.gv-tab')

const buttonNames = [
    {step:0, button:next, name:'Start'},
    {step:1, button:prev, name:'Back'},
    {step:1, button:next, name:'Submit'},
    {step:2, button:prev, name:'Reset'},
]

const searchInput = document.querySelector('#gv-autoComplete')

const placeHolder = 'Search by area or district code'
const searchErrorMessage = document.querySelector('#gv-location__error-mesage');
const codes = postcodes;
const resetBtn = document.querySelector('.gv-location-reset__btn');

let hoverId = null;

let bounds = [[-7.57216793459, 49.959999905], [1.68153079591, 58.6350001085]];
let maxBounds = [[-24, 49.959999905], [18, 58.6350001085]];
let container = 'gv-map'
let style = dark
let zoom = 5.5
let center = [-0.118092,54.509865]

const onMapLoaded = () => {
    onNavChange(0)
}

const onMapMove = (event) => {

    let match = data.find(f => f.Postcode_district === event.features[0].properties.PostDist);

    tooltip.innerHTML = event.features[0].properties.PostDist + ' | ' + event.features[0].properties.Sprawl + "<br>" +
    match.Median_house_price + ' ('+ parseInt(match.Median_house_price / (match.median_pay_per_LA_x2)) + ' times annual salary)'  + "<br>" +
    match.monthly_rent + ' (' + Math.round((match.monthly_rent * 100) / ((match.median_pay_per_LA_x2)/12)) + '% of monthly salary)<br>' +
    'The majority of areas in this postcode district fall in the [xx?] local authority.'
    
    tooltip.style.left = event.point.x + 20 + 'px'
    tooltip.style.top = event.point.y + 'px'

    if (event.features.length > 0)
    {
        if (hoverId)
        {
            map.getMap().setFeatureState(
                { source: 'vector-tiles', sourceLayer: 'PostalDistrict', id: hoverId },
                { hover: false }
            );
        }

        hoverId = event.features[0].id;
        
        map.getMap().setFeatureState(
            { source: 'vector-tiles', sourceLayer: 'PostalDistrict', id: hoverId },
            { hover: true }
        );
    }

}

const onMapLeave = (event) => {

    map.getMap().getCanvas().style.cursor = 'default';

    tooltip.innerHTML = '';

    if (hoverId) {

        map.getMap().setFeatureState(
            { source: 'vector-tiles', sourceLayer: 'PostalDistrict', id: hoverId },
            { hover: false }
        );  
    }

    hoverId = null;
}

const onMapClick = (event) => {

    let match = data.find(f => f.Postcode_district === event.features[0].properties.PostDist);
    map.setAreaSelected(match.Postcode_district)
    map.zoomTo([match.x,match.y])
    map.highlightArea()

    nav.setStep(2)
    onNavChange(2)

}

const map = new Map({
    bounds:bounds,
    maxBounds:maxBounds,
    container:container,
    style:style,
    zoom:zoom,
    center:center,
    tooltip:tooltip,
    onLoaded:onMapLoaded.bind(this),
    onMove:onMapMove.bind(this),
    onLeave:onMapLeave.bind(this),
    onClick:onMapClick.bind(this)
})

const searchOnResult = (result) => {

    if(result)
    {
        if(result.value)
        {
            let selectedId = result.value.detail.selection.value.code
            let match = data.find(d => d.Postcode_district === selectedId)

            map.setAreaSelected(selectedId)
            map.zoomTo([match.x,match.y])
            map.highlightArea()

            nav.setStep(2)
            onNavChange(2)
        }
        
    }
    else{
        map.zoomTo(center)
    }
    
}

new Search({    
    selector:'#gv-autoComplete',
    placeHolder:placeHolder,
    data: codes,
    errorMessage:searchErrorMessage,
    input:searchInput,
    keys:["areaCode"],
    resetBtn:resetBtn,
    callback:searchOnResult
})

const onNavChange = (step) => {

    console.log(step)

    tabs.forEach(tab => {
        tab.style.display = 'none'
    })

    tabs[step].style.display = 'block';

    let names = buttonNames.filter(b => b.step == step);

    buttonNames.forEach(n => {
        nav.hide(n.button)
    })

    names.forEach(n => {    
        nav.name(n.button,n.name)
        nav.show(n.button)

    })

    if(step == 0){

        let expression = new Expression({data:data})
        map.paint(expression.getExpression())
        map.reset()
    }

    if(step == 1 && !form.getValid()){
        map.reset()
        nav.disable(next)
    }
    else if(step == 1 && form.getValid()){
        map.reset()
        nav.enable(next)
    }

    if(step == 2){

        if(form.salary.getSalary())
        {

            let salary = form.salary.getSalary().value;
            let rooms = form.rooms.getRooms().value;

            let expression = new Expression({data:data, salary:salary, rooms:rooms})
            map.paint(expression.getExpression())

            console.log('UK results')
            console.log("Map shows affordability to salary input and house with selected rooms (2 by default)")

        }
        else{
            console.log("Postal district results")
            console.log("Map shows median_pay_per_LA_x2")
        }

        
    }

}

const nav = new Navigation({
    steps:3,
    next:next,
    prev:prev,
    callback:onNavChange
})

const onFormChange = () => {
    onNavChange(1)
}

const form = new Form({
    salaryInput:salaryInput,
    errorMessage:salaryErrorMessage,
    bedroomsSelect:bedroomsSelect,
    callback:onFormChange
})



