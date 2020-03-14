var { Command } = require('discord.js-commando')
var { stripIndents } = require('common-tags')
var { MessageEmbed } = require('discord.js')

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: ['help', 'commands', 'cmds'],
            group: 'general',
            memberName: 'help',
            description: 'Responds with list of commands',
            guildOnly: false
        })
    }

    hasPermission(msg) {
        return msg.member.hasPermission('MANAGE_MESSAGES')
    }

    async run(msg) {
        var config = require('../../structures/Settings').load()

        if (!config.toggles.helpCmd) {
            let embed = new MessageEmbed()
            embed.setTitle('Command Disabled!')
            embed.setColor('RANDOM')
            embed.addField('Error', 'Command is disabled. Please contact the developer for support.')
            
            return msg.channel.send(embed)
        } 

        let embed = new MessageEmbed
        embed.setColor('RANDOM')
        embed.setAuthor('Command List')
        embed.setFooter(`Created by atom#0001 for the True Colors Administration`)

        embed.setDescription(stripIndents`
        **add**: Attaches evidence to a log.
        Usage: !add <logId> <attachment>

        **comment**: Adds a staff comment to a log.
        Usage: !comment <logId> <message>

        **convert**: Converts UTC time to any timezone.
        Usage: !convert <time> <desired timezone>

        **details**: Lists all comments left on a user log.
        Usage: !details <logId>

        **evidence**: Lists all evidence ever uploaded to user logs.
        Usage: !evidence <user>

        **help**: Displays this message; lists all available commands.
        Usage: !help

        **logevidence**: Lists all evidence uploaded on a specific log.
        Usage: !logevidence <logId>

        **logs**: Lists all logs of a specific user.
        Usage: !logs <user>

        **warn**: Warns a user and automatically generates a log.
        Usage: !warn <user> <reason>
        `)

        return msg.channel.send(embed)
    }
}
