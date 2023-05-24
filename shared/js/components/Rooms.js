class Rooms{

    constructor(config){

        this.select = config.bedroomsSelect;
        this.callback = config.callback || null;

        this.setRooms(0);

        this.select.querySelectorAll('#gv-bedrooms-input button').forEach((element,i) => {
            element.addEventListener('click', (event) => {

                this.setRooms(i)
                this.onSelect(i)
                event.preventDefault();

            })
        });

    }

    onSelect(value){

        for(let i = 0; i < this.select.querySelectorAll(`#gv-bedrooms-input button`).length; i++){

            this.select.querySelectorAll(`#gv-bedrooms-input button`)[i].classList.remove('selected')
        }

        this.select.querySelectorAll(`#gv-bedrooms-input button`)[value].classList.add('selected')

        this.callback(this.rooms)
    }

    setRooms(value){
        this.rooms = value;
    }

    getRooms(){
        return {type:'rooms', value:this.rooms};
    }

    reset(){

        for(let i = 0; i < this.select.querySelectorAll('#gv-bedrooms-input button').length; i++){

            this.select.querySelectorAll('#gv-bedrooms-input button')[i].classList.remove('selected')
        }

        this.select.querySelectorAll(`button`)[0].classList.add('selected')
        
        this.setRooms(0);
    }

}

export default Rooms