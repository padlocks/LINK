/*
    * Game.js
    * Various methods for interacting with the group games's API.
*/

var Database = require('better-sqlite3')
var db = new Database('tc.db', { fileMustExist: true })

module.exports = class Moderation {
    //* Containter for all database calls related to 'moderation' commands.

    /*
     * Get Methods
     */

    static async generateLogId() {
        db.aggregate('max', {
            start: 0,
            step: (total, nextValue) => {
                if (nextValue > total) {
                    let max = nextValue
                    return max
                }
            }
        })

        return db.prepare('SELECT max(id) FROM logs').pluck().get() || 100
    }

    static async getReason(logId) {
        return db.prepare(`SELECT reason FROM logs WHERE id='${logId}'`).pluck().get()
    }

    static async getLogTime(logId) {
        return db.prepare(`SELECT time FROM logs WHERE id=${logId}`).pluck().get()
    }

    static async getMessageId(logId) {
        return db.prepare(`SELECT log_message_id FROM logs WHERE id=${logId}`).pluck().get()
    }

    static async getStaffResponsible(logId) {
        let username = db.prepare(`SELECT staff_username FROM logs WHERE id=${logId}`).pluck().get()
        let id = db.prepare(`SELECT staff_id FROM logs WHERE id=${logId}`).pluck().get()

        return `${username} (${id})`
    }

    static async getStaffResponsibleName(logId) {
        return db.prepare(`SELECT staff_username FROM logs WHERE id=${logId}`).pluck().get()
    }

    static async getStaffResponsibleId(logId) {
        return db.prepare(`SELECT staff_id FROM logs WHERE id=${logId}`).pluck().get()
    }

    static async getUser(logId) {
        let username = db.prepare(`SELECT username FROM logs WHERE id=${logId}`).pluck().get()
        let id = db.prepare(`SELECT user_id FROM logs WHERE id=${logId}`).pluck().get()

        return `${username} (${id})`
    }

    static async getUserName(logId) {
        return db.prepare(`SELECT username FROM logs WHERE id=${logId}`).pluck().get()
    }

    static async getIGNFromIGID(igid) {
        return db.prepare(`SELECT ign FROM users WHERE igid=${igid}`).pluck().get()
    }

    static async getUserId(logId) {
        return db.prepare(`SELECT user_id FROM logs WHERE id=${logId}`).pluck().get()
    }
    
    static async getTotalUserLogAmount(userId) {
        let amount = 0
        let data = db.prepare(`SELECT id FROM logs WHERE user_id=${userId}`).all()
        data.forEach((elem) => { amount++ })
        return amount
    }

    static async getUserLogNumber(userId) {
        return db.prepare(`SELECT user_log_num FROM logs WHERE user_id=${userId}`).pluck().get() || 0
    }

    static async getUserLogs(userId) {
        return db.prepare(`SELECT * FROM logs WHERE user_id=${userId}`).all()
    }

    static async getAction(logId) {
        return db.prepare(`SELECT action FROM logs WHERE id=${logId}`).pluck().get()
    }

    static async getPoints(userId) {
        return db.prepare(`SELECT points FROM users WHERE id='${userId}'`).pluck().get() || 0
    }

    static async getReasonValue(reason) {
        return db.prepare(`SELECT point_value FROM reasons WHERE reason='${reason}'`).pluck().get()
    }

    static async getEvidenceString(logId) {
        // Depreciated in favor of pagination.
        let evidenceString = ''
        let data = db.prepare(`SELECT evidence_url FROM evidence WHERE id=${logId}`).all()
        data.forEach((elem) => {
            evidenceString = evidenceString + `<${elem['evidence_url']}>` + '\n'
        })
        return evidenceString
    }

    static async getLogEvidence(logId) {
        return db.prepare(`SELECT * FROM evidence WHERE id=${logId}`).all()
    }

    static async getAllUserEvidence(userId) {
        return db.prepare(`SELECT * FROM evidence WHERE user=${userId}`).all()
    }

    static async getAllComments(logId) {
        let data = db.prepare(`SELECT * FROM comments WHERE log_id=${logId}`).all()
        return data
    }

    static async getLogLocation(logId) {
        return db.prepare(`SELECT location FROM logs WHERE id='${logId}'`).pluck().get()
    }

    static async getEvidenceLocation(logId) {
        return db.prepare(`SELECT location FROM evidence WHERE id=${logId}`).pluck().get()
    }

    static async getUserIGN(userId) {
        return db.prepare(`SELECT ign FROM users WHERE id='${userId}'`).pluck().get() || 0
    }

    static async getUserIGID(userId) {
        return db.prepare(`SELECT points FROM users WHERE id='${userId}'`).pluck().get() || 0
    }

    static async getUserGBanStatus(userId) {
        return db.prepare(`SELECT gban_status FROM users WHERE id='${userId}'`).pluck().get() || 0
    }

    static async getUserChatWarnings(userId) {
        return db.prepare(`SELECT chat_warnings FROM users WHERE id='${userId}'`).pluck().get() || 0
    }

    static async getUserGameWarnings(userId) {
        return db.prepare(`SELECT game_warnings FROM users WHERE igid='${userId}'`).pluck().get() || 0
    }

    static async getUserChatKicks(userId) {
        return db.prepare(`SELECT chat_kicks FROM users WHERE id='${userId}'`).pluck().get() || 0
    }

    static async getUserGameKicks(userId) {
        return db.prepare(`SELECT game_kicks FROM users WHERE igid='${userId}'`).pluck().get() || 0
    }

    static async getUserChatBans(userId) {
        return db.prepare(`SELECT chat_bans FROM users WHERE id='${userId}'`).pluck().get() || 0
    }

    static async getUserGameBans(userId) {
        return db.prepare(`SELECT game_bans FROM users WHERE igid='${userId}'`).pluck().get() || 0
    }

    /*
     * Set Methods
     */
    static async addPoints(userId, location, username, reason) {
        if (location == 'GAME') {
            let userData = db.prepare(`SELECT * FROM users WHERE igid='${userId}'`).pluck().get()
            if (!userData) {
                db.prepare(`INSERT INTO users VALUES('unknown', 'unknown', '${username}', '${userId}', 0, 0, 0, 0, 0, 0, 0, 0, 0)`).run()
            }
        }
        else {
            let userData = db.prepare(`SELECT * FROM users WHERE id='${userId}'`).pluck().get()
            if (!userData) {
                db.prepare(`INSERT INTO users VALUES(${userId}, '${username}', 'unknown', 'unknown', 0, 0, 0, 0, 0, 0, 0, 0, 0)`).run()
            }

            let userPoints = await this.getPoints(userId)
            let newPoints = await this.getReasonValue(reason)
    
            db.prepare(`UPDATE users SET points = ${userPoints + newPoints} WHERE id = '${userId}'`).run()
        }
    }

    static async addLog(messageId, location, username, userId, staff, staffId, reason, action="WARNING") {
        let config = require('../../structures/Settings').load()

        let date = new Date()
        let day = date.toDateString()
        let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()
        let hours = (date.getHours() < 10 ? "0" : "") + date.getHours()
        let time = `${hours}:${minutes}`
        let datetime = `${day} @ ${time} (${config.timezone})`

        await this.addPoints(userId, location, username, reason)

        if (location == 'DISCORD'){
            action = await this.calculateAction(await this.getPoints(userId), await this.getWarnings(userId), await this.getKicks(userId), await this.getBans(userId))
        }

        let userLogNum = await this.getTotalUserLogAmount(userId) + 1
        let logId = await this.generateLogId() + 1
        if (action == 'WARNING' || action == 'WARNING_PERM_NEXT') { 
            db.prepare(`UPDATE users SET game_warnings = ${await this.getUsergameWarnings(userId) + 1} WHERE igid = '${userId}'`).run()
            db.prepare(`INSERT INTO warnings VALUES('${location}', ${userId}, '${username}', '${datetime}')`).run()
        }
        if (action == 'KICK') { 
            db.prepare(`UPDATE users SET game_kicks = ${await this.getUserGameKicks(userId) + 1} WHERE igid = '${userId}'`).run()
            db.prepare(`INSERT INTO kicks VALUES('${location}', ${userId}, '${username}', '${datetime}')`).run()
        }
        if (action == 'BAN') { 
            db.prepare(`UPDATE users SET game_bans = ${await this.getUserGameBans(userId) + 1} WHERE igid = '${userId}'`).run()
            db.prepare(`INSERT INTO bans VALUES('${location}', ${userId}, '${username}', '${datetime}')`).run()
        }
        if (action == 'PERM_BAN') { 
            db.prepare(`UPDATE users SET game_bans = ${await this.getUserGameBans(userId) + 1} WHERE igid = '${userId}'`).run()
            db.prepare(`INSERT INTO perm_bans VALUES('${location}', ${userId}, '${username}', '${datetime}')`).run()
        }
        
        db.prepare(`INSERT INTO logs VALUES(${logId}, '${location}', '${datetime}', '${username}', '${userId}', '${staff}', '${staffId}', '${reason}', '${messageId}', '${action}', ${userLogNum})`).run()
        db.prepare(`UPDATE users SET logs = ${userLogNum}`).run()

        return action
    }

    static async addEvidence(logId, location, evidenceURL) {
        let config = require('../../structures/Settings').load()
        let date = new Date()
        let day = date.toDateString()
        let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()
        let hours = (date.getHours() < 10 ? "0" : "") + date.getHours()
        let time = `${hours}:${minutes}`
        let datetime = `${day} @ ${time} (${config.timezone})`

        let user = await this.getUserId(logId)
        let userLogNum = await this.getTotalUserLogAmount(user)
        let reason = await this.getReason(logId)

        db.prepare(`INSERT INTO evidence(id, location, user_log_num, reason, time, evidence_url, user) VALUES(${logId}, '${location}', ${userLogNum}, '${reason}', '${datetime}', '${evidenceURL}', '${user}')`).run()
    }

    static async addComment(logId, staffUsername, staffId, comment) {
        let config = require('../../structures/Settings').load()
        let date = new Date()
        let day = date.toDateString()
        let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()
        let hours = (date.getHours() < 10 ? "0" : "") + date.getHours()
        let time = `${hours}:${minutes}`
        let datetime = `${day} @ ${time} (${config.timezone})`
        db.prepare(`INSERT INTO comments(log_id, time, staff, staff_id, content) VALUES(${logId}, '${datetime}', '${staffUsername}', '${staffId}', '${comment}')`).run()
    }

    static async calculateAction(points, warnings, kicks, bans) {
        /*
         ! BEWARE: Spaghetti Code ahead!
         * Possible scenarios
         * 
         * <6 points, 0 warn, 0 kicks, 0 bans -> warning
         * >6 points, 0 warn, 0 kicks, 0 bans -> kick
         * <6 points, 1 warn, 0 kicks, 0 bans -> warning
         * >6 points, 1 warn, 0 kicks, 0 bans -> kick
         * X points, 2 warn, 0 kicks, 0 bans -> kick
         * 
         * <10 points, 2 warn, 1 kicks, 0 bans -> warning
         * >10 points, 2 warn, 1 kicks, 0 bans -> ban
         * <10 points, 3 warn, 1 kicks, 0 bans -> warning
         * >10 points, 3 warn, 1 kicks, 0 bans -> ban
         * X points, 4 warn, 1 kicks, 0 bans -> ban
         * 
         * assumingly appealed
         * 
         * <16 points, 4 warn, 1 kicks, 1 bans -> warning
         * >16 points, 4 warn, 1 kicks, 1 bans -> kick
         * <16 points, 5 warn, 1 kicks, 1 bans -> warning
         * >16 points, 5 warn, 1 kicks, 1 bans -> kick
         * X points, 6 warn, 1 kicks, 1 bans -> kick
         * 
         * <22 points, 6 warn, 2 kicks, 1 bans -> warning
         * >22 points, 6 warn, 2 kicks, 1 bans -> ban
         * <22 points, 7 warn, 2 kicks, 1 bans -> warning
         * >22 points, 7 warn, 2 kicks, 1 bans -> ban
         * X points, 8 warn, 2 kicks, 1 bans -> ban
         * 
         * assumingly appealed
         * 
         * <28 points, 8 warn, 2 kicks, 2 bans -> warning
         * >28 points, 8 warn, 2 kicks, 2 bans -> kick
         * <28 points, 9 warn, 2 kicks, 2 bans -> warning
         * >28 points, 9 warn, 2 kicks, 2 bans -> kick
         * X points, 10 warn, 2 kicks, 2 bans -> kick
         * 
         * <34 points, 10 warn, 3 kicks, 2 bans -> warning
         * >34 points, 10 warn, 3 kicks, 2 bans -> perm ban
         * <34 points, 11 warn, 3 kicks, 2 bans -> warning
         * >34 points, 11 warn, 3 kicks, 2 bans -> perm ban
         * X points, 12 warn, 3 kicks, 2 bans -> perm ban
         * 
         * It should be easier to read if we had each possibility as it's own if statement.
        */

        let config = require('../../structures/Settings').load()

        // User's violation is severe, perm ban.
        if (points >= 999) return 'PERM_BAN'

        // First kick
        if (points < config.lowKick1Points && warnings < 2) return 'WARNING'
        if ((points > config.lowKick1Points && points < config.lowBan1Points) || (warnings == 2 && kicks == 0 && bans == 0)) return 'KICK'

        // First ban
        if (points < config.lowBan1Points && warnings < 3) return 'WARNING'
        if ((points > config.lowBan1Points && points < config.lowKick2Points) || (warnings == 3 && kicks == 1 && bans == 0)) return 'BAN'

        // Second kick
        if (points < config.lowKick2Points && warnings < 5) return 'WARNING'
        if ((points > config.lowKick2Points && points < config.lowBan2Points) || (warnings == 5 && kicks == 1 && bans == 1)) return 'KICK'

        // Second ban
        if (points < config.lowBan2Points && warnings < 7) return 'WARNING'
        if ((points > config.lowBan2Points && points < config.lowKick3Points) || (warnings == 7 && kicks == 2 && bans == 1)) return 'BAN'

        // Third kick
        if (points < config.lowKick3Points && warnings < 9) return 'WARNING'
        if ((points > config.lowKick3Points && points < config.lowPermPoints) || (warnings == 9 && kicks == 2 && bans == 2)) return 'KICK'

        // Perm ban
        if (points < config.lowPermPoints && warnings < 11) return 'WARNING_PERM_NEXT'
        if ((points >= config.lowPermPoints) || (warnings == 11 && kicks == 3 && bans == 2)) return 'PERM_BAN'

    }
}