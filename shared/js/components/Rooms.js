class Rooms{

    constructor(config){

        this.select = config.bedroomsSelect;
        this.callback = config.callback || null;

        this.setRooms(0);

        this.select.querySelectorAll('button').forEach((element,i) => {
            element.addEventListener('click', (event) => {

                this.setRooms(i+1)
                this.onSelect(i+1)
                event.preventDefault();
            })
        });

    }

    onSelect(value){

        for(let i = 0; i < this.select.querySelectorAll('button').length; i++){

            this.select.querySelectorAll('button')[i].classList.remove('selected')
        }

        this.select.querySelectorAll('button')[value-1].classList.add('selected')

        this.callback(this.rooms)
    }

    setRooms(value){
        this.rooms = value;
    }

    getRooms(){
        return {type:'rooms', value:this.rooms};
    }

    reset(){

        for(let i = 0; i < this.select.querySelectorAll('button').length; i++){

            this.select.querySelectorAll('button')[i].classList.remove('selected')
        }
        this.setRooms(0);
    }

}

export default Rooms