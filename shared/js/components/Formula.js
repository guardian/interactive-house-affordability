class Formula{

    constructor(data, rent = 0){
        this.data = data;
        this.rent = rent;
        this.matchExpression = ["match",["get", "PostDist"]];

        let Dark_green = 0
        let Mid_green = 0
        let Light_green = 0
        let Light_red = 0
        let Mid_red = 0
        let Dark_red = 0
        let Yellow = 0
        let Grey = 0

        if(this.data){
            this.data.forEach(d => {

                let color;

                if(d.staggered_colour == '-'){
                    color = this.getColor('-')
                    Grey++
                }
                else if (+d.monthly_rent <= ((+this.rent / 12) * 0.3) && +d.Median_house_price * 0.9  <= +this.rent * 2.5){
                    color = this.getColor('Dark green')
                    Dark_green++
                }
                else if(+d.monthly_rent <= ((+this.rent / 12) * 0.3) && +d.Median_house_price * 0.9 > +this.rent * 2.5 && +d.Median_house_price * 0.9 <= +this.rent * 3.5){
                    
                    color = this.getColor('Mid green')
                    Mid_green++
                }
                else if(+d.monthly_rent <= ((+this.rent / 12) * 0.3) && +d.Median_house_price * 0.9 > +this.rent * 3.5 && +d.Median_house_price * 0.9 <= +this.rent * 4.5){
                    
                    color = this.getColor('Light green')
                    Light_green++
                }
                else if(+d.Median_house_price * 0.9 > +this.rent * 4.5 && +d.monthly_rent < (+this.rent / 12) * 0.2){
                    
                    color = this.getColor('Light red')
                    Light_red++
                }
                else if(+d.Median_house_price * 0.9 > +this.rent * 4.5 && +d.monthly_rent >= (+this.rent / 12) * 0.2 && +d.monthly_rent < ((+this.rent / 12) * 0.3)){
                    
                    color = this.getColor('Mid red')
                    Mid_red++
                }
                else if(+d.Median_house_price * 0.9 > +this.rent * 4.5 && +d.monthly_rent >= ((+this.rent / 12) * 0.3)){
                    
                    color = this.getColor('Dark red')
                    Dark_red++
                }
                else if(+d.Median_house_price * 0.9 < +this.rent * 4.5 && +d.monthly_rent > ((+this.rent / 12) * 0.3)){
                    
                    color = this.getColor('Yellow')
                    Yellow++
                }
                else{

                    color = this.getColor('-')
                    Grey++
                }
    
                if(d.Postcode_district != ''){
                    this.matchExpression.push(d.Postcode_district,color);
                }
    
               
            })
    
            this.matchExpression.push('#dadada');

            console.log('Dark_green: ',Dark_green)
            console.log('Mid_green: ',Mid_green)
            console.log('Light_green: ',Light_green)
            console.log('Light_red: ',Light_red)
            console.log('Mid_red: ',Mid_red)
            console.log('Dark_red: ',Dark_red)
            console.log('Yellow: ',Yellow)
            console.log('Grey: ',Grey)

        }

    }

    getColor = (name) => {
        switch(name){
            case 'Dark green':
                return '#056DA1'
                break
            case 'Mid green':
                return '#1896D7'
                break
            case 'Light green':
                return '#E6F5FF'
                break
            case 'Light red':
                return '#ffbac8'
                break
            case 'Mid red':
                return '#c70000'
                break
            case 'Dark red':
                return '#880105'
                break
            case '-':
                return '#dadada'
                break
            case 'CAN AFFORD TO BUY BUT NOT RENT':
                return '#ffe500'
                break
            default:
                return '#dadada'
        }
    }

    expression(){
        return this.matchExpression
    }

}

export default Formula