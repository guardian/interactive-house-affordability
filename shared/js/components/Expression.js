import { scaleThreshold } from 'd3-scale';



class Expression {

    constructor(config) {
        
        this.data = config.data;
        this.salary = config.salary || null;
        this.rooms = config.rooms || null;
        this.deposit = config.deposit || .9;
        this.matchExpression = ["match", ["get", "PostDist"]];
        this.orgData = [['PostDist', 'color']];
        

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

            this.matchExpression.push('#ffffff');
        }
        else{

            this.data.forEach(d => {

                    if(d.Postcode_District != ''){

                        let color = this.getColor(+d.median_pay_per_LA_x2,d['AllSale_MedianPrice'],+d['AllRent_MedianPrice'], d['Use?'])

                        this.orgData.push([d.Postcode_District,color])

                        this.matchExpression.push(d.Postcode_District, color);

                    }

            })

            // let csv = "data:text/csv;charset=utf-8," 
            // + this.orgData.map(e => e.join(",")).join("\n");

            // console.log(csv)

            // var encodedUri = encodeURI(csv);
            // var link = document.createElement("a");
            // link.innerHTML='Click to download'
            // link.classList.add('gv-data-download')
            // link.setAttribute("href", encodedUri);
            // link.setAttribute("download", "my_data.csv");
            // document.body.appendChild(link); // Required for FF

            // link.click(); // This will download the data file named "my_data.csv".


            this.matchExpression.push('#ffffff');
        }

    }

    palette(d) {

        return this.scale(d)
    }

    getColor = (salary, sale_price, rent_price, use) => {

        let color;

        if(sale_price == 0 || rent_price == 0){
            color = '#ffffff'
            return color
        }

        if (use == '-') {
            return '#ffffff'
        }
        else if (rent_price <= ((salary / 12) * 0.3) && sale_price * this.deposit <= salary * 2.5) {
            return this.palette(5)
        }
        else if (rent_price <= ((salary / 12) * 0.3) && sale_price * this.deposit > salary * 2.5 && sale_price * this.deposit <= salary * 3.5) {
            return this.palette(4)
        }
        else if (rent_price <= ((salary / 12) * 0.3) && sale_price * this.deposit > salary * 3.5 && sale_price * this.deposit <= salary * 4.5) {
            return this.palette(3)
        }
        else if (sale_price * this.deposit > salary * 4.5 && rent_price <= (salary / 12) * 0.2) {
            return this.palette(1)
        }
        else if (sale_price * this.deposit > salary * 4.5 && rent_price > (salary / 12) * 0.2 && rent_price <= ((salary / 12) * 0.3)) {
            return this.palette(0)
        }
        else if (sale_price * this.deposit > salary * 4.5 && rent_price > ((salary / 12) * 0.3)) {
            return this.palette(-1)
        }
        else if (sale_price * this.deposit <= salary * 4.5 && rent_price > ((salary / 12) * 0.3)) {
            return this.palette(2)
        }
        else {
            return '#ffffff'
        }

    }

    

    getExpression() {
        return this.matchExpression
    }

}

export default Expression