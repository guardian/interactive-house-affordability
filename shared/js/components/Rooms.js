class Rooms{

    constructor(config){

        this.select = config.bedroomsSelect;
        this.callback = config.callback || null;

        this.select.options[config.default-1].selected = true;

        this.setRooms(config.default);
        
        this.select.addEventListener('change', (event) => {
            this.setRooms(this.select.value)
            this.onSelect(this.select.value)
        })

    }

    onSelect(value){

        for(let i = 0; i < this.select.options.length; i++){

            this.select.options[i].classList.remove('selected')
        }

        this.select.options[value-1].classList.add('selected')

        this.callback(this.rooms)
    }

    setRooms(value){
        this.rooms = value;
    }

    getRooms(){
        return {type:'rooms', value:this.rooms};
    }

    reset(){
        this.select.options[this.rooms-1].selected = false;
        this.rooms = 2;
        this.select.options[1].selected = true;
    }

}

export default Rooms