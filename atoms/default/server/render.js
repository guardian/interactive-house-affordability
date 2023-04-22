import mainHTML from "./atoms/default/server/templates/main.html!text"
import request from "request-promise"
import fs from "fs"


export async function render() {

    const sheet = await request({"uri":'https://interactive.guim.co.uk/docsdata-test/11SLL55WwROril-6407448VlmwpEBA28iAe8g95SjPUs.json', json:true});

    console.log(sheet.sheets.Master)
    fs.writeFileSync(`assets/sheet.json`, JSON.stringify(sheet.sheets.Master));


    //const listCodes = sheet.sheets.Master.map(d => d.Postcode_District)
    //const listAreas = sheet.sheets.Master.map(d => d['Town/Area'])

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

    fs.writeFileSync(`assets/codes.json`, JSON.stringify(areasCodes));

    
    // const listAreas = sheet.sheets.Master.map(d => d['Town/Area'].split(', '))
    // const listCodes = sheet.sheets.Master.map(d => d.Postcode_District)

    // let max = 0
    // let arr 

    // listAreas.forEach(a => {

    //     if(a.length > max)
    //     {
    //         max = a.length
    //         arr = a
    //     }

    // })

    // const areasAndCodes = []
    
    // listAreas.forEach((element,i) => {

    //     element.forEach(el => {
            
    //         let row = areasAndCodes.push({area:el, areaCode:listCodes[i] + ' | ' + el, code: listCodes[i]}) 
    //     })
        
    // });

    // fs.writeFileSync(`assets/areas-codes.json`, JSON.stringify(areasAndCodes));

    return mainHTML;
} 