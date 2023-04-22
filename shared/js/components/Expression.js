class Expression {

    constructor(config) {
        
        this.data = config.data;
        this.salary = config.salary || null;
        this.rooms = config.rooms || 2;
        this.matchExpression = ["match", ["get", "PostDist"]];

        if(this.salary && this.rooms) {

            this.data.forEach(d => {

                if(d.Postcode_District != ''){

                    let salePrice;
                    let rentPrice;
                    let use;

                    if(this.rooms == 1){

                        salePrice = +d['1BedSale_MedianPrice'];
                        rentPrice = +d['1BedRent_MedianPrice'];
                        use = d['1Bed_USE'];
                    }
                    else if(this.rooms == 2){
                        salePrice = +d['2BedSale_MedianPrice'];
                        rentPrice = +d['2BedRent_MedianPrice'];
                        use = d['2Bed_USE'];
                    }
                    else if(this.rooms == 3){
                        
                        salePrice = +d['3BedSale_MedianPrice'];
                        rentPrice = +d['3BedRent_MedianPrice'];
                        use = d['3Bed_USE'];

                    }
                    else if(this.rooms == 4){
                        salePrice = +d['4BedSale_MedianPrice'];
                        rentPrice = +d['4BedRent_MedianPrice'];
                        use = d['4Bed_USE'];
                    }

                    let color = this.getColor(this.salary, salePrice, rentPrice, use)

                    this.matchExpression.push(d.Postcode_District, color);
                }
            })

            this.matchExpression.push('#dadada');
        }
        else{

            this.data.forEach(d => {

                    if(d.Postcode_District != ''){

                        let color = this.getColor(+d.median_pay_per_LA_x2,d['AllSale_MedianPrice'],+d['AllRent_MedianPrice'], d['Use?'])

                        this.matchExpression.push(d.Postcode_District, color);

                    }

            })

            this.matchExpression.push('#dadada');
        }

    }

    getColor = (salary, sale_price, rent_price, use) => {

        let color;

        if(sale_price == 0 || rent_price == 0){
            color = '#dadada'
            return color
        }

        if (use == '-') {
            return '#dadada'
        }
        else if (rent_price <= ((salary / 12) * 0.3) && sale_price * 0.9 <= salary * 2.5) {
            return '#056DA1'
        }
        else if (rent_price <= ((salary / 12) * 0.3) && sale_price * 0.9 > salary * 2.5 && sale_price * 0.9 <= salary * 3.5) {
            return '#1896D7'
        }
        else if (rent_price <= ((salary / 12) * 0.3) && sale_price * 0.9 > salary * 3.5 && sale_price * 0.9 <= salary * 4.5) {
            return '#E6F5FF'
        }
        else if (sale_price * 0.9 > salary * 4.5 && rent_price <= (salary / 12) * 0.2) {
            return '#ffbac8'
        }
        else if (sale_price * 0.9 > salary * 4.5 && rent_price > (salary / 12) * 0.2 && rent_price <= ((salary / 12) * 0.3)) {
            return '#c70000'
        }
        else if (sale_price * 0.9 > salary * 4.5 && rent_price > ((salary / 12) * 0.3)) {
            return '#880105'
        }
        else if (sale_price * 0.9 <= salary * 4.5 && rent_price > ((salary / 12) * 0.3)) {
            return '#ffe500'
        }
        else {
            return '#dadada'
        }

    }

    getExpression() {
        return this.matchExpression
    }

}

export default Expression