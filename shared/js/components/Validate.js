

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



// function nextPrev(n) {
//     // This function will figure out which tab to display
//     var x = document.getElementsByClassName("tab");
//     // Exit the function if any field in the current tab is invalid:
//     if (n == 1 && !validateForm()) return false;
//     // Hide the current tab:
//     x[currentTab].style.display = "none";
//     // Increase or decrease the current tab by 1:
//     currentTab = currentTab + n;
//     // if you have reached the end of the form... :
//     if (currentTab >= x.length) {
//       //...the form gets submitted:
//       document.getElementById("regForm").submit();
//       return false;
//     }
//     // Otherwise, display the correct tab:
//     showTab(currentTab);
//   }
  
//   function validateForm() {
//     // This function deals with validation of the form fields
//     var x, y, i, valid = true;
//     x = document.getElementsByClassName("tab");
//     y = x[currentTab].getElementsByTagName("input");
//     // A loop that checks every input field in the current tab:
//     for (i = 0; i < y.length; i++) {
//       // If a field is empty...
//       if (y[i].value == "") {
//         // add an "invalid" class to the field:
//         y[i].className += " invalid";
//         // and set the current valid status to false
//         valid = false;
//       }
//     }
//     // If the valid status is true, mark the step as finished and valid:
//     if (valid) {
//       document.getElementsByClassName("step")[currentTab].className += " finish";
//     }
//     return valid; // return the valid status
//   }