import Salary from './Salary'
import Rooms from './Rooms';

class Form{

    constructor(config){

        this.salaryInput = config.salaryInput;
        this.errorMessage = config.errorMessage;
        this.bedroomsSelect = config.bedroomsSelect;
        this.callback = config.callback;
        this.valid = false;

        this.salary = new Salary({
            input:this.salaryInput,
            errorMessage:this.errorMessage,
            callback:this.validateForm.bind(this)
        })

        this.rooms = new Rooms({
            bedroomsSelect:this.bedroomsSelect,
            callback:this.validateForm.bind(this)
        })

    }

    validateForm(){

        if(this.salary.getSalary()){

            if(this.salary.getSalary().value && this.rooms.getRooms().value){
                this.valid = true;
            }
            else{
                this.valid = false;
            }

        }

        this.callback()

    }

    reset(){
        this.salaryInput.value = '';
        this.valid = false;
        this.salary.reset()
        this.rooms.reset();
    }

    getValid(){
        return this.valid;
    }

}

export default Form