module.exports.check = function () {
    let config = require('../../structures/Settings').load()
    return config.experiments
}