var config = require('../config.json')

module.exports.check = function () {
    return config.enableExperiments
}