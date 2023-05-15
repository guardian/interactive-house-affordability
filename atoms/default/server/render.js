import mainHTML from "./atoms/default/server/templates/main.html!text"
import request from "request-promise"
import fs from "fs"


export async function render() {

    const sheet = await request({"uri":'https://interactive.guim.co.uk/docsdata-test/11SLL55WwROril-6407448VlmwpEBA28iAe8g95SjPUs.json', json:true});

    //console.log(sheet.sheets.Master)
    //fs.writeFileSync(`assets/sheet.json`, JSON.stringify(sheet.sheets.Master));

    const areasCodes = []

    sheet.sheets.Master.forEach(element => {
        
        areasCodes.push(
            {
                code:element.Postcode_District,
                areas:element['Town/Area'],
                codesAreas:element.Postcode_District + ' | ' + element['Town/Area']
            }
        )

    });

    //fs.writeFileSync(`assets/codes.json`, JSON.stringify(areasCodes));


    return mainHTML;
} 