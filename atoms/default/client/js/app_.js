import { Map as mapGl, Popup as Popup } from 'maplibre-gl';
import dark from 'assets/gv-dark.json'
import dataRaw from 'assets/sheet.json'
import Search from 'shared/js/components/Search.js'
import Salary from 'shared/js/components/Salary.js'
import Expression from 'shared/js/components/Expression.js'
import Form from 'shared/js/components/Form.js'
import postcodes from 'assets/areas-codes.json'

const tooltip = document.querySelector('#gv-map-tooltip');
const salaryInput = document.querySelector('#map-salary-input');
const errorMessage = document.querySelector('#error-mesage');
const next = document.querySelector('#nextBtn');
const prev = document.querySelector('#prevBtn');
const reset = document.querySelector('#resetBtn');

//https://docs.google.com/spreadsheets/d/11SLL55WwROril-6407448VlmwpEBA28iAe8g95SjPUs/edit#gid=0

//https://interactive.guim.co.uk/docsdata-test/11SLL55WwROril-6407448VlmwpEBA28iAe8g95SjPUs.json

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

const getColor = (name) => {
    switch(name){
        case 'Dark green':
            return '#056DA1'
            break
        case 'Mid green':
            return '#1896D7'
            break
        case 'Light green':
            return '#E6F5FF'
            break
        case 'Light red':
            return '#ffbac8'
            break
        case 'Mid red':
            return '#c70000'
            break
        case 'Dark red':
            return '#880105'
            break
        case 'Yellow':
            return '#ffe500'
            break
        case '-':
            return '#dadada'
            break
        case 'CAN AFFORD TO BUY BUT NOT RENT':
            return '#ffe500'
            break
    }
}



map.on("load", () => {

    const source = map.getSource('vector-tiles');

    const matchExpression = ["match",["get", "PostDist"]];

    data.forEach(d => {

        try{

            let code = d.Postcode_district;
            let value = d.staggered_colour;

            if(code != '' && value != '')
            {
            
                let color = getColor(value)

                matchExpression.push(code,color);
            }

        }
        catch(err){
            console.log(err)
        }
    })

    matchExpression.push('#dadada');

    console.log(matchExpression)

    map.setPaintProperty("postal-districts",'fill-color', matchExpression)

    let hoveredStateId = null

    map.on('mousemove', 'postal-districts',  (e) => {

        let match = data.find(f => f.Postcode_district === e.features[0].properties.PostDist);

        tooltip.innerHTML = e.features[0].properties.PostDist + ' | ' + e.features[0].properties.Sprawl + "<br>" +
        match.Median_house_price + ' ('+ parseInt(match.Median_house_price / (match.median_pay_per_LA_x2)) + ' times annual salary)'  + "<br>" +
        match.monthly_rent + ' (' + Math.round((match.monthly_rent * 100) / ((match.median_pay_per_LA_x2)/12)) + '% of monthly salary)<br>' +
        'The majority of areas in this postcode district fall in the [xx?] local authority.'
        
        tooltip.style.left = e.point.x + 20 + 'px'
        tooltip.style.top = e.point.y + 'px'

        if (e.features.length > 0)
        {
            if (hoveredStateId)
            {
                map.setFeatureState(
                    { source: 'vector-tiles', sourceLayer: 'PostalDistrict', id: hoveredStateId },
                    { hover: false }
                );
            }

            hoveredStateId = e.features[0].id;
            
            map.setFeatureState(
                { source: 'vector-tiles', sourceLayer: 'PostalDistrict', id: hoveredStateId },
                { hover: true }
            );
        }
    });

    

    map.on('mouseenter', 'postal-districts', function (e) {
        // Change the cursor style as a UI indicator.

        map.getCanvas().style.cursor = 'pointer';

        //console.log(e.features[0])
         
        var coordinates = e.features[0].geometry.coordinates.slice();

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            
        }
    })

    map.on('mouseleave', 'postal-districts', function () {

        tooltip.innerHTML = '';

        if (hoveredStateId) {
        map.setFeatureState(
        { source: 'vector-tiles', sourceLayer: 'PostalDistrict', id: hoveredStateId },
        { hover: false }
        );
        }
        hoveredStateId = null;
    });

});

const onValidate = (callback) => {

    console.log('callback', callback)

    if(callback.type === 'salary'){
        if(callback.value){
            //prep next button
            next.disabled = false;
            next.className = 'active';
            errorMessage.innerHTML = ''
        }
        else{
            //render error message disable next button
            next.disabled = true;
            next.className = 'inactive';
            errorMessage.innerHTML = 'Please, enter a valid figure'
        }
    }

    if(callback.type === 'search'){

        if(!callback.value){
            errorMessage.innerHTML = 'no results'
        }
        else if(callback.value === 'element'){
            errorMessage.innerHTML = ''
        }
        else{
            errorMessage.innerHTML = '';
    
            let code = callback.value.detail.selection.value.code.split(' - ')[0]
    
            let match = data.find(d => d.Postcode_district === code)
    
            validationForm.setArea(match)
    
            //paint stroke of selected area
            map.setFeatureState({
                source: 'vector-tiles',
                sourceLayer: 'PostalDistrict',
                id: code,
                }, {
                hover: true
            });
    
            //zoom map
            map.flyTo({
                zoom:10,
                center: [match.x,match.y],
                essential: true // this animation is considered essential with respect to prefers-reduced-motion
                });
            
            //writes selected value in search box
            document.querySelector("#map-autoComplete").value = callback.value.detail.selection.value.areaCode;
        }

    }

    if(callback.type === 'tab'){

        console.log('tab')

        if(callback.value == 1){
            console.log('salary',salary.getSalary())
            let expression = new Expression(data, salary.getSalary())

            map.setPaintProperty("postal-districts",'fill-color', expression.expression())

        }

        if(callback.value == -1){

        }
    }
    
}


const validationForm = new Form({
    next:next,
    prev:prev,
    reset:reset,
    callback:onValidate
})

const search = new Search({
    selector: "#map-autoComplete",
    data: postcodes,
    keys: ["areaCode"],
    placeHolder: 'Search by area or district code',
    callback:onValidate
});

search.autoCompleteJs()

const salary = new Salary({
    input:salaryInput,
    callback:onValidate
})