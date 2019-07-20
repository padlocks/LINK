var { Command } = require('discord.js-commando')
var { RichEmbed } = require('discord.js')

module.exports = class StatusCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'status',
            aliases: ['status'],
            group: 'moderation',
            memberName: 'status',
            description: 'Returns the moderation status of a user.',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },

            args: [
                {
                    key: 'member',
                    prompt: 'Who would you like to ban?\n',
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
            return msg.reply('invalid user!')
        }

        return msg.reply('incomplete')
    }
}
