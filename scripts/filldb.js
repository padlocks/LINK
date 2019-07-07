var sqlite = require('sqlite3')
var db = new sqlite.Database('tc.db')

var reasons = [
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
    { reason: "od", value: 2 },
    { reason: "advertising", value: 2 },
    { reason: "nsfw", value: 3 },
    { reason: "graphic", value: 4 },
    { reason: "vulgar", value: 4 },
    { reason: "hatespeech", value: 4 },
    { reason: "slurs", value: 4 },
    { reason: "illegal", value: 4 },
    { reason: "alt", value: 999 },
    { reason: "raid", value: 999 },

    // Voice Channel Specific
    { reason: "vcspam", value: 1 },
    { reason: "vcnsfw", value: 3 },

    // Direct Messages
    { reason: "dmadvertising", value: 2 },
    { reason: "dmrude", value: 3 },
    { reason: "dmhatespeech", value: 5 },
]

reasons.forEach(item => {
    db.run(`INSERT INTO reasons VALUES(?,?)`, [item.reason, item.value])
})

db.close()

console.log('Database Filled!')