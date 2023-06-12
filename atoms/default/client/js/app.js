import Navigation from "shared/js/components/Navigation";
import Search from "shared/js/components/Search"
import Map from "shared/js/components/Map"
import postcodes from 'assets/codes.json'
import dark from 'assets/gv-dark.json'
import Expression from 'shared/js/components/Expression.js'
import dataRaw from 'assets/sheet.json'
import Table from "../../../../shared/js/components/Table";
import Article from "../../../../shared/js/components/Article";
import Form from 'shared/js/components/Form';
import {numberWithCommas} from 'shared/js/util'
import labels from 'assets/labels.json'

dark.sources.labels.data = labels;

const isMobile = window.matchMedia('(max-width: 600px)').matches;
const width = document.documentElement.clientWidth;

const data = dataRaw

const tooltip = document.querySelector('#gv-map-tooltip');

const salaryInput = document.querySelector('#gv-salary-input')
const salaryErrorMessage = document.querySelector('#gv-salary__error-mesage');
const bedroomsSelect = document.querySelector('#gv-bedrooms-input')
const depositSelect = document.querySelector('#gv-deposit-input')
const next = document.querySelector('#nextBtn')
const prev = document.querySelector('#prevBtn')
const tabs = document.querySelectorAll('.gv-tab')
const hide = document.querySelector('.gv-hide-panel')
const panel = document.querySelector('#gv-control-panel')

const articleTag = document.querySelector('#gv-article')
const tableTag = document.querySelector('#gv-table')

const article = new Article({
    article: articleTag
})

const table = new Table({
    table: tableTag
})

const buttonNames = [
    { step: 0, button: next, name: 'Compare your household' },
    { step: 1, button: prev, name: 'Back' },
    { step: 1, button: next, name: 'Submit' },
    { step: 2, button: prev, name: 'Compare your household' },
]

const searchInput = document.querySelector('#gv-search-box')

const placeHolder = 'Enter first part of postcode'
const searchErrorMessage = document.querySelector('#gv-location__error-mesage');
const codes = postcodes;
const resetBtn = document.querySelector('.gv-location-reset__btn');

let maxBounds = [[-30, 40], [19, 65]];
let container = 'gv-map'
let style = dark
let zoom = isMobile ? 4.5 : 5
let center = [-2.95, 55]
let mapFeatures;

const onMapLoaded = () => {
    
    mapFeatures = map.getMap().querySourceFeatures('vector-tiles', {
        sourceLayer: 'PostalDistrictwgs84bbsprawl'
    });

    onNavChange(0)
}

const onMapMove = (event) => {

    let tWidth = tooltip.getBoundingClientRect().width;

        tooltip.style.left = event.point.x + 10 + 'px'
        
        tooltip.style.top = event.point.y + 'px'

        if (event.features.length > 0) {
            map.highlightArea(event.features[0].id, 'hover')
        }

    if (event.features[0].properties.Locale) {

        tooltip.innerHTML = event.features[0].properties.PostDist + ' | ' + event.features[0].properties.Locale

    }
    else {

        let sprawl = event.features[0].properties.Sprawl ? ' | ' + event.features[0].properties.Sprawl : ''

        tooltip.innerHTML = event.features[0].properties.PostDist + sprawl


    }
}

const onMapLeave = (event) => {

    map.getMap().getCanvas().style.cursor = 'default';

    tooltip.innerHTML = '';
    tooltip.style.left = -1000 + 'px';

    map.highlightArea(null)
}

const onMapClick = (event) => {

    let maxx = event.features[0].properties['maxx']
    let maxy = event.features[0].properties['maxy']
    let minx = event.features[0].properties['minx']
    let miny = event.features[0].properties['miny']

    let rooms = form.rooms.getRooms().value;

    let match = data.find(f => f.Postcode_District === event.features[0].properties.PostDist);

    if (match) {

        if (match[rooms + 'Bed_USE'] != '-') {

            map.setAreaSelected(match.Postcode_District)
            map.zoomTo([[maxx, maxy], [minx, miny]])
            nav.setStep(2)
            isMobile ? nav.showPanel() : null
            onNavChange(2)
            map.highlightArea(event.features[0].id, 'click')

        }
    }
    else {
        map.setAreaSelected(null)
    }

}

