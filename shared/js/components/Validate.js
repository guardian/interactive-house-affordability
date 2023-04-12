

class Validate{

    constructor(config){
        
        this.next = config.next;
        this.prev = config.prev;
        this.reset = config.reset;
        this.callback = config.callback;
        this.currentTab = 0;
        this.salary = null;
        this.area = null;
        this.next.addEventListener('click', () => this.nextPrev(1))
        this.prev.addEventListener('click', () => this.nextPrev(-1))


    }

    validateForm(){

        
        if(this.salary){
            this.callback('salary validated')
        }
        if(this.area && this.salary){

            this.callback('form validated')
        }

    }

    nextPrev(n){

        this.validateForm()

        if(n == 1)this.currentTab++
        else this.currentTab--

        if(this.currentTab >= 2)this.currentTab = 2
        if(this.currentTab <= 0)this.currentTab = 0

        this.callback({type:'tab', value:this.currentTab})

        if (this.currentTab == 0 && this.salary) {
            this.prev.style.display = "none";

            this.next.disabled = false;
            this.next.className = 'active';
        }
        else {
            this.prev.style.display = "inline";

            this.next.disabled = true;
            this.next.className = 'inactive';
        }

        if(this.currentTab == 1){

            this.next.innerHTML = 'Search';
            this.next.disabled = true;
            this.next.className = 'inactive';
        }

        if (this.currentTab == 1 && this.search){

            this.next.disabled = false;
            this.next.className = 'active';

        }
        

        if(this.currentTab == 2) {
            this.next.style.display = "none";
        }


    }

    setSalary(value){
        this.salary = value;
        this.nextPrev(0)
    }

    setArea(value){
        this.area = value;
    }

    getCurrentTab(){
        return this.currentTab
    }

    


}

export default Validate