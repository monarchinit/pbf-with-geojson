const fs = require("fs");
const path = require('path');

function synhronizationStateId() {
    const stateDataJSON = JSON.parse(fs.readFileSync(path.join(__dirname , '..\\sourceIdData\\adm1.json'),"utf8")) 
    const stateGEOJSON = JSON.parse(fs.readFileSync(path.join(__dirname , '..\\geojsonData\\state.geo.json'),"utf8")) 

    function findID (zipCode) {
        const data = Object.entries(stateDataJSON.all) 
        return parseInt( (data.find(el=>el[1].code===zipCode)||[0])[0] ,10 ) 
    }

    const data = stateGEOJSON.features
    .filter(el=>!!findID(el.properties.GEOID10))
    .map(el=>{
        const newEl = el
        newEl.properties.ID_FOR_VECTOR_FEATURE = findID(el.properties.GEOID10)
        return newEl
    })

    const newGEOJSON = {
        type: "FeatureCollection",
        features: data
    }

    fs.writeFile('geojsonData/state.geo.json', JSON.stringify(newGEOJSON) ,()=>{})
}

function synhronizationCountyId() {
    const countyDataJSON = JSON.parse(fs.readFileSync(path.join(__dirname , '..\\sourceIdData\\adm2.json'),"utf8")) 
    const countyGEOJSON = JSON.parse(fs.readFileSync(path.join(__dirname , '..\\geojsonData\\county.geo.json'),"utf8")) 

    function findID (zipCode) {
        const data = Object.entries(countyDataJSON.all) 
        return parseInt( (data.find(el=>el[1].code===zipCode)||[0])[0] , 10 ) 
    }

    const data = countyGEOJSON.features
    .filter(el=>!!findID(el.properties.GEOID10))
    .map(el=>{
        const newEl = el
        newEl.properties.ID_FOR_VECTOR_FEATURE = findID(el.properties.GEOID10)
        return newEl
    })

    const newGEOJSON = {
        type: "FeatureCollection",
        features: data
    }

    fs.writeFile('geojsonData/county.geo.json', JSON.stringify(newGEOJSON) ,()=>{})
}

function synhronizationZipCodeId() {
    const zipCodeDataJSON = JSON.parse(fs.readFileSync(path.join(__dirname , '..\\sourceIdData\\adm3.json'),"utf8")) 

    function findID (zipCode) {
        const data = Object.entries(zipCodeDataJSON.all) 
        return parseInt( (data.find(el=>el[1].code===zipCode)||[0])[0] , 10 ) 
    }

    const itemsFile = fs.readdirSync(path.join(__dirname , '..\\geojsonData\\zcws\\'));

    itemsFile.forEach((file,i)=>{
        let str = file.substr(file.length-4)
        if(str!=='json'){
            return
        }

        console.log(`${i+1} Updating ${file}`)
        const zipcodeWithEachStateGEOJSON = JSON.parse(fs.readFileSync(path.join(__dirname , `../geojsonData/zcws/${file}`),"utf8")) 

        const data = zipcodeWithEachStateGEOJSON.features
        .reduce((acc,el)=>{
            const id = findID(el.properties.ZCTA5CE10)
            if(!id){
                return acc
            }
            const newEl = el
            newEl.properties.ID_FOR_VECTOR_FEATURE = id
            return [...acc,newEl]
        },[])

        const newGEOJSON = {
            type: "FeatureCollection",
            features: data
        }

        fs.writeFileSync(`geojsonData/zcws/${file}`, JSON.stringify(newGEOJSON) ,()=>{})

    })
}

console.log('Start synhronization StateId ')
synhronizationStateId()
console.log('Finish synhronization StateId ')

console.log('Start synhronization CountyId ')
synhronizationCountyId()
console.log('Finish synhronization CountyId ')

console.log('Start synhronization ZipCodeId ')
synhronizationZipCodeId()
console.log('Finish synhronization ZipCodeId ')
