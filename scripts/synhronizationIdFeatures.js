const fs = require("fs");
const path = require("path");

function synchronization(features, idJson, outputName, isFeature = false) {
    const idData = Object.entries(idJson.all);

    function findID(zipCode) {
        return parseInt(
            (idData.find((el) => el[1].code === zipCode) || [0])[0],
            10
        );
    }

    const newFeatures = features
        .filter((el) => !!findID(el.properties.GEOID10))
        .map((el) => {
            const newEl = el;
            newEl.properties.ID_FOR_VECTOR_FEATURE = findID(el.properties.GEOID10);
            return newEl;
        });

    const newGEOJSON = {
        type: "FeatureCollection",
        features: newFeatures,
    };

    fs.writeFileSync(
        isFeature?`geojsonData/zipCode/${outputName}.json`:`geojsonData/${outputName}.json`,
        JSON.stringify(isFeature ? newFeatures : newGEOJSON),
        () => { }
    );
}

function synchronizationStateId() {
    const stateGEOJSON = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "..\\geojsonData\\state.geo.json"),
            "utf8"
        )
    );
    const stateDataJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "..\\sourceIdData\\adm1.json"), "utf8")
    );

    synchronization(stateGEOJSON.features, stateDataJSON, "state.geo");
}

function synchronizationCountyId() {
    const countyDataJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "..\\sourceIdData\\adm2.json"), "utf8")
    );

    const countyGEOJSON = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "..\\geojsonData\\county.geo.json"),
            "utf8"
        )
    );

    synchronization(countyGEOJSON.features, countyDataJSON, "county.geo");
}

function synchronizationZipCodeId() {
    const zipDataJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "..\\sourceIdData\\adm3.json"), "utf8")
    );

    for (let i = 0; i < 33; i++) {
        const zip = require(`../geojsonData/ziCode/zip.${i}.json`);
        synchronization(zip, zipDataJSON, `zip.${i}`, true);
        console.log(
            `zip synchronization in progress ${Math.floor(((i + 1) / 33) * 100)} %`
        );
    }
}

console.log("Start synchronization StateId ");
synchronizationStateId();
console.log("Finish synchronization StateId ");

console.log("Start synchronization CountyId ");
synchronizationCountyId();
console.log("Finish synchronization CountyId ");

console.log("Start synchronization ZipCodeId ");
synchronizationZipCodeId();
console.log("Finish synchronization ZipCodeId ");

