import fs from "fs";
import JSONStream from "JSONStream";
import es from "event-stream";

let features = [];
console.log("Start creating zipCode");

const jsonPath = __dirname + "../geojsonData/zip.geo.json",
  stream = fs.createReadStream(jsonPath, { encoding: "utf8" }),
  parser = JSONStream.parse("*");

let index = 0;

stream.pipe(parser).pipe(
  es.mapSync((data) => {
    features.push(data);
    if (features.length % 1000 === 0) {
      fs.writeFile(
        __dirname + `../geojsonData/zipCode/zip.${index}.json`,
        JSON.stringify(features),
        (e) => console.log(e)
      );
      features = [];
      index = index + 1;
    }
  })
);

stream.on("end", () => {
  console.log("successfully created zip code splitting");
});
