#---- Colour palette: https://gka.github.io/palettes/#/6|d|c70000|004e3a|1|0
#---- Data source: https://datashare.ed.ac.uk/handle/10283/2597
#---- Geojson exported as EPSG:4326 on QGIS
#---- Mbtiles conversion: tippecanoe -zg -o PostalDistrict.mbtiles --drop-densest-as-needed --extend-zooms-if-still-dropping -f PostalDistrict.geojson
#---- Pbf file system creation: mb-util PostalDistrict.mbtiles tiles --image_format=pbf
aws s3 sync "./gis/tiles-bb" s3://gdn-cdn/maptiles/postal-districts-bb/ --acl public-read --cache-control max-age=60 --content-encoding gzip --content-type application/x-protobuf    
