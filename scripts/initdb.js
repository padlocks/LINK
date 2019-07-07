var sqlite = require('sqlite3')
var db = new sqlite.Database('tc.db')

db.run("CREATE TABLE reasons (reason TEXT, point_value INTEGER)")
db.run("CREATE TABLE logs (time TEXT, username TEXT, user_id TEXT, staff_username TEXT, staff_id TEXT, reason TEXT, log_message_id TEXT)")
db.run("CREATE TABLE evidence (id INTEGER, time TEXT, evidence_url TEXT)")
db.run("CREATE TABLE comments (id INTEGER, time TEXT, staff TEXT, staff_id TEXT, comment TEXT)")
db.run("CREATE TABLE users (id TEXT PRIMARY KEY, username TEXT, points INTEGER)")

db.close()

console.log('Database Initialized!')