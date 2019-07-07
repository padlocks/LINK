var { Command } = require('discord.js-commando')
var { RichEmbed } = require('discord.js')
var config = require('../../config')
var Moderation = require('../../structures/Moderation')

module.exports = class StatusCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'status',
            aliases: ['status'],
            group: 'moderation',
            memberName: 'status',
            description: 'Check user logs.',
            guildOnly: true,

            args: [
                {
                    key: 'member',
                    prompt: 'Who\'s moderation history would you like to see?\n',
                    type: 'member'
                }
            ]
        })
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.hasPermission('MANAGE_MESSAGES')
    }

    async run(msg, { member }) {
        if (!member) {
            member = msg.author
        }

        let embed = new RichEmbed()
        var warningLevel = 0
        var reason = 'No reason given. Ask the staff member who warned this user.'
        var warningExpiry = 0
        var warningExpireDate = 'No set date.'
        var removedRole = 'No.'

        var exists = await Moderation.checkIfWarningExists(member.id)

        if (!exists) {
            if (member.roles.get(config.warnings['1'])) {
                member.removeRole(config.warnings['1'], 'Expired Warning 1. (Status CMD Removal)')
                removedRole = 'Yes.'
            }
            if (member.roles.get(config.warnings['2'])) {
                member.removeRole(config.warnings['2'], 'Expired Warning 2. (Status CMD Removal)')
                removedRole = 'Yes.'
            }
            if (member.roles.get(config.warnings['3'])) {
                member.removeRole(config.warnings['3'], 'Expired Warning 3. (Status CMD Removal)')
                removedRole = 'Yes.'
            }
        } else {
            warningLevel = await Moderation.getWarningLevel(member.id)
            reason = await Moderation.getWarningReason(member.id)
            warningExpiry = await Moderation.getWarningExpiry(member.id)
            var dateOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }
            warningExpireDate = new Date(parseInt(warningExpiry)).toLocaleTimeString('en-us', dateOptions)
        }

        embed.setTitle(`Moderation Status for ${member.user.username}`)
        embed.setColor('RANDOM')
        embed.addField('Warning Level', `Warning ${warningLevel}`)
        embed.addField('Warning Expires', warningExpireDate)
        embed.addField('Reason Given', reason)
        embed.addField('Removed Warning Role', removedRole)
        embed.setTimestamp()

        return msg.channel.send(embed)
    }
}
