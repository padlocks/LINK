// ping glitch every 5 min, keep bot alive
const http = require('http')
const express = require('express')
const app = express()
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received")
  response.sendStatus(200)
});
app.listen(process.env.PORT)
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`)
}, 280000)

var { FriendlyError, CommandoClient } = require('discord.js-commando')
var { RichEmbed } = require('discord.js')
var { oneLine } = require('common-tags')
var path = require('path')
var Logger = require('./utils/Logger.js')
var config = require('./config.json')

var client = new CommandoClient({
    owner: config.dev,
    commandPrefix: config.bot_prefix,
    unknownCommandResponse: false,
    disableEveryone: true
})

client.on('error', Logger.error)
    .on('ready', () => {
        Logger.info(`[DISCORD]: client ready\nuser info: ${client.user.tag} id:${client.user.id}`)
        client.user.setPresence({
            game: {
                name: 'with commands.'
            }
        })
        
        let embed = new RichEmbed
        embed.setTitle('True Colors Auto-Moderation is Online')
        embed.setColor('#00FF00')
        embed.addField('Current Version', `${config.version}`)
        embed.addField('Latest Changes', `${config.update_text}`)
        embed.setFooter('Created by atom#0001 for the True Colors Administration')
        client.channels.get(config.startup_channel).send(embed)
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

client.login(config.token)
