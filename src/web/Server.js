/*
 * Server.js
 * Simple API webserver. Requires a key for any "protected" requests.
*/

let express = require('express')
let app = express()
let Database = require('better-sqlite3')
let config = require('../config.json')
let db = new Database(config.dbFile, { fileMustExist: true })
let bodyParser = require('body-parser')
let GameAPI = require('../structures/Game')
require('dotenv').config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/post/comments', async (req, res) => {
    if (process.env.POSTKEY == req.body.key) {
        if (!req.body.logId || !req.body.staff || !req.body.suid, !req.body.msg) {
            // No data to add to database.
            return res.end(JSON.stringify({error: "Data is missing from your POST request's body. Make sure the following fields are set: logId, staff, suid, msg", success: false}))
        }
        let obj = {
            logId: req.body.logId,
            msg: req.body.msg,
            staff: req.body.staff,
            staffId: req.body.suid
        }
        await GameAPI.addComment(req.body.logId, req.body.staff, req.body.suid, req.body.msg)
        .then(res.end(JSON.stringify({success: true, data: obj})))
        .catch(err => {
            res.end(JSON.stringify({error: err, success: false}))
        })
    } 
    else if (process.env.WEBKEY == req.body.key) {
        res.end(JSON.stringify({error: "It seems you have GET access, however this is a POST request route. Permission rejected.", success: false}))
    }
    else {
        res.end(JSON.stringify({error: "This route is protected. Permission rejected.", success: false}))
    }
})

app.post('/post/evidence', async (req, res) => {
    if (process.env.POSTKEY == req.body.key) {
        if (!req.body.logId || !req.body.url) {
            // No data to add to database.
            return res.end(JSON.stringify({error: "Data is missing from your POST request's body. Make sure the following fields are set: logId, url", success: false}))
        }
        let obj = {
            logId: req.body.logId,
            location: 'GAME',
            evidenceURL: req.body.url
        }
        await GameAPI.addEvidence(req.body.logId, 'GAME', req.body.url)
        .then(res.end(JSON.stringify({success: true, data: obj})))
        .catch(err => {
            res.end(JSON.stringify({error: err, success: false}))
        })
    } 
    else if (process.env.WEBKEY == req.body.key) {
        res.end(JSON.stringify({error: "It seems you have GET access, however this is a POST request route. Permission rejected.", success: false}))
    }
    else {
        res.end(JSON.stringify({error: "This route is protected. Permission rejected.", success: false}))
    }
})

app.post('/post/logs', async (req, res) => {
    if (process.env.POSTKEY == req.body.key) {
        if (!req.body.username || !req.body.guid || !req.body.staff || !req.body.suid || !req.body.action || !req.body.reason) {
            // No data to add to database.
            return res.end(JSON.stringify({error: "Data is missing from your POST request's body. Make sure the following fields are set: username, guid, staff, suid, action, reason", success: false}))
        }
        let obj = {
            messageId: 'N/A',
            location: 'GAME',
            username: req.body.username,
            userId: req.body.guid,
            staff: req.body.staff,
            staffId: req.body.suid,
            action: req.body.action,
            reason: req.body.reason
        }
        await GameAPI.addLog('N/A', 'GAME', req.body.username, req.body.guid, req.body.staff, req.body.suid, req.body.reason, req.body.action)
        .then(res.end(JSON.stringify({success: true, data: obj})))
        .catch(err => {
            res.end(JSON.stringify({error: err, success: false}))
        })
    } 
    else if (process.env.WEBKEY == req.body.key) {
        res.end(JSON.stringify({error: "It seems you have GET access, however this is a POST request route. Permission rejected.", success: false}))
    }
    else {
        res.end(JSON.stringify({error: "This route is protected. Permission rejected.", success: false}))
    }
})

app.get('/appeals', (req, res) => {
    if (process.env.WEBKEY == req.body.key) {
        let obj = db.prepare(`SELECT * FROM appeals`).all()
        res.end(JSON.stringify(obj))
    }
    else {
        res.end(JSON.stringify({error: "This route is protected. Permission rejected."}))
    }
})

app.get('/bans', (req, res) => {
    if (process.env.WEBKEY == req.body.key) {
        let obj = db.prepare(`SELECT * FROM bans`).all()
        res.end(JSON.stringify(obj))
    }
    else {
        res.end(JSON.stringify({error: "This route is protected. Permission rejected."}))
    }
})

app.get('/comments', (req, res) => {
    if (process.env.WEBKEY == req.body.key) {
        let obj = db.prepare(`SELECT * FROM comments`).all()
        res.end(JSON.stringify(obj))
    }
    else {
        res.end(JSON.stringify({error: "This route is protected. Permission rejected."}))
    }
})

app.get('/evidence', (req, res) => {
    if (process.env.WEBKEY == req.body.key) {
        let obj = db.prepare(`SELECT * FROM evidence`).all()
        res.end(JSON.stringify(obj))
    }
    else {
        res.end(JSON.stringify({error: "This route is protected. Permission rejected."}))
    }
})

app.get('/kicks', (req, res) => {
    if (process.env.WEBKEY == req.body.key) {
        let obj = db.prepare(`SELECT * FROM kicks`).all()
        res.end(JSON.stringify(obj))
    }
    else {
        res.end(JSON.stringify({error: "This route is protected. Permission rejected."}))
    }
})

app.get('/logs', (req, res) => {
    if (process.env.WEBKEY == req.body.key) {
        let obj = db.prepare(`SELECT * FROM logs`).all()
        res.end(JSON.stringify(obj))
    }
    else {
        res.end(JSON.stringify({error: "This route is protected. Permission rejected."}))
    }
})

app.get('/permBans', (req, res) => {
    if (process.env.WEBKEY == req.body.key) {
        let obj = db.prepare(`SELECT * FROM perm_bans`).all()
        res.end(JSON.stringify(obj))
    }
    else {
        res.end(JSON.stringify({error: "This route is protected. Permission rejected."}))
    }
})

app.get('/reasons', (req, res) => {
    if (process.env.WEBKEY == req.body.key) {
        let obj = db.prepare(`SELECT * FROM reasons`).all()
        res.end(JSON.stringify(obj))
    }
    else {
        res.end(JSON.stringify({error: "This route is protected. Permission rejected."}))
    }
})

app.get('/staff', (req, res) => {
    if (process.env.WEBKEY == req.body.key) {
        let obj = db.prepare(`SELECT * FROM staff`).all()
        res.end(JSON.stringify(obj))
    }
    else {
        res.end(JSON.stringify({error: "This route is protected. Permission rejected."}))
    }
})

app.get('/users', (req, res) => {
    if (process.env.WEBKEY == req.body.key) {
        let obj = db.prepare(`SELECT * FROM users`).all()
        res.end(JSON.stringify(obj))
    }
    else {
        res.end(JSON.stringify({error: "This route is protected. Permission rejected."}))
    }
})

app.get('/warnings', (req, res) => {
    if (process.env.WEBKEY == req.body.key) {
        let obj = db.prepare(`SELECT * FROM warnings`).all()
        res.end(JSON.stringify(obj))
    }
    else {
        res.end(JSON.stringify({error: "This route is protected. Permission rejected."}))
    }
})

let server = app.listen(5000, function () {
    let host = "127.0.0.1"
    let port = server.address().port

    console.log(`Webserver listening at http://${host}:${port}`)
})