import fs 			from 'fs';
import geojsonvt 	from 'geojson-vt';

console.log("Start parsing zipCode");
const zipCodeJson = JSON.parse(fs.readFileSync(__dirname + '/../../geojsonData/state.geo.json'))
console.log("Successfully parsed parsing zipCode");

const zipCodeTiles = geojsonvt(zipCodeJson, {
    maxZoom: 12,  // max zoom to preserve detail on; can't be higher than 24
	tolerance: 2, // simplification tolerance (higher means simpler)
	extent: 4096, // tile extent (both width and height)
	buffer: 128,   // tile buffer on each side
	debug: 1,     // logging level (0 to disable, 1 or 2)
	lineMetrics: false, // whether to enable line metrics tracking for LineString/MultiLineString features
	promoteId: null,    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
	generateId: true,  // whether to generate feature ids. Cannot be used with `promoteId`
	indexMaxZoom: 10,       // max zoom in the initial tile index
	indexMaxPoints: 100000 // max number of points per tile in the index
});

export default zipCodeTiles;