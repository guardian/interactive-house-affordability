import { Map as mapGl } from 'maplibre-gl';

class Map{

    constructor(config){

        this.bounds = config.bounds;
        this.maxBounds = config.maxbounds;
        this.container = config.container;
        this.style = config.style;
        this.zoom = config.zoom;
        this.center = config.center;
        this.interactive = config.interactive;
        this.hoverId = null;

        this.tooltip = config.tooltip;
        this.onLoaded = config.onLoaded;
        this.onMove = config.onMove;
        this.onLeave = config.onLeave;
        this.onClick = config.onClick;
        this.areaSelected = null;
        this.bin = []
        this.isLoaded = false;
        
        this.map = new mapGl({
            container: this.container, // container id
            style: this.style,
            zoom: this.zoom,
            center:this.center,
            interactive:this.interactive,
            maxZoom:10,
            maxBounds: this.maxBounds,
            boxZoom:true
    
        });

        this.source = this.map.getSource('vector-tiles');

        this.map.on("wheel", event => {this.onWheel(event)})
        this.map.on("load", (event) => {this.onLoaded(); this.isLoaded = true})
        this.map.on('mousemove', 'postal-districts',  (event) => {this.onMove(event)})
        this.map.on('mouseenter', 'postal-districts', (event) => {this.onEnter(event)})
        this.map.on('mouseleave', 'postal-districts', (event) => {this.onLeave(event)})
        this.map.on('click', 'postal-districts', (event) => {
            this.setAreaSelected(event.features[0].properties.PostDist)
            this.onClick(event)
        })
    }

    onWheel(event){

        console.log('on wheel')
    
        //TODO: Display scroll mesagge
    
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

    }

    onEnter(event){
        this.map.getCanvas().style.cursor = 'pointer';
    }

    highlightArea(){
        //paint stroke of selected area
        this.map.setFeatureState({
            source: 'vector-tiles',
            sourceLayer: 'PostalDistrict',
            id: this.areaSelected,
            }, {
            hover: true
        });
    }

    zoomTo([x,y]){

        this.map.flyTo({
            zoom:10,
            center: [x,y],
            essential: true
        });

        if(this.areaSelected != this.bin[0]){
            this.clean()
            this.bin.push(this.areaSelected)
        }

    }

    clean(){

        this.bin.forEach(id => {
            this.map.setFeatureState({
                source: 'vector-tiles',
                sourceLayer: 'PostalDistrict',
                id: id,
                }, {
                hover: false
            });
        })

        this.bin = []

    }

    paint(expression){

        this.map.setPaintProperty("postal-districts",'fill-color', expression)
    }

    reset(){

        this.map.setFeatureState(
            { source: 'vector-tiles', sourceLayer: 'PostalDistrict', id: this.areaSelected },
            { hover: false }
        );
        
        this.map.flyTo({
            zoom:this.zoom,
            center: this.center,
            essential: true
        });

        this.setAreaSelected(null)
    }

    getMap(){
        return this.map
    }

    getAreaSelected(){
        return this.areaSelected
    }

    setAreaSelected(id){
        this.areaSelected = id;
    }

}

export default Map