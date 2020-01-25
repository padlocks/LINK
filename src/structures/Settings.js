/*
    * Settings.js
    * Structure for applying and modifying settings from the database. A settings loader.
    
    ? Default use-case: 
    ? let s = require('./structures/Settings.js').load()
*/

var Database = require('better-sqlite3')
var db = new Database('tc2.db', { fileMustExist: true })

module.exports = class Settings {

    static load () {
        let configFile = require('../../config.json')
        if (!configFile.dynamic) {

            let raw = db.prepare(`SELECT * FROM settings`).get()

            // Since the db doesn't allow for boolean values, let's replace 1s and 0s with booleans.
            Object.keys(raw).forEach(function(key){
                if (raw[key] === 1) { raw[key] = true }
                else if (raw[key] === 0) { raw[key] = false }
            })

            return raw
        }
        else {
            return configFile
        }
    }

    // Modify settings methods...

}