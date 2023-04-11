class Expression {

    constructor(config) {
        this.data = config.data;
        this.salary = config.salary || null;
        this.rooms = config.rooms || null;
        this.matchExpression = ["match", ["get", "PostDist"]];

        if(this.salary) {

            this.data.forEach(d => {

                try {

                    d.Postcode_district != '';

                    let color = this.getColor(d,this.salary)

                    this.matchExpression.push(d.Postcode_district, color);
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

                    d.Postcode_district != '';

                    let color = this.getColor(d,+d.median_pay_per_LA_x2)

                    this.matchExpression.push(d.Postcode_district, color);
                }
                catch (err) {
                    console.log(err)
                }

            })

            this.matchExpression.push('#dadada');
        }

    }

    getColor = (d, salary) => {

        let color;

        if (d.staggered_colour == '-') {
            color = '#dadada'
        }
        else if (+d.monthly_rent <= ((salary / 12) * 0.3) && +d.Median_house_price * 0.9 <= salary * 2.5) {
            color = '#056DA1'
        }
        else if (+d.monthly_rent <= ((salary / 12) * 0.3) && +d.Median_house_price * 0.9 > salary * 2.5 && +d.Median_house_price * 0.9 <= salary * 3.5) {
            color = '#1896D7'
        }
        else if (+d.monthly_rent <= ((salary / 12) * 0.3) && +d.Median_house_price * 0.9 > salary * 3.5 && +d.Median_house_price * 0.9 <= salary * 4.5) {
            color = '#E6F5FF'
        }
        else if (+d.Median_house_price * 0.9 > salary * 4.5 && +d.monthly_rent <= (salary / 12) * 0.2) {
            color = '#ffbac8'
        }
        else if (+d.Median_house_price * 0.9 > salary * 4.5 && +d.monthly_rent > (salary / 12) * 0.2 && +d.monthly_rent <= ((salary / 12) * 0.3)) {
            color = '#c70000'
        }
        else if (+d.Median_house_price * 0.9 > salary * 4.5 && +d.monthly_rent > ((salary / 12) * 0.3)) {
            color = '#880105'
        }
        else if (+d.Median_house_price * 0.9 <= salary * 4.5 && +d.monthly_rent > ((salary / 12) * 0.3)) {
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