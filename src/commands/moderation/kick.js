var { Command } = require('discord.js-commando')
var config = require('../../config.json')

module.exports = class KickCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            aliases: ['kick'],
            group: 'moderation',
            memberName: 'kick',
            description: 'Kicks a user',
            guildOnly: true,

            args: [
                {
                    key: 'member',
                    prompt: 'Who would you like to kick?\n',
                    type: 'member'
                }
            ]
        })
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.hasPermission('BAN_MEMBERS')
    }

    async run(msg, { member }) {
        msg.delete()

        if (!member) {
            return msg.reply('invalid user!')
        }
        if (member === msg.member) {
            return
        }
        member.kick().then(member => {
            return msg.react('\u2705')
        })
    }
}
