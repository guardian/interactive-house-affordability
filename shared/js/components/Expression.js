import { scaleThreshold } from 'd3-scale';



class Expression {

    constructor(config) {
        
        this.data = config.data;
        this.salary = config.salary || null;
        this.rooms = config.rooms || null;
        this.matchExpression = ["match", ["get", "PostDist"]];
        this.scale = scaleThreshold()
        .range(['#a50b06' , '#e25d28', '#ffaf81', '#fff700', '#88cfc8' , '#329890', '#135e58' ])
        .domain([0,1,2,3,4,5,6]);

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

            this.matchExpression.push('#E6E9EC');
        }
        else{

            this.data.forEach(d => {

                    if(d.Postcode_District != ''){

                        let color = this.getColor(+d.median_pay_per_LA_x2,d['AllSale_MedianPrice'],+d['AllRent_MedianPrice'], d['Use?'])

                        this.matchExpression.push(d.Postcode_District, color);

                    }

            })

            this.matchExpression.push('#E6E9EC');
        }

    }

    palette(d) {

        return this.scale(d)
    }

    getColor = (salary, sale_price, rent_price, use) => {

        let color;

        if(sale_price == 0 || rent_price == 0){
            color = '#E6E9EC'
            return color
        }

        if (use == '-') {
            return '#E6E9EC'
        }
        else if (rent_price <= ((salary / 12) * 0.3) && sale_price * 0.9 <= salary * 2.5) {
            return this.palette(5)
        }
        else if (rent_price <= ((salary / 12) * 0.3) && sale_price * 0.9 > salary * 2.5 && sale_price * 0.9 <= salary * 3.5) {
            return this.palette(4)
        }
        else if (rent_price <= ((salary / 12) * 0.3) && sale_price * 0.9 > salary * 3.5 && sale_price * 0.9 <= salary * 4.5) {
            return this.palette(3)
        }
        else if (sale_price * 0.9 > salary * 4.5 && rent_price <= (salary / 12) * 0.2) {
            return this.palette(1)
        }
        else if (sale_price * 0.9 > salary * 4.5 && rent_price > (salary / 12) * 0.2 && rent_price <= ((salary / 12) * 0.3)) {
            return this.palette(0)
        }
        else if (sale_price * 0.9 > salary * 4.5 && rent_price > ((salary / 12) * 0.3)) {
            return this.palette(-1)
        }
        else if (sale_price * 0.9 <= salary * 4.5 && rent_price > ((salary / 12) * 0.3)) {
            return this.palette(2)
        }
        else {
            return '#E6E9EC'
        }

    }

    

    getExpression() {
        return this.matchExpression
    }

}

export default Expression