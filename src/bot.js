var { FriendlyError, CommandoClient } = require('discord.js-commando')
var { oneLine } = require('common-tags')
var path = require('path')
var winston = require('winston')

var Moderation = require('./structures/Moderation')
var config = require('./config.json')

var date = new Date()
var year = date.getYear()
var month = date.getMonth()
var day = date.getDate()
var hour = date.getHours()
var minute = date.getMinutes()
var second = date.getSeconds()
winston.add(winston.transports.File, { filename: `${__dirname}/logs/log-${year + month + day + hour + minute + second}.log` })

var token = config.token

var client = new CommandoClient({
    owner: config.dev,
    commandPrefix: config.bot_prefix,
    unknownCommandResponse: false,
    disableEveryone: true
})

client.on('error', winston.error)
    .on('ready', () => {
        winston.info(`[DISCORD]: client ready\nuser info: ${client.user.tag} id:${client.user.id}`)
    })
    .on('disconnect', () => winston.info('[DISCORD]: client disconnect'))
    .on('commandRun', (cmd, promise, msg, args) =>
        winston.info(oneLine`
        [COMMAND]: ${msg.author.tag} (${msg.author.id})
        > ${cmd.groupID}:${cmd.memberName}
        ${Object.values(args).length ? `>> ${Object.values(args)}` : ''}
        `)
    )
    .on('message', async message => {
        if (message.channel.type === 'dm') return
        if (message.author.bot) return
    })
    .on('commandError', (cmd, err) => {
        if (err instanceof FriendlyError) return
        winston.error(`[COMMAND]: command error > ${cmd.groupID}:${cmd.memberName}`, err)
    })
    .on('commandBlocked', (msg, reason) => {
        winston.info(oneLine`
            [COMMAND]: command blocked
            > ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
            User ${msg.author.tag} (${msg.author.id}): ${reason}
      `)
    })

client.on('warn', winston.warn)
    .on('reconnect', () => winston.warn('[DISCORD]: client reconnecting..'))

client.registry
    .registerGroups([
        //['general', 'General'],
        ['dev', 'Developer'],
        ['moderation', 'Moderation']
    ])
    .registerDefaults()
    .registerTypesIn(path.join(__dirname, 'types'))
    .registerCommandsIn(path.join(__dirname, 'commands'))

client.login(token)
