class Formula{

    constructor(data){
        this.data = data;
        this.matchExpression = ["match",["get", "PostDist"]];

        this.data.forEach(d => {

            console.log(d.Postcode_district, +d.monthly_rent , +d.median_pay_per_LA_x2 , +d.Median_house_price, +d.median_pay_per_LA_x2)

            let color;

            if (+d.monthly_rent > ((+d.median_pay_per_LA_x2 / 12) * 0.3) && +d.Median_house_price * 0.9  < +d.median_pay_per_LA_x2 * 2.5){
                console.log('Dark green')
                color = this.getColor('Dark green')
            }
            else if(+d.monthly_rent > ((+d.median_pay_per_LA_x2 / 12) * 0.3) && +d.Median_house_price * 0.9 > +d.median_pay_per_LA_x2 * 2.5 && +d.Median_house_price * 0.9 < +d.median_pay_per_LA_x2 * 3.5){
                console.log('Mid green')
                color = this.getColor('Mid green')
            }
            else if(+d.monthly_rent > ((+d.median_pay_per_LA_x2 / 12) * 0.3) && +d.Median_house_price * 0.9 > +d.median_pay_per_LA_x2 * 3.5 && +d.Median_house_price * 0.9 < +d.median_pay_per_LA_x2 * 4.5){
                console.log('Light green')
                color = this.getColor('Light green')
            }
            else if(+d.Median_house_price * 0.9 > +d.median_pay_per_LA_x2 * 4.5 && +d.monthly_rent < (+d.median_pay_per_LA_x2 / 12) * 0.2){
                console.log('Light red')
                color = this.getColor('Light red')
            }
            else if(+d.Median_house_price * 0.9 > +d.median_pay_per_LA_x2 * 4.5 && +d.monthly_rent < (+d.median_pay_per_LA_x2 / 12) * 0.2 && +d.monthly_rent < ((+d.median_pay_per_LA_x2 / 12) * 0.3)){
                console.log('Mid red')
                color = this.getColor('Mid red')
            }
            else if(+d.Median_house_price * 0.9 > +d.median_pay_per_LA_x2 * 4.5 && +d.monthly_rent > ((+d.median_pay_per_LA_x2 / 12) * 0.3)){
                console.log('Dark red')
                color = this.getColor('Dark red')
            }
            else if(+d.Median_house_price * 0.9 < +d.median_pay_per_LA_x2 * 4.5 && +d.monthly_rent > ((+d.median_pay_per_LA_x2 / 12) * 0.3)){
                console.log('Yellow')
                color = this.getColor('Yellow')
                
            }
            else{
                console.log('-')
                color = this.getColor('-')
            }

            if(d.Postcode_district != ''){
                this.matchExpression.push(d.Postcode_district,color);
            }

           
        })

        this.matchExpression.push('#dadada');

    }

    expression(){
        return this.matchExpression
    }

}

export default Formula