// TODO: BEFORE PRODUCTION, either convert db to PostgreSQL and keep the data under 10k rows, or find a way to back up tc.db.

var { FriendlyError, CommandoClient } = require('discord.js-commando')
var { oneLine } = require('common-tags')
var path = require('path')
var Logger = require('./utils/Logger.js')
var config = require('./config.json')
var token = config.token

var client = new CommandoClient({
    owner: config.dev,
    commandPrefix: config.bot_prefix,
    unknownCommandResponse: false,
    disableEveryone: true
})

client.on('error', Logger.error)
    .on('ready', () => {
        Logger.info(`[DISCORD]: client ready\nuser info: ${client.user.tag} id:${client.user.id}`)
    })
    .on('disconnect', () => Logger.info('[DISCORD]: client disconnect'))
    .on('commandRun', (cmd, promise, msg, args) =>
        Logger.info(oneLine`
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
        Logger.error(`[COMMAND]: command error > ${cmd.groupID}:${cmd.memberName}`, err)
    })
    .on('commandBlocked', (msg, reason) => {
        Logger.info(oneLine`
            [COMMAND]: command blocked
            > ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
            User ${msg.author.tag} (${msg.author.id}): ${reason}
      `)
    })

client.on('warn', Logger.warn)
    .on('reconnect', () => Logger.warn('[DISCORD]: client reconnecting..'))

client.registry
    .registerGroups([
        ['general', 'General'],
        ['dev', 'Developer'],
        ['moderation', 'Moderation']
    ])
    .registerDefaults()
    .registerTypesIn(path.join(__dirname, 'types'))
    .registerCommandsIn(path.join(__dirname, 'commands'))

client.login(token)
