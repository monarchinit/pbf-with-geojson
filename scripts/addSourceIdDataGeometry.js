const fs = require("fs");
const path = require("path");

function synchronizationGeometry(geojsonFEATURES,dataJSON) {
    const dataId = Object.entries(dataJSON.all)
    const newDataJSON = dataJSON

    function findLATwithId(id) {
        const res =  geojsonFEATURES.find(el=>el.properties.ID_FOR_VECTOR_FEATURE==id)

        if(res){
            return res.properties.INTPTLAT10||''
        }else{
            return 0
        }
    }

    function findLONwithId(id) {
        const res =  geojsonFEATURES.find(el=>el.properties.ID_FOR_VECTOR_FEATURE==id)
        if(res){
            return res.properties.INTPTLON10||''
        }else{
            return 0
        }
    }

    newDataJSON.all =  dataId.reduce((acc,el)=>{

        const INTPTLAT10 = findLATwithId(el[0])
        const INTPTLON10 = findLONwithId(el[0])

        if ((typeof INTPTLAT10 === 'number') || (typeof INTPTLON10 === 'number')){
            return acc
        }

        return {
            ...acc,
            [el[0]]:{
                ...el[1],
                INTPTLAT10,
                INTPTLON10
            }
        }
    },{})

    return newDataJSON
}

function addGeometryToState() {
    const stateGEOJSON = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../geojsonData/state.geo.json"),
            "utf8"
        )
    );
    const stateDataJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../sourceIdData/adm1.json"), "utf8")
    );


    const data = synchronizationGeometry(stateGEOJSON.features, stateDataJSON);

    fs.writeFileSync(
        path.join(__dirname, "..//adm1.json"),
        JSON.stringify(data),
        (e) => { console.log(e) }
    );
}

function addGeometryToCounty() {
    const stateGEOJSON = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../geojsonData/county.geo.json"),
            "utf8"
        )
    );
    const stateDataJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../sourceIdData/adm2.json"), "utf8")
    );


    const data = synchronizationGeometry(stateGEOJSON.features, stateDataJSON);

    fs.writeFileSync(
        path.join(__dirname, "..//adm2.json"),
        JSON.stringify(data),
        (e) => { console.log(e) }
    );
}

addGeometryToState()
addGeometryToCounty()