const onZoomEnd = (event) => {
    if(map.getMap().getZoom() > zoom)search.enableResetBtn()
    else search.disableResetBtn()
    
}

const map = new Map({

    maxBounds: maxBounds,
    container: container,
    style: style,
    zoom: zoom,
    center: center,
    tooltip: tooltip,
    layer: 'postal-districts',
    onLoaded: onMapLoaded.bind(this),
    onMove: onMapMove.bind(this),
    onLeave: onMapLeave.bind(this),
    onClick: onMapClick.bind(this),
    onZoomEnd: onZoomEnd.bind(this),
    interactive: true

})

const searchOnResult = (result) => {

    if (result) {

        if (result.value) {

            let selectedId = result.value
            let feature = mapFeatures.find(f => f.id === selectedId)

            let maxx = feature.properties['maxx']
            let maxy = feature.properties['maxy']
            let minx = feature.properties['minx']
            let miny = feature.properties['miny']

            let rooms = form.rooms.getRooms().value;
            let match = data.find(f => f.Postcode_District === selectedId);

            if (match) {

                if (match[rooms + 'Bed_USE'] != '-') {
                    map.setAreaSelected(selectedId)
                    map.zoomTo([[maxx, maxy], [minx, miny]])
                    map.highlightArea()
                    nav.setStep(2)
                    isMobile ? nav.showPanel() : null
                    onNavChange(2)
                    map.highlightArea(selectedId, 'click')
                }
            }
            else {
                map.setAreaSelected(null)
            }
        }
    }
    else {
        map.reset()
        map.clean()
        onNavChange(2)
    }

}

const search = new Search({
    selector: '#gv-search-box',
    placeHolder: placeHolder,
    data: codes,
    errorMessage: searchErrorMessage,
    input: searchInput,
    keys: ["code"],
    resetBtn: resetBtn,
    callback: searchOnResult
})

