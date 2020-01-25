/*
    * Settings.js
    * Structure for applying and modifying settings from the database. A settings loader.
    
    * Allows for option changes without a program restart.
    * Note: This should be loaded before operation, not at the beginning of the file.

    ? Default use-case: 
    ? let s = require('./structures/Settings.js').load()
*/

const Database = require('better-sqlite3')
const db = new Database('tc2.db', { fileMustExist: true })

module.exports = class Settings {

    static load () {
        let configFile = require('../../config.json')
        if (configFile.dynamic) {
            let raw = db.prepare(`SELECT * FROM settings`).get()

            // Since the db doesn't allow for boolean values, let's replace 1s and 0s with booleans.
            Object.keys(raw).forEach(function(key){
                if (raw[key] === 1) { raw[key] = true }
                else if (raw[key] === 0) { raw[key] = false }
            })

            // Next, parse "toggles" JSON string.
            JSON.parse(raw.toggles)

            return raw
        }
        else {
            return configFile
        }
    }

    // Modify settings methods...


}