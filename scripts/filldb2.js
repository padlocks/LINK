/*
    * v2.0 filldb.js. Adds more static data.

    * No breaking changes besides new tables.
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

// defaultSettings
var s = {
    experiments: 0,
    owner: '276126275083436034',
    prefix: '!',
    token: '',
    log_channel: '',
    startup_channel: '',
    rules_channel: '',
    default_tz: 'UTC',
    timezone: 'UTC/GMT',
    WEBKEY: '',
    POSTKEY: '',
    auto_moderate: 0,
    lowKick1Points: 6,
    lowBan1Points: 10,
    lowKick2Points: 16,
    lowBan2Points: 22,
    lowKick3Points: 28,
    lowPermPoints: 34,
    version: '0.4.0',
    rules: "**1.** Do not spam. Spam is considered repeatedly sending images, posting lengthy and irrelevant message, posting long strings of messages (i.e. song lyrics, emoji spam), spam pinging (@ing) people/ranks, etc.\n\n**2.** Do not advertise other servers or groups without permission. This includes direct messaging members of this server advertisements without their consent.\n\n**3.** Inappropriate language, topics, and actions are not allowed. this includes:\n→**A.** Slurs, deliberate attempts to revoke negative reactions, pornography/adult conent, gore, offensive/hateful content in regards to race, gender identity, sexuality, etc., and graphic topics such as major genocides and school shootings.\n→**B.** Please refrain from making insensitive jokes, i.e. trigger jokes, insulting people by calling them 'autistic', etc.\n\n**4.** Do not post harmful content such as viruses, the glorification of harmful acts (i.e. self-harm, suicide), threats of IP tracking/DDoSing/Doxing, and malicious/illegal material.\n\n**5.** Respect and common decency is expected at all times. Do not mock, harass, or bully other members; this includes intentionally making people uncomfortable.\n\n**6.** Please do not be intentionally obnoxious, particularly in the voice channels. This includes playing loud audio, screaming, mic spamming, etc.\n\n**7.** True Colors is not an online dating platform; do not utilize the server as a platform for dating and/or hookups.\n\n**8.** Do not publicly post about moderation history. If you have a problem regarding moderation, please contact a member of the staff team.\n\nFor ROBLOX-related rules and an in-depth version of the guidelines, click [here](https://docs.google.com/document/d/1g1uASD3n5IIXwgiFRta4mnz0XK0WvRb6bLPXK53AbBw/edit?usp=sharing).",
    patch_notes: '**0.4.0**:\n- Integrated dynamic settings. Settings may be changed without any system restarts.\n**0.3.0**:\n- Completed unification of gamedata and chatdata.\n'
}

db.run(`INSERT INTO settings VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [s.experiments, s.owner, s.prefix, s.token, s.log_channel, s.startup_channel, s.rules_channel, s.default_tz, s.timezone, s.WEBKEY, s.POSTKEY, s.auto_moderate, s.lowKick1Points, s.lowBan1Points, s.lowKick2Points, s.lowBan2Points, s.lowKick3Points, s.lowPermPoints, s.version, s.rules, s.patch_notes])

reasons.forEach(item => {
    db.run(`INSERT INTO reasons VALUES(?,?)`, [item.reason, item.value])
})

staff.forEach(item => {
    db.run(`INSERT INTO staff VALUES(?,?,?,?,?,?,?,?,?)`, [item.igid, item.name, item.ign, item.chat_id, item.username, item.role, item.warn_credit, item.kick_credit, item.ban_credit ])
})

db.close()

console.log('DatabaseV2 Filled!')