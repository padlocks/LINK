var Database = require('better-sqlite3')
var db = new Database('tc.db', { fileMustExist: true })

class Moderation {
    static async getIncompleteLogId() {
        db.aggregate('max', {
            start: 0,
            step: (total, nextValue) => {
                if (nextValue > total) {
                    let max = nextValue
                    return max
                }
            }
        })

        let logData = db.prepare(`SELECT max(rowid) FROM logs`).pluck().get()
        return logData || 0
    }

    static async getPoints(userId) {
        let userData = db.prepare(`SELECT points FROM users WHERE id='${userId}'`).pluck().get()
        return userData || 0
    }

    static async getReason(logId) {
        let reasonData = db.prepare(`SELECT reason FROM logs WHERE rowid='${logId}'`).pluck().get()
        return reasonData
    }

    static async getReasonValue(reason) {
        let reasonData = db.prepare(`SELECT point_value FROM reasons WHERE reason='${reason}'`).pluck().get()
        return reasonData
    }

    static async getLogTime(logId) {
        let logData = db.prepare(`SELECT time FROM logs WHERE rowid=${logId}`).pluck().get()
        return logData
    }

    static async getMessageId(logId) {
        let logData = db.prepare(`SELECT log_message_id FROM logs WHERE rowid=${logId}`).pluck().get()
        return logData
    }

    static async getStaffResponsible(logId) {
        let username = db.prepare(`SELECT staff_username FROM logs WHERE rowid=${logId}`).pluck().get()
        let id = db.prepare(`SELECT staff_id FROM logs WHERE rowid=${logId}`).pluck().get()

        let staff = `${username} (${id})`
        return staff
    }

    static async getUser(logId) {
        let username = db.prepare(`SELECT username FROM logs WHERE rowid=${logId}`).pluck().get()
        let id = db.prepare(`SELECT user_id FROM logs WHERE rowid=${logId}`).pluck().get()

        let user = `${username} (${id})`
        return user
    }

    static async getEvidenceString(logId) {
        let evidenceString = ''
        let data = db.prepare(`SELECT evidence_url FROM evidence WHERE id=${logId}`).all()
        data.forEach((elem) => {
            evidenceString = evidenceString + `<${elem['evidence_url']}>` + '\n'
        })
        return evidenceString
    }


    static async addPoints(userId, username, reason) {
        let userData = db.prepare(`SELECT * FROM users WHERE id='${userId}'`).pluck().get()
        if (!userData) {
            db.prepare(`INSERT INTO users VALUES(${userId}, '${username}', 0)`).run()
        }

        let userPoints = await this.getPoints(userId)
        let newPoints = await this.getReasonValue(reason)

        db.prepare(`UPDATE users SET points = ${userPoints + newPoints} WHERE id = '${userId}'`).run()
    }

    static async addLog(messageId, username, userId, staff, staffId, reason) {
        let date = new Date()
        let day = date.toDateString()
        let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()
        let hours = (date.getHours() < 10 ? "0" : "") + date.getHours()
        let time = `${hours}:${minutes}`
        let datetime = `${day} @ ${time} (PST)`

        db.prepare(`INSERT INTO logs VALUES('${datetime}', '${username}', '${userId}', '${staff}', '${staffId}', '${reason}', '${messageId}')`).run()
        await this.addPoints(userId, username, reason)
    }

    static async addEvidence(logId, evidenceURL) {
        let date = new Date()
        let day = date.toDateString()
        let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()
        let hours = (date.getHours() < 10 ? "0" : "") + date.getHours()
        let time = `${hours}:${minutes}`
        let datetime = `${day} @ ${time} (PST)`

        db.prepare(`INSERT INTO evidence(id, time, evidence_url) VALUES(${logId}, '${datetime}', '${evidenceURL}')`).run()
    }

    static async addComment(logId, staffUsername, staffId, comment) {
        let date = new Date()
        let day = date.toDateString()
        let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()
        let hours = (date.getHours() < 10 ? "0" : "") + date.getHours()
        let time = `${hours}:${minutes}`
        let datetime = `${day} @ ${time} (PST)`
        db.prepare(`INSERT INTO comments(id, time, staff, staff_id, comment) VALUES(${logId}, '${datetime}', '${staffUsername}', '${staffId}', '${comment}')`).run()
    }
}

module.exports = Moderation
