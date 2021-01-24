import fs 			from 'fs';
import geojsonvt 	from 'geojson-vt';

console.log("Start parsing state.geo.json");
const stateJson = JSON.parse(fs.readFileSync(__dirname + '/../../geojsonData/state.geo.json'))
console.log("Successfully parsed parsing state.geo.json");

const stateTiles = geojsonvt(stateJson, {
    maxZoom: 10,  // max zoom to preserve detail on; can't be higher than 24
	tolerance: 10, // simplification tolerance (higher means simpler)
	extent: 4096, // tile extent (both width and height)
	buffer: 128,   // tile buffer on each side
	debug: 1,     // logging level (0 to disable, 1 or 2)
	lineMetrics: false, // whether to enable line metrics tracking for LineString/MultiLineString features
	promoteId: 'ID_FOR_VECTOR_FEATURE',    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
	generateId: false,  // whether to generate feature ids. Cannot be used with `promoteId`
	indexMaxZoom: 5,       // max zoom in the initial tile index
	indexMaxPoints: 100000, // max number of points per tile in the index
});

console.log("Creating county tiles model");

export default stateTiles;