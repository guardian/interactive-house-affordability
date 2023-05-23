class Deposits{

    constructor(config){

        this.select = config.depositSelect;
        this.callback = config.callback || null;

        this.setDeposit(1);

        this.select.querySelectorAll('button').forEach((element,i) => {
            element.addEventListener('click', (event) => {

                this.setDeposit(i+1)
                this.onSelect(i+1)
                event.preventDefault();
            })
        });

    }

    onSelect(value){

        console.log('onselect deposit')

        for(let i = 0; i < this.select.querySelectorAll(`button`).length; i++){

            this.select.querySelectorAll(`button`)[i].classList.remove('selected')
        }

        this.select.querySelectorAll(`button`)[value-1].classList.add('selected')

        this.callback(this.deposit)
    }

    setDeposit(value){
        this.deposit = value
    }

    getDeposit(){
        return {type:'deposit', value:this.deposit};
    }

    reset(){

        console.log('reset deposit')

        for(let i = 0; i < this.select.querySelectorAll('button').length; i++){

            this.select.querySelectorAll('button')[i].classList.remove('selected')
        }

        this.select.querySelectorAll(`button`)[0].classList.add('selected')

        this.setDeposit(1);
    }

}

export default Deposits