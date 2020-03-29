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
        let configFile = require('../config.json') || configFile.dynamic == true
        if (configFile.dynamic) {
            let raw = db.prepare(`SELECT * FROM settings`).get()

            // Since the db doesn't allow for boolean values, let's replace 1s and 0s with booleans.
            Object.keys(raw).forEach(function(key){
                if (raw[key] === 1) { raw[key] = true }
                else if (raw[key] === 0) { raw[key] = false }
            })

            // Next, parse "toggles" JSON string.
            raw.toggles = JSON.parse(raw.toggles)

            return raw
        }
        else {
            return configFile
        }
    
    }

    // Modify settings methods...

    static deserializeToggles() {
        let s = this.load()
        return JSON.parse(s.toggles)
    }

    static serializeToggles(toggles) {
        return JSON.stringify(toggles)
    }

    static toggleExperiments () {
        let s = this.load()
        let currentToggle = s.experiments
        let newToggle

        if (currentToggle == 0) { newToggle = 1 }
        else { newToggle = 0 }

        db.prepare(`UPDATE settings SET experiments=${newToggle} WHERE rowid=1`).run()
    }

    static setOwner (ownerId) {
        db.prepare(`UPDATE settings SET owner='${ownerId}' WHERE rowid=1`).run()
    }

    static setPrefix (newPrefix) {
        db.prepare(`UPDATE settings SET prefix='${newPrefix}' WHERE rowid=1`).run()
    }

    static setLogChannel (newChannel) {
        db.prepare(`UPDATE settings SET log_channel='${newChannel}' WHERE rowid=1`).run()
    }

    static setStartupChannel (newChannel) {
        db.prepare(`UPDATE settings SET startup_channel='${newChannel}' WHERE rowid=1`).run()
    }

    static setRulesChannel (newChannel) {
        db.prepare(`UPDATE settings SET rules_channel='${newChannel}' WHERE rowid=1`).run()
    }

    static setDefaultTimezone (newTZ) {
        db.prepare(`UPDATE settings SET default_tz='${newTZ}' WHERE rowid=1`).run()
    }

    static setWebKey (newKey) {
        db.prepare(`UPDATE settings SET WEBKEY='${newKey}' WHERE rowid=1`).run()
    }

    static setPostKey (newKey) {
        db.prepare(`UPDATE settings SET POSTKEY='${newKey}' WHERE rowid=1`).run()
    }

    static toggleAutoModeration () {
        let s = this.load()
        let currentToggle = s.auto_moderate
        let newToggle

        if (currentToggle == 0) { newToggle = 1 }
        else { newToggle = 0 }

        db.prepare(`UPDATE settings SET auto_moderate=${newToggle} WHERE rowid=1`).run()
    }

    static setVersion (newVersion) {
        db.prepare(`UPDATE settings SET version=${newVersion} WHERE rowid=1`).run()
    }

    static setRules (newRules) {
        db.prepare(`UPDATE settings SET rules=${newRules} WHERE rowid=1`).run()
    }

    static setPatchNotes (newNotes) {
        db.prepare(`UPDATE settings SET patch_notes=${newNotes} WHERE rowid=1`).run()
    }

    static setHelpMessage (newValue) {
        db.prepare(`UPDATE settings SET help_message=${newValue} WHERE rowid=1`).run()
    }

    static toggleStartupMessage () {
        let toggles = this.deserializeToggles()
        if (toggles.startupMessage) { toggles.startupMessage = false }
        else {toggles.startupMessage = true}

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=1`).run()
    }

    static toggleStaffCommands () {
        let toggles = this.deserializeToggles()
        if (toggles.staffCmds) { toggles.staffCmds = false }
        else { toggles.staffCmds = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=1`).run()
    }

    static toggleTZConvert () {
        let toggles = this.deserializeToggles()
        if (toggles.tzConvert) { toggles.tzConvert = false }
        else { toggles.tzConvert = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=1`).run()
    }

    static toggleHelpCommand () {
        let toggles = this.deserializeToggles()
        if (toggles.helpCmd) { toggles.helpCmd = false }
        else { toggles.helpCmd = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=1`).run()
    }

    static toggleRulesCommand () {
        let toggles = this.deserializeToggles()
        if (toggles.rulesCmd) { toggles.rulesCmd = false }
        else { toggles.rulesCmd = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=1`).run()
    }

    static toggleVersionCommand () {
        let toggles = this.deserializeToggles()
        if (toggles.versionCmd) { toggles.versionCmd = false }
        else { toggles.versionCmd = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=1`).run()
    }

    static toggleAddEvidence () {
        let toggles = this.deserializeToggles()
        if (toggles.mAddEvidence) { toggles.mAddEvidence = false }
        else { toggles.mAddEvidence = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=1`).run()
    }

    static toggleCommenting () {
        let toggles = this.deserializeToggles()
        if (toggles.mComment) { toggles.mComment = false }
        else { toggles.mComment = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=1`).run()
    }

    static toggleThreads () {
        let toggles = this.deserializeToggles()
        if (toggles.mViewThread) { toggles.mViewThread = false }
        else { toggles.mViewThread = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=1`).run()
    }

    static toggleUserAttachments () {
        let toggles = this.deserializeToggles()
        if (toggles.mViewUserAttachments) { toggles.mViewUserAttachments = false }
        else { toggles.mViewUserAttachments = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=1`).run()
    }

    static toggleGameLogs () {
        let toggles = this.deserializeToggles()
        if (toggles.mViewGameLogs) { toggles.mViewGameLogs = false }
        else { toggles.mViewGameLogs = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=1`).run()
    }

    static toggleUserStatus () {
        let toggles = this.deserializeToggles()
        if (toggles.mViewUserStatus) { toggles.mViewUserStatus = false }
        else { toggles.mViewUserStatus = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=1`).run()
    }

    static toggleLogCreation () {
        let toggles = this.deserializeToggles()
        if (toggles.mCreateLogs) { toggles.mCreateLogs = false }
        else { toggles.mCreateLogs = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=1`).run()
    }

    static toggleNotifications () {
        let toggles = this.deserializeToggles()
        if (toggles.notify) { toggles.notify = false }
        else { toggles.notify = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=1`).run()
    }

    static toggleLogDeletion () {
        let toggles = this.deserializeToggles()
        if (toggles.mDeleteLogs) { toggles.mDeleteLogs = false }
        else { toggles.mDeleteLogs = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=1`).run()
    }

    static setNotifyChannel (newChannel) {
        let toggles = this.deserializeToggles()
        toggles.nChannel = newChannel

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=1`).run()
    }
}