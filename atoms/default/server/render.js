import mainHTML from "./atoms/default/server/templates/main.html!text"
import request from "request-promise"
import fs from "fs"


export async function render() {

    const sheet = await request({"uri":'https://interactive.guim.co.uk/docsdata-test/11SLL55WwROril-6407448VlmwpEBA28iAe8g95SjPUs.json', json:true});
    fs.writeFileSync(`assets/sheet.json`, JSON.stringify(sheet));

    const listAreas = sheet.sheets.Master.map(d => d['Town/Area'].split(', '))
    const listCodes = sheet.sheets.Master.map(d => d.Postcode_district)

    const areasAndCodes = []
    
    listAreas.forEach((element,i) => {

        element.forEach(el => {
            
            let row = areasAndCodes.push({area:el, code:listCodes[i] + ' - ' + el}) 
        })
        
    });

    fs.writeFileSync(`assets/areas-codes.json`, JSON.stringify(areasAndCodes));


    return mainHTML;
} 