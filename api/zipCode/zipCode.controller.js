import vtpbf          from 'vt-pbf';
import listZipCodeTiles   from './loadZipCode';
export class ZipCodeController {

    generatePBF=(req, res, next) => {

      const {z, x, y} = req.query

      const tile = this.concatZipCodeTiles(parseInt(z, 10), parseInt(x, 10), parseInt(y, 10))
  
      if (!tile.numFeatures) {
        res.writeHead(204, { 'Access-Control-Allow-Origin': '*' })
        return res.end()
      }
      const buffer = Buffer.from(vtpbf.fromGeojsonVt({ adm3Layer: tile }))

      res.writeHead(200, {
        'Content-Type': 'application/protobuf',
        'Access-Control-Allow-Origin': '*'
      })
      res.write(buffer, 'binary')
      res.end(null, 'binary')

      }

    concatZipCodeTiles(z,x,y) {

      const initialACC = {
        z,
        x,
        y,
        transformed:true,
        source:[],
        numFeatures:0,
        numSimplified:0,
        numPoints:0,
        features:[],
        minX:0,
        minY:0,
        maxX:0,
        maxY:0
      }

     return listZipCodeTiles.reduce((acc,el)=>{
        if(!el.getTile){
          return acc
        }
        const tile = el.getTile(z,x,y)
        if(!tile){
          return acc
        }

        return {
          ...acc,
          transformed     : tile.transformed,
          source          : [ ...acc.source , ...(tile.source || []) ],
          numFeatures     : acc.numFeatures   + tile.numFeatures,
          numSimplified   : acc.numSimplified + tile.numSimplified,
          numPoints       : acc.numPoints     + tile.numPoints,
          features        : [ ...acc.features , ...(tile.features || []) ],
          minX            : (acc.minX + tile.minX)/2,
          minY            : (acc.minY + tile.minY)/2,
          maxX            : (acc.maxX + tile.maxX)/2,
          maxY            : (acc.maxY + tile.maxY)/2,
        }

      },initialACC)
    }
}

export default new ZipCodeController()