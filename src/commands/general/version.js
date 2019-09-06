var { Command } = require('discord.js-commando')
var { RichEmbed } = require('discord.js')
var config = require('../../config')

module.exports = class VersionCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'version',
            aliases: ['version', 'v'],
            group: 'general',
            memberName: 'version',
            description: 'Returns version number',
            guildOnly: false
        })
    }

    hasPermission(msg) {
        return msg.member.hasPermission('MANAGE_MESSAGES')
    }

    async run(msg) {
        let embed = new RichEmbed
        embed.setColor('RANDOM')
        embed.addField('Current Version', `${config.version}`)
        embed.setFooter(`Created by atom#0001 for the True Colors Administration`)
        return msg.channel.send(embed)
    }
}
