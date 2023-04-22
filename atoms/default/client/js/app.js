import Navigation from "shared/js/components/Navigation";
import Search from "shared/js/components/Search"
import Map from "shared/js/components/Map"
import postcodes from 'assets/codes.json'
import dark from 'assets/gv-dark.json'
import Expression from 'shared/js/components/Expression.js'
import dataRaw from 'assets/sheet.json'
import Table from "../../../../shared/js/components/Table";
import Article from "../../../../shared/js/components/Article";

import Form from 'shared/js/components/Form'

const isMobile = window.matchMedia('(max-width: 600px)').matches; 

const data = dataRaw

const tooltip = document.querySelector('#gv-map-tooltip');

const salaryInput = document.querySelector('#gv-salary-input')
const salaryErrorMessage = document.querySelector('#gv-salary__error-mesage');
const bedroomsSelect = document.querySelector('#gv-bedrooms-input')
const next = document.querySelector('#nextBtn')
const prev = document.querySelector('#prevBtn')
const tabs = document.querySelectorAll('.gv-tab')

const articleTag = document.querySelector('#gv-article')
const tableTag = document.querySelector('#gv-table')

const article = new Article({
    article:articleTag
})
const table = new Table({
    table:tableTag
})

const buttonNames = [
    {step:0, button:next, name:'Start'},
    {step:1, button:prev, name:'Back'},
    {step:1, button:next, name:'Submit'},
    {step:2, button:prev, name:'Reset'},
]

const searchInput = document.querySelector('#gv-autoComplete')

const placeHolder = 'Start typing a postcode'
const searchErrorMessage = document.querySelector('#gv-location__error-mesage');
const codes = postcodes;
const resetBtn = document.querySelector('.gv-location-reset__btn');

let hoverId = null;
let clickedId = null;

let bounds = [[-7.57216793459, 49.959999905], [1.68153079591, 58.6350001085]];
let maxBounds = [[-22,49],[16,61]];
let container = 'gv-map'
let style = dark
let zoom = 5
let center = [-2.95,55.35]
let mapFeatures 

const onMapLoaded = () => {
    mapFeatures = map.getMap().querySourceFeatures('vector-tiles', {
        sourceLayer: 'PostalDistrictwgs84bb'
    });

    onNavChange(0)
}



const onMapMove = (event) => {

    let match = data.find(f => f.Postcode_District === event.features[0].properties.PostDist);

    if(match){

        tooltip.innerHTML = event.features[0].properties.PostDist + ' | ' + match.LA 
    
        tooltip.style.left = event.point.x + 20 + 'px'
        tooltip.style.top = event.point.y + 'px'

        if (event.features.length > 0)
        {
            map.highlightArea(event.features[0].id,'hover')
        }

    }
    else{
        map.highlightArea(null)
        tooltip.innerHTML = ''
    }
}

const onMapLeave = (event) => {

    map.getMap().getCanvas().style.cursor = 'default';

    tooltip.innerHTML = '';

    map.highlightArea(null)
}

const onMapClick = (event) => {

    let maxx = event.features[0].properties['postal-district-bounding-boxes_maxx']
    let maxy = event.features[0].properties['postal-district-bounding-boxes_maxy']
    let minx = event.features[0].properties['postal-district-bounding-boxes_minx']
    let miny = event.features[0].properties['postal-district-bounding-boxes_miny']
    let rooms = form.rooms.getRooms().value;

    let match = data.find(f => f.Postcode_District === event.features[0].properties.PostDist);

    if(match){

        if(match[rooms + 'Bed_USE'] != '-'){
            map.setAreaSelected(match.Postcode_District)
            map.zoomTo([[maxx,maxy],[minx,miny]])
            nav.setStep(2)
            onNavChange(2)
            map.highlightArea(event.features[0].id,'click')
            search.showResetBtn()
        } 
    }
    else{
        map.setAreaSelected(null)
    }

}

const map = new Map({
    maxBounds:maxBounds,
    container:container,
    style:style,
    zoom:zoom,
    center:center,
    tooltip:tooltip,
    onLoaded:onMapLoaded.bind(this),
    onMove:onMapMove.bind(this),
    onLeave:onMapLeave.bind(this),
    onClick:onMapClick.bind(this),
    interactive:isMobile ? false : true
})

