/*
    * v2.0 filldb.js. Adds more static data, specifically staff members.

    * No breaking changes besides a new table.
*/

var sqlite = require('sqlite3')
var db = new sqlite.Database('tc2.db')

var reasons = [
    /*
        ? Reason entries:
        ? { reason: "", value: 0 },
    */

    // General
    { reason: "exploit", value: 999 },
    { reason: "iplogger", value: 999 },
    { reason: "hacking", value: 999 },
    { reason: "troll", value: 999 },
    { reason: "threat", value: 999 },

    // Chat
    { reason: "spam", value: 1 },
    { reason: "history", value: 1 },
    { reason: "arguing", value: 1 },
    { reason: "triggerjoke", value: 1 },
    { reason: "identityjoke", value: 1 },
    { reason: "impersonation", value: 2 },
    { reason: "rude", value: 2 },
    { reason: "harassment", value: 2 },
    { reason: "od", value: 2 },
    { reason: "advertising", value: 2 },
    { reason: "nsfw", value: 3 },
    { reason: "graphic", value: 4 },
    { reason: "vulgar", value: 4 },
    { reason: "hatespeech", value: 4 },
    { reason: "slurs", value: 4 },
    { reason: "illegal", value: 4 },
    { reason: "illegalacts", value: 999 },
    { reason: "alt", value: 999 },
    { reason: "raid", value: 999 },

    // Voice Channel Specific
    { reason: "vcspam", value: 1 },
    { reason: "vcnsfw", value: 3 },

    // Direct Messages
    { reason: "dmadvertising", value: 2 },
    { reason: "dmrude", value: 3 },
    { reason: "dmharassment", value: 3 },
    { reason: "dmhatespeech", value: 5 },
]

var staff = [
    /*
        ? Staff entries:
        ? { igid: "", name: "", ign: "", chat_id: "", username: "", role: "",
        ? warn_credit: 0, kick_credit: 0, ban_credit: 0 }
    */


    // Testing purposes, not all staff entries..
    { igid: "000", name: "Audrey", ign: "pascaling", chat_id: "276126275083436034", username: "atom#0001", role: "Head Discord Moderator",
    warn_credit: 100, kick_credit: 100, ban_credit: 100 }
]

reasons.forEach(item => {
    db.run(`INSERT INTO reasons VALUES(?,?)`, [item.reason, item.value])
})

staff.forEach(item => {
    db.run(`INSERT INTO staff VALUES(?,?,?,?,?,?,?,?,?)`, [item.igid, item.name, item.ign, item.chat_id, item.username, item.role, item.warn_credit, item.kick_credit, item.ban_credit ])
})

db.close()

console.log('DatabaseV2 Filled!')