class Table{
    constructor(config){

        this.table = config.table;
        this.h2 = this.table.querySelector('h2')
        this.standfirst = this.table.querySelector('#gv-table__standfirst')
        this.housePrice = this.table.querySelector('#gv-table__house-price')
        this.annualIncome = this.table.querySelector('#gv-table__annual-income')
        this.rentPrice = this.table.querySelector('#gv-table__rent-price')
        this.percentincome = this.table.querySelector('#gv-table__percent-income')
        this.label = this.table.querySelector('#gv-table__label')

    }

    setData(data){

        this.h2.innerHTML = data.header;
        this.standfirst.innerHTML = data.standfirst;
        this.housePrice.innerHTML = data.housePrice;
        this.annualIncome.innerHTML = data.annualIncome;
        this.rentPrice.innerHTML = data.rentPrice;
        this.percentincome.innerHTML = data.percentincome;
        this.label.innerHTML = data.label;

    }

}

export default Table