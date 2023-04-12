class Expression {

    constructor(config) {
        
        this.data = config.data;
        this.salary = config.salary || null;
        this.rooms = config.rooms || 2;
        this.matchExpression = ["match", ["get", "PostDist"]];

        if(this.salary && this.rooms) {

            this.data.forEach(d => {

                try {
                    d.Postcode_District != '';

                    let salePrice;
                    let rentPrice;

                    if(this.rooms == 1){
                        console.log(d['1BedSale_MedianPrice'],d['1BedRent_MedianPrice'])
                        salePrice = +d['1BedSale_MedianPrice'].replace(/\D+/g, '');
                        rentPrice = +d['1BedRent_MedianPrice'].replace(/\D+/g, '');
                    }
                    else if(this.rooms == 2){
                        salePrice = +d['2BedSale_MedianPrice'].replace(/\D+/g, '');
                        rentPrice = +d['2BedRent_MedianPrice'].replace(/\D+/g, '');
                    }
                    else if(this.rooms == 3){
                        salePrice = +d['3BedSale_MedianPrice'].replace(/\D+/g, '');
                        rentPrice = +d['3BedRent_MedianPrice'].replace(/\D+/g, '');
                    }
                    else if(this.rooms == 4){
                        salePrice = +d['4BedSale_MedianPrice'].replace(/\D+/g, '');
                        rentPrice = +d['4BedRent_MedianPrice'].replace(/\D+/g, '');
                    }

                    let color = this.getColor(this.salary, salePrice, rentPrice, d['Use?'])

                    this.matchExpression.push(d.Postcode_District, color);
                }
                catch (err) {
                    console.log(err)
                }
            })

            this.matchExpression.push('#dadada');
        }
        else{

            this.data.forEach(d => {

                try {

                    d.Postcode_District != '';

                    let color = this.getColor(+d.median_pay_per_LA_x2,d['AllSale_MedianPrice'].replace(/\D+/g, ''),d['AllRent_MedianPrice'].replace(/\D+/g, ''), d['Use?'])

                    this.matchExpression.push(d.Postcode_District, color);
                }
                catch (err) {

                    console.log(err)
                }

            })

            this.matchExpression.push('#dadada');
        }

    }

    getColor = (salary, sale_price, rent_price, use) => {

        let color;

        if (use == '-') {
            color = '#dadada'
        }
        else if (rent_price <= ((salary / 12) * 0.3) && sale_price * 0.9 <= salary * 2.5) {
            color = '#056DA1'
        }
        else if (rent_price <= ((salary / 12) * 0.3) && sale_price * 0.9 > salary * 2.5 && sale_price * 0.9 <= salary * 3.5) {
            color = '#1896D7'
        }
        else if (rent_price <= ((salary / 12) * 0.3) && sale_price * 0.9 > salary * 3.5 && sale_price * 0.9 <= salary * 4.5) {
            color = '#E6F5FF'
        }
        else if (sale_price * 0.9 > salary * 4.5 && rent_price <= (salary / 12) * 0.2) {
            color = '#ffbac8'
        }
        else if (sale_price * 0.9 > salary * 4.5 && rent_price > (salary / 12) * 0.2 && rent_price <= ((salary / 12) * 0.3)) {
            color = '#c70000'
        }
        else if (sale_price * 0.9 > salary * 4.5 && rent_price > ((salary / 12) * 0.3)) {
            color = '#880105'
        }
        else if (sale_price * 0.9 <= salary * 4.5 && rent_price > ((salary / 12) * 0.3)) {
            color = '#ffe500'
        }
        else {
            color = '#dadada'
        }

        return color
    }

    getExpression() {
        return this.matchExpression
    }

}

export default Expression

// getColor = (d, salary) => {

//     let color;

//     if (d.use == '-') {
//         color = '#dadada'
//     }
//     else if (+d.AllRent_MedianPrice <= ((salary / 12) * 0.3) && +d.AllSale_MedianPrice * 0.9 <= salary * 2.5) {
//         color = '#056DA1'
//     }
//     else if (+d.AllRent_MedianPrice <= ((salary / 12) * 0.3) && +d.AllSale_MedianPrice * 0.9 > salary * 2.5 && +d.AllSale_MedianPrice * 0.9 <= salary * 3.5) {
//         color = '#1896D7'
//     }
//     else if (+d.AllRent_MedianPrice <= ((salary / 12) * 0.3) && +d.AllSale_MedianPrice * 0.9 > salary * 3.5 && +d.AllSale_MedianPrice * 0.9 <= salary * 4.5) {
//         color = '#E6F5FF'
//     }
//     else if (+d.AllSale_MedianPrice * 0.9 > salary * 4.5 && +d.AllRent_MedianPrice <= (salary / 12) * 0.2) {
//         color = '#ffbac8'
//     }
//     else if (+d.AllSale_MedianPrice * 0.9 > salary * 4.5 && +d.AllRent_MedianPrice > (salary / 12) * 0.2 && +d.AllRent_MedianPrice <= ((salary / 12) * 0.3)) {
//         color = '#c70000'
//     }
//     else if (+d.AllSale_MedianPrice * 0.9 > salary * 4.5 && +d.AllRent_MedianPrice > ((salary / 12) * 0.3)) {
//         color = '#880105'
//     }
//     else if (+d.AllSale_MedianPrice * 0.9 <= salary * 4.5 && +d.AllRent_MedianPrice > ((salary / 12) * 0.3)) {
//         color = '#ffe500'
//     }
//     else {
//         color = '#dadada'
//     }

//     return color
// }