const onNavChange = (step) => {

    tabs.forEach(tab => {
        tab.style.display = 'none'
    })

    tabs[step].style.display = 'block';

    let names = buttonNames.filter(b => b.step == step);

    buttonNames.forEach(n => {
        nav.hide(n.button)
    })

    names.forEach(n => {
        nav.name(n.button, n.name)
        nav.show(n.button)
    })

    search.restart()

    if (step == 0) {

        let expression = new Expression({ data: data })
        map.paint(expression.getExpression())
        map.reset()
        map.clean()
        form.reset()
        nav.enable(next)
        nav.setStep(0)

        article.setData({
            header: 'Where can you afford to buy or rent in Great Britain?',
            paragraph: `Click on a postcode district to see its property prices compared with the typical income of local dual-earner households. Or compare with your own household income below.`
        })
    }

    if (step == 1 && !form.getValid()) {
        nav.disable(next)
    }
    else if (step == 1 && form.getValid()) {
        nav.enable(next)
    }

    if (step == 2) {

        let area = map.getAreaSelected();
        let match = data.find(f => f.Postcode_District === area);
        let salary = form.salary.getSalary().value;
        let rooms = form.rooms.getRooms().value;
        let deposit = form.deposit.getDeposit().value;
        let depositStr = 100 - (deposit * 100)
        let roomsStr = ""

        switch(rooms){
            case 0:
                roomsStr = 'any';
                break
            case 1:
                roomsStr = 'one';
                break
            case 2:
                roomsStr = 'two';
                break
            case 3:
                roomsStr = 'three';
                break
            case 4:
                roomsStr = 'four';
        }

        if (!area) {

            tabs[2].style.display = 'none';
            tabs[0].style.display = 'block';

            if(isMobile){
                    
                nav.setCont(1)
                nav.hidePanel()
            }

            if (salary && rooms >= 0) {

                nav.setStep(2)

                article.setData({
                    header: 'Where you could afford',
                    paragraph: `Based on a household income of £${numberWithCommas(salary)} and ${roomsStr} bedroom${rooms > 1 ? 's' : ''}${roomsStr == 'four' ? ' or more' : ''}, the following areas are considered affordable. Select an area to get more detail.`
                })
            }
            else if(!salary && rooms == 0){

                onNavChange(0)

            }
        }
        else {

            if (salary && rooms>=0) {

                tabs[2].style.display = 'block';
                tabs[0].style.display = 'none';

                let housePrice = rooms > 0 ? match[`${rooms}BedSale_MedianPrice`] : match.AllSale_MedianPrice;
                let houseRent = rooms > 0 ?  match[`${rooms}BedRent_MedianPrice`] : match.AllRent_MedianPrice;

                table.setData({
                    header: area,
                    subheader:match['Town/Area'],
                    standfirst: `Housing affordability for £${numberWithCommas(salary)} household income and ${roomsStr == 'any' ? 'the median property' : roomsStr + '-bedroom properties'}. ${roomsStr == 'any' ? '' : 'Median figures for ' + roomsStr + '-bedroom properties only.'}`,
                    housePrice: `£${housePrice % 1 == 0 ? numberWithCommas(housePrice) : numberWithCommas(Number(housePrice).toFixed(2))}`,
                    annualIncome:'Mortgage ' +  numberWithCommas(((housePrice * deposit) / salary).toFixed(1)) + ' times annual income*',
                    rentPrice: `£${houseRent % 1 == 0 ? numberWithCommas(houseRent) : numberWithCommas(Number(houseRent).toFixed(2))}`,
                    percentincome: Math.round((houseRent * 100) / ((salary) / 12)) + '% of monthly income',
                    label: `As the majority of areas in this postcode district fall in ${match.LA} local authority the calculations are based on the median gross earnings of a couple in this council area. *Assumes ${depositStr}% deposit.`
                })
            }
            else {

                tabs[0].style.display = 'none';
                tabs[2].style.display = 'block';

                table.setData({
                    header: area,
                    subheader:match['Town/Area'],
                    standfirst: `Housing affordability for the median local household income of £${numberWithCommas(match.median_pay_per_LA_x2)} and the median property.`,
                    housePrice: `£${match.AllSale_MedianPrice % 1 == 0 ? numberWithCommas(match.AllSale_MedianPrice) : numberWithCommas(Number(match.AllSale_MedianPrice).toFixed(2))}`,
                    annualIncome:'Mortgage ' +  numberWithCommas(((match.AllSale_MedianPrice * deposit) / match.median_pay_per_LA_x2).toFixed(1)) + ' times annual income*',
                    rentPrice: `£${match.AllRent_MedianPrice % 1 == 0 ? numberWithCommas(match.AllRent_MedianPrice) : numberWithCommas(Number(match.AllRent_MedianPrice).toFixed(2))}`,
                    percentincome: Math.round((match.AllRent_MedianPrice * 100) / ((match.median_pay_per_LA_x2) / 12)) + '% of monthly income',
                    label: `As the majority of areas in this postcode district fall in ${match.LA} local authority the calculations are based on the median gross earnings of a couple in this council area. *Assumes ${depositStr}% deposit.`
                })

                nav.name(prev, 'Compare your household')
            }
        }

        let expression = new Expression({ data: data, salary: salary, rooms: rooms, deposit: deposit })
        map.paint(expression.getExpression())
    }
}

const nav = new Navigation({
    steps: 3,
    next: next,
    prev: prev,
    hide: hide,
    panel: panel,
    callback: onNavChange
})

const onFormChange = () => {

    onNavChange(1)

    let rooms = form.rooms.getRooms().value;
    let salary = form.salary.getSalary().value;

    if (form.getValid()) {

        let filtered = data.filter(f => f[rooms + "Bed_USE"] != '-')

        let newSearch = filtered.map(f => {

            return codes.find(c => c.code === f.Postcode_District)
        })

        search.autoComplete.data.src = newSearch;
        search.clean()
    }
}

const form = new Form({
    salaryInput: salaryInput,
    errorMessage: salaryErrorMessage,
    bedroomsSelect: bedroomsSelect,
    depositSelect: depositSelect,
    callback: onFormChange
})
