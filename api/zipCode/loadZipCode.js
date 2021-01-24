import fs 			from 'fs';
import path 		from 'path';
import geojsonvt 	from 'geojson-vt';

const optionsVT = {
		maxZoom: 12,  // max zoom to preserve detail on; can't be higher than 24
		tolerance: 20, // simplification tolerance (higher means simpler)
		extent: 4096, // tile extent (both width and height)
		buffer: 128,   // tile buffer on each side
		debug: 1,     // logging level (0 to disable, 1 or 2)
		lineMetrics: false, // whether to enable line metrics tracking for LineString/MultiLineString features
		promoteId: 'ID_FOR_VECTOR_FEATURE',    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
		generateId: false,  // whether to generate feature ids. Cannot be used with `promoteId`
		indexMaxZoom: 5,       // max zoom in the initial tile index
		indexMaxPoints: 100000, // max number of points per tile in the index
	}

const itemsFile = fs.readdirSync(path.join(__dirname , '..\\..\\geojsonData\\zcws\\'));

const listZipCodeTiles = itemsFile.reduce((acc,el,i)=>{
	let str = el.substr(el.length-4)

	if(str==='json'){
		console.log(i+1,"чтение файла",el);
		const data = fs.readFileSync(path.join(__dirname , `..\\..\\geojsonData\\zcws\\${el}`), "utf8");
				
		const res = geojsonvt(JSON.parse(data),optionsVT);
		acc =[ ...acc , res]
	}
	return acc
},[])

console.log("Creating zipCode tiles model");

export default listZipCodeTiles;
