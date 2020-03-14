var { FriendlyError, CommandoClient } = require('discord.js-commando')
var { MessageEmbed } = require('discord.js')
var { oneLine } = require('common-tags')
var path = require('path')
var Logger = require('./utils/Logger.js')
var config = require('./structures/Settings').load()

var client = new CommandoClient({
    owner: config.dev,
    commandPrefix: config.bot_prefix,
    unknownCommandResponse: false,
    disableEveryone: true
})

client.on('error', Logger.error)
    .on('ready', () => {
        Logger.info(`[DISCORD]: client ready\nuser info: ${client.user.tag} id:${client.user.id}`)
        client.user.setActivity('with commands.')

        let c = require('./structures/Settings').load()
        if (c.toggles.startupMessage) {
            let embed = new MessageEmbed
            embed.setTitle('True Colors Bot is Online')
            embed.setColor('#00FF00')
            embed.addField('Current Version', `${config.version}`)
            if (config.experiments) embed.setDescription('Experimental features are **ENABLED**')
            embed.addField('Latest Changes', `${config.patch_notes}`)
            embed.setFooter('Created by atom#0001 for the True Colors Administration')
            client.channels.cache.get(config.startup_channel).send(embed)
        }
    })
    .on('disconnect', () => Logger.info('[DISCORD]: client disconnect'))
    .on('commandRun', (cmd, promise, msg, args) => {
        Logger.info(oneLine`
        [COMMAND]: ${msg.author.tag} (${msg.author.id})
        > ${cmd.groupID}:${cmd.memberName}
        ${Object.values(args).length ? `>> ${Object.values(args)}` : ''}
        `)

        // audit
        let c = require('./structures/Settings').load()
        if (c.toggles.notify) {
            let embed = new MessageEmbed()
            embed.setTitle('Command Ran')
            embed.setColor('RANDOM')
            embed.addField('User', `${msg.author.tag} (${msg.author.id})`)
            embed.addField('Command', `${cmd.memberName.toUpperCase()}`)
            embed.addField('Arguments', `${Object.values(args).length ? `>> ${Object.values(args)}` : '' || '<none>'}`)
            embed.setThumbnail(msg.author.displayAvatarURL({dynamic: true}))

            client.channels.cache.get(c.toggles.nChannel).send(embed)
        }
    })
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
      // audit
      let c = require('./structures/Settings').load()
      if (c.toggles.notify) {
          let embed = new MessageEmbed()
          embed.setTitle('Command Blocked')
          embed.setColor('RANDOM')
          embed.addField('User', `${msg.author.tag} (${msg.author.id})`)
          embed.addField('Command', `${msg.command.memberName.toUpperCase()}`)
          embed.addField('Reason', `${reason}`)
          embed.setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))

          client.channels.cache.get(c.toggles.nChannel).send(embed)
      }
    })

client.on('warn', Logger.warn)
    .on('shardReconnecting', () => Logger.warn('[DISCORD]: client reconnecting..'))

client.registry
    .registerGroups([
        ['general', 'General'],
        ['dev', 'Developer'],
        ['moderation', 'Moderation']
    ])
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerTypesIn(path.join(__dirname, 'types'))
    .registerCommandsIn(path.join(__dirname, 'commands'))

client.login(config.token)
