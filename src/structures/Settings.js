/*
    * Settings.js
    * Structure for applying and modifying settings from the database. A settings loader.
    
    * Allows for advanced settings manipulation without a program restart.
    * Note: This should be loaded before an operation, not at the beginning of the file.

    ? Default use-case: 
    ? let s = require('./structures/Settings.js').load()

    * Hot-Swap Settings Tables
    ? For multiple settings versions per operation:
    ? let s = require('./structures/Settings.js').load(1)

    ? For swapping settings tables, edit the INT sv in table sv_loader.
    ? If sv is invalid, it will default to sv=1.
    ? Editing any setting via command will edit the currently loaded settings table.
*/

const Database = require('better-sqlite3')
const db = new Database('tc.db', { fileMustExist: true })

module.exports = class Settings {

    load (version=0) {
        // Version 1 is ALWAYS the production version.
        let configFile = require('../config.json') || configFile.dynamic == true
        if (configFile.dynamic) {
            let sv
            // version is default, load set sv.
            if (version == 0) { sv = db.prepare(`SELECT 1 FROM sv_loader`).pluck().get() || 1 }
            let raw = db.prepare(`SELECT * FROM settings WHERE sv=${sv}`).get()

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

    static async deserializeToggles () {
        let s = this.load()
        return JSON.parse(s.toggles)
    }

    static async serializeToggles (toggles) {
        return JSON.stringify(toggles)
    }

    static async svGet () {
        return db.prepare(`SELECT 1 FROM sv_loader`).pluck().get()
    }

    static async toggleExperiments () {
        let s = this.load()
        let currentToggle = s.experiments
        let newToggle

        if (currentToggle == 0) { newToggle = 1 }
        else { newToggle = 0 }

        db.prepare(`UPDATE settings SET experiments=${newToggle} WHERE rowid=${this.svGet()}`).run()
    }

    static async setOwner (ownerId) {
        db.prepare(`UPDATE settings SET owner='${ownerId}' WHERE rowid=${this.svGet()}`).run()
    }

    static async setPrefix (newPrefix) {
        db.prepare(`UPDATE settings SET prefix='${newPrefix}' WHERE rowid=${this.svGet()}`).run()
    }

    static async setLogChannel (newChannel) {
        db.prepare(`UPDATE settings SET log_channel='${newChannel}' WHERE rowid=${this.svGet()}`).run()
    }

    static async setStartupChannel (newChannel) {
        db.prepare(`UPDATE settings SET startup_channel='${newChannel}' WHERE rowid=${this.svGet()}`).run()
    }

    static async setRulesChannel (newChannel) {
        db.prepare(`UPDATE settings SET rules_channel='${newChannel}' WHERE rowid=${this.svGet()}`).run()
    }

    static async setDefaultTimezone (newTZ) {
        db.prepare(`UPDATE settings SET default_tz='${newTZ}' WHERE rowid=${this.svGet()}`).run()
    }

    static async setWebKey (newKey) {
        db.prepare(`UPDATE settings SET WEBKEY='${newKey}' WHERE rowid=${this.svGet()}`).run()
    }

    static async setPostKey (newKey) {
        db.prepare(`UPDATE settings SET POSTKEY='${newKey}' WHERE rowid=${this.svGet()}`).run()
    }

    static async toggleAutoModeration () {
        let s = this.load()
        let currentToggle = s.auto_moderate
        let newToggle

        if (currentToggle == 0) { newToggle = 1 }
        else { newToggle = 0 }

        db.prepare(`UPDATE settings SET auto_moderate=${newToggle} WHERE rowid=${this.svGet()}`).run()
    }

    static async setVersion (newVersion) {
        db.prepare(`UPDATE settings SET version=${newVersion} WHERE rowid=${this.svGet()}`).run()
    }

    static async setRules (newRules) {
        db.prepare(`UPDATE settings SET rules=${newRules} WHERE rowid=${this.svGet()}`).run()
    }

    static async setPatchNotes (newNotes) {
        db.prepare(`UPDATE settings SET patch_notes=${newNotes} WHERE rowid=${this.svGet()}`).run()
    }

    static async setHelpMessage (newValue) {
        db.prepare(`UPDATE settings SET help_message=${newValue} WHERE rowid=${this.svGet()}`).run()
    }

    static async toggleStartupMessage () {
        let toggles = this.deserializeToggles()
        if (toggles.startupMessage) { toggles.startupMessage = false }
        else {toggles.startupMessage = true}

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=${this.svGet()}`).run()
    }

    static async toggleStaffCommands () {
        let toggles = this.deserializeToggles()
        if (toggles.staffCmds) { toggles.staffCmds = false }
        else { toggles.staffCmds = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=${this.svGet()}`).run()
    }

    static async toggleTZConvert () {
        let toggles = this.deserializeToggles()
        if (toggles.tzConvert) { toggles.tzConvert = false }
        else { toggles.tzConvert = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=${this.svGet()}`).run()
    }

    static async toggleHelpCommand () {
        let toggles = this.deserializeToggles()
        if (toggles.helpCmd) { toggles.helpCmd = false }
        else { toggles.helpCmd = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=${this.svGet()}`).run()
    }

    static async toggleRulesCommand () {
        let toggles = this.deserializeToggles()
        if (toggles.rulesCmd) { toggles.rulesCmd = false }
        else { toggles.rulesCmd = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=${this.svGet()}`).run()
    }

    static async toggleVersionCommand () {
        let toggles = this.deserializeToggles()
        if (toggles.versionCmd) { toggles.versionCmd = false }
        else { toggles.versionCmd = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=${this.svGet()}`).run()
    }

    static async toggleAddEvidence () {
        let toggles = this.deserializeToggles()
        if (toggles.mAddEvidence) { toggles.mAddEvidence = false }
        else { toggles.mAddEvidence = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=${this.svGet()}`).run()
    }

    static async toggleCommenting () {
        let toggles = this.deserializeToggles()
        if (toggles.mComment) { toggles.mComment = false }
        else { toggles.mComment = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=${this.svGet()}`).run()
    }

    static async toggleThreads () {
        let toggles = this.deserializeToggles()
        if (toggles.mViewThread) { toggles.mViewThread = false }
        else { toggles.mViewThread = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=${this.svGet()}`).run()
    }

    static async toggleUserAttachments () {
        let toggles = this.deserializeToggles()
        if (toggles.mViewUserAttachments) { toggles.mViewUserAttachments = false }
        else { toggles.mViewUserAttachments = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=${this.svGet()}`).run()
    }

    static async toggleGameLogs () {
        let toggles = this.deserializeToggles()
        if (toggles.mViewGameLogs) { toggles.mViewGameLogs = false }
        else { toggles.mViewGameLogs = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=${this.svGet()}`).run()
    }

    static async toggleUserStatus () {
        let toggles = this.deserializeToggles()
        if (toggles.mViewUserStatus) { toggles.mViewUserStatus = false }
        else { toggles.mViewUserStatus = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=${this.svGet()}`).run()
    }

    static async toggleLogCreation () {
        let toggles = this.deserializeToggles()
        if (toggles.mCreateLogs) { toggles.mCreateLogs = false }
        else { toggles.mCreateLogs = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=${this.svGet()}`).run()
    }

    static async toggleNotifications () {
        let toggles = this.deserializeToggles()
        if (toggles.notify) { toggles.notify = false }
        else { toggles.notify = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=${this.svGet()}`).run()
    }

    static async toggleLogDeletion () {
        let toggles = this.deserializeToggles()
        if (toggles.mDeleteLogs) { toggles.mDeleteLogs = false }
        else { toggles.mDeleteLogs = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=${this.svGet()}`).run()
    }

    static async setNotifyChannel (newChannel) {
        let toggles = this.deserializeToggles()
        toggles.nChannel = newChannel

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=${this.svGet()}`).run()
    }

    static async toggleAutoAct () {
        let toggles = this.deserializeToggles()
        if (toggles.mDeleteLogs) { toggles.autoAct = false }
        else { toggles.autoAct = true }

        db.prepare(`UPDATE settings SET toggles=${this.serializeToggles(toggles)} WHERE rowid=${this.svGet()}`).run()
    }

    static async svModify(value) {
        let svCurrent = db.prepare(`SELECT 1 FROM sv_loader`).pluck().get()

        if (svCurrent != value) {
            db.prepare(`UPDATE sv_loader SET sv=${value} WHERE rowid=1`).run()
            return `Settings table has been swapped from \`sv=${svCurrent}\` to \`sv=${value}\`.`
        }

        else {
            return `\`sv\` already equals \`${value}\``
        }
    }
}