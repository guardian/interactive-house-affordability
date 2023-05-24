class Deposits{

    constructor(config){

        this.select = config.depositSelect;
        this.callback = config.callback || null;
        this.deposits = [.9,.85,.8]

        this.setDeposit(this.deposits[0]);

        this.select.querySelectorAll('button').forEach((element,i) => {
            element.addEventListener('click', (event) => {

                this.setDeposit(this.deposits[i])
                this.onSelect(i+1)
                event.preventDefault();
            })
        });

    }

    onSelect(value){

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

        for(let i = 0; i < this.select.querySelectorAll('button').length; i++){

            this.select.querySelectorAll('button')[i].classList.remove('selected')
        }

        this.select.querySelectorAll(`button`)[0].classList.add('selected')

        this.setDeposit(this.deposits[0]);
    }

}

export default Deposits