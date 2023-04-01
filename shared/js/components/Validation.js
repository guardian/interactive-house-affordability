import Search from './Search'
import Salary from './Salary'

class Validation{

    constructor(config){
        this.form = config.form;
        this.next = config.next;
        this.prev = config.prev;
        this.salaryInput = config.salaryInput;
        this.searchInput = config.searchInput;
        this.postcodes = config.postcodes;
        this.errorMessage = config.errorMessage;
        this.reset = config.reset;
        this.callback = config.callback;
        this.currentTab = 0;
        this.tabs = config.tabs

        this.next.addEventListener('click', () => this.nextPrev(1))
        this.prev.addEventListener('click', () => this.nextPrev(-1))

        this.showTab(this.currentTab)

        this.salary = new Salary({
            input:this.salaryInput,
            errorMessage:this.errorMessage,
            callback:this.onValidate
        })

        this.search = new Search({
            selector: "#gv-autoComplete",
            input:this.searchInput,
            data: this.postcodes,
            keys: ["areaCode"],
            placeHolder: 'Search by area or district code',
            errorMessage: this.errorMessage,
            callback:this.onValidate
        });
        
        this.search.autoCompleteJs()
        
        this.salary.callback = (object) => {

            if(object.value){
                this.next.disabled = false;
                this.next.className = 'ative';
            }
            else{
                this.next.disabled = true;
                this.next.className = 'inactive';
            }
        }

        this.search.callback = (object) => {

            if(object.value){
                this.next.disabled = false;
                this.next.className = 'ative';
            }
            else{
                this.next.disabled = true;
                this.next.className = 'inactive';
            }

        }
    }

    showTab(index){

        this.tabs[index].style.display = 'block';

        if (index == 0) {
            this.prev.style.display = "none";
        }
        else {
            this.prev.style.display = "inline";
        }

        if (index == (this.tabs.length - 1)) {
            this.next.innerHTML = "Zoom in";
        }
        else {
            this.next.innerHTML = "Next";
        }

    }

    nextPrev(index){


        if(!this.salary.getSalary().value && index == 1)
        {
            this.next.disabled = true;
            this.next.className = 'inactive';
        }

        console.log(index)

        //if(this.salary.getSalary().value && this.search.getSearch().value)
        

        if (index == 1 && !this.validateForm()) return false;

        this.tabs[this.currentTab].style.display = "none";

        this.currentTab = this.currentTab + index;

        if (this.currentTab >= this.tabs.length) {
            return false;
        }

        this.showTab(this.currentTab);
    }

    validateForm(){

        let valid = false;

        console.log(this.currentTab)

        if(this.salary.getSalary() && this.search.getSearch() && this.currentTab == 1){

            this.callback(this.search.getSearch())

            valid = true;
        }
        else if(this.salary.getSalary()&& this.currentTab == 0){

            this.callback(this.salary.getSalary())

            valid = true;
        }

        return valid

    }
}

export default Validation