const searchOnResult = (result) => {

    if(result)
    {
        if(result.value)
        {
            let selectedId = result.value.detail.selection.value.code
            let feature = mapFeatures.find(f => f.id === selectedId)
            
            let maxx = feature.properties['postal-district-bounding-boxes_maxx']
            let maxy = feature.properties['postal-district-bounding-boxes_maxy']
            let minx = feature.properties['postal-district-bounding-boxes_minx']
            let miny = feature.properties['postal-district-bounding-boxes_miny']

            let rooms = form.rooms.getRooms().value;
            let match = data.find(f => f.Postcode_District === selectedId);

            if(match){

                if(match[rooms + 'Bed_USE'] != '-'){
                    map.setAreaSelected(selectedId)
                    map.zoomTo([[maxx,maxy],[minx,miny]])
                    map.highlightArea()
                    nav.setStep(2)
                    onNavChange(2)
                    map.highlightArea(selectedId, 'click')
                } 
            }
            else{
                map.setAreaSelected(null)
            }
        }
    }
    else{
        map.reset()
    }
    
}

const search = new Search({    
    selector:'#gv-autoComplete',
    placeHolder:placeHolder,
    data: codes,
    errorMessage:searchErrorMessage,
    input:searchInput,
    keys:["code"],
    resetBtn:resetBtn,
    callback:searchOnResult
})

const onNavChange = (step) => {

    console.log("step: ", step)

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
        form.reset()
        nav.enable(next)
        search.reset()

        article.setData({
            header:'UK',
            paragraph:`Map shows affordability for median_pay_per_LA_x2 income`
        })
    }

    if(step == 1 && !form.getValid()){
        //map.reset()
        nav.disable(next)
    }
    else if(step == 1 && form.getValid()){
        //map.reset()
        nav.enable(next)
    }

    if(step == 2){
        
        let area = map.getAreaSelected();
        let match = data.find(f => f.Postcode_District === area);
        let salary = form.salary.getSalary().value;
        let rooms = form.rooms.getRooms().value;
        

        if(!area){
            console.log("no area selected")
            if(salary && rooms)
            {
                console.log("salary and rooms selected")
                tabs[0].style.display = 'block';
                tabs[2].style.display = 'none';
        
                article.setData({
                    header:'UK',
                    paragraph:`Based on a household income of ${form.salary.getSalary().value} and ${form.rooms.getRooms().value} room${form.rooms.getRooms().value > 1 ? 's' : ''}, the following areas are judged to be affordable. Select an area to get more detail.`
                })
            }
            else{
                console.log("neither salary nor rooms selected")
                tabs[0].style.display = 'none';
                tabs[2].style.display = 'block';

                table.setData({
                    header:area,
                    standfirst:`Table shows affordability in ${area} for a ${'£',match.median_pay_per_LA_x2} median pay`,
                    housePrice:match.AllSale_MedianPrice,
                    annualIncome:parseInt(match.AllSale_MedianPrice / match.median_pay_per_LA_x2) + ' times annual salary',
                    rentPrice:match.AllRent_MedianPrice,
                    percentincome:Math.round((match.AllRent_MedianPrice * 100) / ((match.median_pay_per_LA_x2)/12)) + '% of monthly salary',
                    label:`The majority of areas in this postcode district fall in ${match.LA} local authority.`
                })
            }
        }
        else{

            console.log('area selected')

            if(salary && rooms && match[rooms + 'Bed_USE'] != '-'){
                console.log("salary and rooms selected")
                let housePrice = match[`${rooms}BedSale_MedianPrice`];
                let houseRent = match[`${rooms}BedRent_MedianPrice`];

                tabs[2].style.display = 'block';
                tabs[0].style.display = 'none';

                table.setData({
                    header:map.getAreaSelected(),
                    standfirst:`Table shows affordability in ${area} for a ${salary} household income and ${rooms} rooms house`,
                    housePrice:housePrice,
                    annualIncome:parseInt(housePrice / salary) + ' times annual salary',
                    rentPrice:match[`${rooms}BedRent_MedianPrice`],
                    percentincome:Math.round((houseRent * 100) / ((salary)/12)) + '% of monthly salary',
                    label:`The majority of areas in this postcode district fall in ${match.LA} local authority.`
                })
            }
            else{
                console.log("neither salary nor rooms selected")
                tabs[0].style.display = 'block';
                tabs[2].style.display = 'none';

                article.setData({
                    header:map.getAreaSelected(),
                    paragraph:`Article shows % of postal districts like ${map.getAreaSelected()} in same situation`
                })

                nav.name(prev,'Back')
                //nav.reset()

            }
        }

        let expression = new Expression({data:data, salary:salary, rooms:rooms})
        map.paint(expression.getExpression())
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

    let rooms = form.rooms.getRooms().value;
    let salary = form.salary.getSalary().value;

    if(form.getValid()){

        let filtered = data.filter(f => f[rooms + "Bed_USE"] != '-')

        let newSearch = filtered.map(f => {

            return codes.find(c => c.code === f.Postcode_District)
        })

        search.autoComplete.data.src = newSearch;
        search.clean()
    }
}

const form = new Form({
    salaryInput:salaryInput,
    errorMessage:salaryErrorMessage,
    bedroomsSelect:bedroomsSelect,
    callback:onFormChange
})



