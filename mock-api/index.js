const http = require('http')
var fs = require('fs');

http.createServer(function (request, response) {
  console.log('request.url ', request.url)

  console.log('reading data from file gdp-per-capita-2019.json')
  const cities = JSON.parse(fs.readFileSync('gdp-per-capita-2019.json', 'utf8'))
  console.log('first result: ', cities[0])
  
  response.writeHead(200, { 'Access-Control-Allow-Origin': '*'})

  response.end(JSON.stringify(cities), 'utf-8')
}).listen(8125)

console.log('Server running at http://127.0.0.1:8125/')