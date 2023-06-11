import { numberWithCommas } from 'shared/js/util.js'

class Salary{

    constructor(config) {

        this.input = config.input;
        this.callback = config.callback;
        this.errorMessage = config.errorMessage;
        this.stripValue;
        this.salary;

        this.salaryInput()
        
    }

    salaryInput(){

        this.validate = (value) => {

            if(!isNaN(value) && value > 0)
            {
                this.errorMessage.innerHTML = ''
                return value
            }
            else{
                this.errorMessage.innerHTML = 'Please enter a valid figure'
                return null
            }
            
        }

        this.input.addEventListener('input', () => {

            this.stripValue = this.input.value.replaceAll(/\D/g,'');

            if(this.validate(this.stripValue))
            {
                this.setSalary(this.stripValue);
                this.input.value = "£" + numberWithCommas(this.salary.value);
                this.callback()
            }
            else{
                this.setSalary(null);
                this.callback()
            }
        });
    }

    setSalary(value){
        this.salary = {type:'salary', value:value}
    }

    getSalary(){
        return this.salary
    }

    reset(){
        this.setSalary(null)
    }
}

export default Salary 