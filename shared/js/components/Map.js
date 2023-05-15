import { Map as mapGl } from 'maplibre-gl';

class Map {

    constructor(config) {

        this.bounds = config.bounds;
        this.maxBounds = config.maxBounds;
        this.container = config.container;
        this.style = config.style;
        this.zoom = config.zoom;
        this.center = config.center;
        this.interactive = config.interactive;
        this.layer = config.layer;
        this.hoverId = null;
        this.clickedId = null;
        this.tooltip = config.tooltip;
        this.onLoaded = config.onLoaded;
        this.onMove = config.onMove;
        this.onLeave = config.onLeave;
        this.onClick = config.onClick;
        this.areaSelected = null;
        this.bin = []
        this.isLoaded = false;

        this.interval = null;

        this.map = new mapGl({

            container: this.container, // container id
            style: this.style,
            zoom: this.zoom,
            center: this.center,
            interactive: this.interactive,
            maxZoom: 10,
            maxBounds: this.maxBounds,
            dragPan: true,
            dragRotate:false,
            cooperativeGestures:true
        });

        this.map.touchZoomRotate.disableRotation();

        this.source = this.map.getSource('vector-tiles');

        this.map.on("load", (event) => { this.onLoaded(); this.isLoaded = true })
        this.map.on('mousemove', this.layer, (event) => { this.onMove(event) })
        this.map.on('mouseenter', this.layer, (event) => { this.onEnter(event) })
        this.map.on('mouseleave', this.layer, (event) => { this.onLeave(event) })
        this.map.on('click', this.layer, (event) => {
            this.setAreaSelected(event.features[0].properties.PostDist)
            this.onClick(event)
        })
    }

    onEnter(event) {
        this.map.getCanvas().style.cursor = 'pointer';
    }

    highlightArea(id, method) {

        if(id) {

            if (method == 'click') {
                if (this.clickedId) {
                    this.map.setFeatureState(
                        { source: 'vector-tiles', sourceLayer: 'PostalDistrictwgs84bb', id: this.clickedId },
                        { clicked: false }
                    );
                }
    
                this.clickedId = id;
    
                this.map.setFeatureState(
                    { source: 'vector-tiles', sourceLayer: 'PostalDistrictwgs84bb', id: this.clickedId },
                    { clicked: true }
                );

                if (this.areaSelected != this.bin[0]) {
                    this.clean()
                    this.bin.push(this.areaSelected)
                }
            }
            else {
                if (this.hoverId) {
                    this.map.setFeatureState(
                        { source: 'vector-tiles', sourceLayer: 'PostalDistrictwgs84bb', id: this.hoverId },
                        { hover: false }
                    );
                }
    
                this.hoverId = id;
    
                this.map.setFeatureState(
                    { source: 'vector-tiles', sourceLayer: 'PostalDistrictwgs84bb', id: this.hoverId },
                    { hover: true }
                );
            }

        }
        else{

            this.map.setFeatureState(
                { source: 'vector-tiles', sourceLayer: 'PostalDistrictwgs84bb', id: this.hoverId },
                { hover: false }
            );

        }
        
    }

    zoomTo([[maxx, maxy], [minx, miny]]) {

        this.map.fitBounds([
            [maxx, maxy], [minx, miny]
            
        ], {
            padding: {top: 100, bottom:100, left: 100, right: 100}
        });


    }

    clean() {

        this.bin.forEach(id => {
            this.map.setFeatureState({
                source: 'vector-tiles',
                sourceLayer: 'PostalDistrictwgs84bb',
                id: id,
            }, {
                clicked: false,
                hover:false
            });
        })

        this.bin = []

    }

    paint(expression) {
        this.map.setPaintProperty("postal-districts", 'fill-color', expression)
    }

    reset() {

        this.map.setFeatureState(
            { source: 'vector-tiles', sourceLayer: 'PostalDistrict', id: this.areaSelected },
            { hover: false }
        );

        this.map.flyTo({
            zoom: this.zoom,
            center: this.center,
            essential: true
        });

        this.setAreaSelected(null)
    }

    getMap() {
        return this.map
    }

    getAreaSelected() {
        return this.areaSelected
    }

    setAreaSelected(id) {
        this.areaSelected = id;
    }

}

export default Map