class Rooms{

    constructor(config){

        this.select = config.bedroomsSelect;
        this.callback = config.callback || null;

        this.setRooms(0);
        
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
        let value = this.getRooms().value ? +this.getRooms().value -1 : 0
        this.select.options[value].selected = false;
        this.select.options[value].classList.remove('selected')
        this.setRooms(0);
    }

}

export default Rooms