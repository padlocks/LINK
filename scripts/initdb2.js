/*
    * v2.0 of initdb.js. Revises data structures with the main migration to unified user information.
    *                    Less focus on 'automatic' action, as it is smaller of a priority.
    * ~ 12/22/2019

    ? List of changes:
    ! - logs: added location text field. either discord or game.
    ! - evidence: added location text field. either discord or game.

    ! - users: added ign, igid and gban_status text fields.
    !          renamed warnings, kicks, bans  text fields to chat_warnings, chat_kicks, chat_bans.
    !          added game_warnings, game_kicks, game_bans integer fields

    ! - appeals: added status and location text field. 
        ? Incomplete feature at time of update.

    ! - warnings: added location text field.
    ! - kicks: added location text field.
    ! - bans: added location text field.
    ! - perm_bans: added location text field.

    * Created staff table to connect game and chat staff identification.
        ? This will be fully implemented later on along with appeals and updates to commenting and such.
        ? Similar to registering chat and game identity connections for regular users, it is important to do the same for staff.

*/

var sqlite = require('sqlite3')
var db = new sqlite.Database('tc2.db') // tc2.db

db.run(`CREATE TABLE reasons (
    reason TEXT, 
    point_value INTEGER
    )`)

db.run(`CREATE TABLE logs (
    id INTEGER, 
    location TEXT, 
    time TEXT, 
    username TEXT, 
    user_id TEXT, 
    staff_username TEXT, 
    staff_id TEXT, 
    reason TEXT, 
    log_message_id TEXT, 
    action TEXT, 
    user_log_num INTEGER
    )`)

db.run(`CREATE TABLE evidence (
    id INTEGER, 
    location TEXT, 
    user_log_num INTEGER, 
    reason TEXT, 
    time TEXT,
    evidence_url TEXT,
    user TEXT
     )`)

db.run(`CREATE TABLE comments (
    log_id INTEGER, 
    time TEXT, 
    staff TEXT, 
    staff_id TEXT, 
    content TEXT
    )`)

db.run(`CREATE TABLE users (
    id TEXT, 
    username TEXT, 
    ign TEXT, 
    igid TEXT, 
    logs INTEGER, 
    points INTEGER, 
    chat_warnings INTEGER, 
    chat_kicks INTEGER, 
    chat_bans INTEGER, 
    game_warnings INTEGER, 
    game_kicks INTEGER, 
    game_bans INTEGER, 
    gban_status TEXT
    )`)

db.run(`CREATE TABLE appeals (
    location TEXT, 
    user_id TEXT, 
    username TEXT, 
    content TEXT, 
    status TEXT
    )`)

db.run(`CREATE TABLE warnings (location TEXT, 
    user_id TEXT, 
    username TEXT, 
    time TEXT
    )`)

db.run(`CREATE TABLE kicks (
    location TEXT, 
    user_id TEXT, 
    username TEXT, 
    time TEXT
    )`)

db.run(`CREATE TABLE bans (
    location TEXT, 
    user_id TEXT, 
    username TEXT, 
    time TEXT
    )`)

db.run(`CREATE TABLE perm_bans (
    location TEXT, 
    user_id TEXT, 
    username TEXT, 
    time TEXT
    )`)

db.run(`CREATE TABLE staff (
    igid TEXT PRIMARY KEY, 
    name TEXT, 
    ign TEXT, 
    chat_id TEXT, 
    username TEXT, 
    role TEXT, 
    warn_credit INTEGER, 
    kick_credit INTEGER, 
    ban_credit INTEGER
    )`)

db.close()

console.log('DatabaseV2 Initialized!')