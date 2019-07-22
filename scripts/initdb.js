var sqlite = require('sqlite3')
var db = new sqlite.Database('tc.db')

db.run("CREATE TABLE reasons (reason TEXT, point_value INTEGER)")
db.run("CREATE TABLE logs (id INTEGER, time TEXT, username TEXT, user_id TEXT, staff_username TEXT, staff_id TEXT, reason TEXT, log_message_id TEXT, action TEXT, user_log_num)")
db.run("CREATE TABLE evidence (id INTEGER, time TEXT, evidence_url TEXT)")
db.run("CREATE TABLE comments (log_id INTEGER, time TEXT, staff TEXT, staff_id TEXT, content TEXT)")
db.run("CREATE TABLE users (id TEXT PRIMARY KEY, username TEXT, logs INTEGER, points INTEGER, warnings INTEGER, kicks INTEGER, bans INTEGER)")
db.run("CREATE TABLE appeals (user_id TEXT, username TEXT, content TEXT)")
db.run("CREATE TABLE warnings (user_id TEXT, username TEXT, time TEXT)")
db.run("CREATE TABLE kicks (user_id TEXT, username TEXT, time TEXT)")
db.run("CREATE TABLE bans (user_id TEXT, username TEXT, time TEXT)")
db.run("CREATE TABLE perm_bans (user_id TEXT, username TEXT, time TEXT)")

db.close()

console.log('Database Initialized!')