var http = require('http')
var url = require('url')

module.exports.verify = function (link, callback) {
var options = {
   method: 'HEAD',
   host: url.parse(link).host,
   port: 80,
   path: url.parse(link).pathname
}
var req = http.request(options, function (r) {
   callback(r.statusCode == 200)
})
req.end()
}