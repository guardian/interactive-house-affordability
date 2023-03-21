import { Map as mapGl, Popup as Popup } from 'maplibre-gl';
import dark from 'assets/gv-dark.json'
import dataRaw from 'assets/sheet.json'
import {scaleLinear} from "d3-scale"
import Search from 'shared/js/components/Search.js'
import postcodes from 'assets/areas-codes.json'

// Dark green
// Mid green
// -
// Light green
// Mid red
// Dark red
// Light red
// CAN AFFORD TO BUY BUT NOT RENT

//https://docs.google.com/spreadsheets/d/11SLL55WwROril-6407448VlmwpEBA28iAe8g95SjPUs/edit#gid=0

//https://interactive.guim.co.uk/docsdata-test/11SLL55WwROril-6407448VlmwpEBA28iAe8g95SjPUs.json

const data = dataRaw.sheets.Master;

const colorScale = scaleLinear()
.domain([
    0,1,2
]) 
.range(["#FF0000", "#00FF00", "#FFBF00"])

let map = new mapGl({
    container: 'gv-map', // container id
    style: dark,
    bounds: [[-9.0,49.75], [2.01,61.01]],
    interactive: true,
    zoom:6
});

const getColor = (name) => {
    switch(name){
        case 'Dark green':
            return '#236925'
            break
        case 'Mid green':
            return '#3db540'
            break
        case 'Light green':
            return '#69d1ca'
            break
        case 'Mid red':
            return '#c70000'
            break
        case 'Dark red':
            return '#880105'
            break
        case 'Light red':
            return '#ffbac8'
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

        let code = d.Postcode_district;
        let value = d.staggered_colour;

        let color = getColor(value)

        matchExpression.push(code,color);

    })

    matchExpression.push('#dadada');

    console.log(matchExpression)

    map.setPaintProperty("postal-districts",'fill-color', matchExpression)

    let hoveredStateId = null

    map.on('mousemove', 'postal-districts',  (e) => {

        var features = map.queryRenderedFeatures(e.point);

        

       // console.log(e.features[0].id)

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

        console.log(e.features[0])
         
        var coordinates = e.features[0].geometry.coordinates.slice();

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            
        }

        
    })

    map.on('mouseleave', 'postal-districts', function () {
        if (hoveredStateId) {
        map.setFeatureState(
        { source: 'vector-tiles', sourceLayer: 'PostalDistrict', id: hoveredStateId },
        { hover: false }
        );
        }
        hoveredStateId = null;
        });

});

// map.on('mousemove', function (e) {
   

//     console.log(features)
// })

// lights.map(d => {

//     if(d.code != '#N/A')countries.push({"country": d.country, "code": d.code})
// })

const onSelected = (feedback) => {
    console.log(map.getLayer('postal-districts'))

    console.log(map.querySourceFeatures('vector-tiles', {
        'sourceLayer': 'PostalDistrict'
      }))

    
    let code = feedback.detail.selection.value.code.split(' - ')[0]

    let match = data.find(d => d.Postcode_district === code)

    console.log(feedback.detail.selection.value)

    //map.setPaintProperty("postal-districts-stroke",'line-opacity', ["match",["get", "PostDist"],code,1,1])

    map.setFeatureState({
        source: 'vector-tiles',
        sourceLayer: 'PostalDistrict',
        id: code,
        }, {
        hover: true
        });

    // map.setFeatureState(
    //     { source: 'vector-tiles', sourceLayer: 'PostalDistrict', id: hoveredStateId },
    //     { hover: true }
    // );


    map.flyTo({
        zoom:10,
        center: [
        match.x,
        match.y
        ],
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });

    document.querySelector("#map-autoComplete").value = feedback.detail.selection.value.area;
}

const search = new Search({
    selector: "#map-autoComplete",
    data: postcodes,
    key: 'area',
    placeHolder: 'Search by area or district code',
    callback:onSelected
});

search.autoCompleteJs()



