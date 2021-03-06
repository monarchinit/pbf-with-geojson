import vtpbf        from 'vt-pbf';
import countyTiles  from './loadCounty';

export class CountyController {

    generatePBF(req, res, next) {

        const {z, x, y} = req.query

      const tile = countyTiles.getTile(parseInt(z, 10), parseInt(x, 10), parseInt(y, 10))
  
      if (!tile) {
        res.writeHead(204, { 'Access-Control-Allow-Origin': '*' })
        return res.end()
      }

      const buffer = Buffer.from(vtpbf.fromGeojsonVt({ adm2Layer: tile }))

      res.writeHead(200, {
        'Content-Type': 'application/protobuf',
        'Access-Control-Allow-Origin': '*'
      })
      res.write(buffer, 'binary')
      res.end(null, 'binary')

      }
}

export default new CountyController()