var { Command } = require('discord.js-commando')
var { RichEmbed } = require('discord.js')

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
        var config = require('../../structures/Settings').load()

        let embed = new RichEmbed
        embed.setColor('RANDOM')
        embed.addField('Current Version', `${config.version}`)
        if (config.experiments) embed.setDescription('Experimental features are **ENABLED**')
        embed.addField('Latest Changes', `${config.patch_notes}`)
        embed.setFooter(`Created by atom#0001 for the True Colors Administration`)
        return msg.channel.send(embed)
    }
}
