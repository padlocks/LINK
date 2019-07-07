var { Command } = require('discord.js-commando')
var config = require('../../config.json')

module.exports = class UnbanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unban',
            aliases: ['unban'],
            group: 'moderation',
            memberName: 'unban',
            description: 'Unbans a user',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },

            args: [
                {
                    key: 'userId',
                    prompt: 'Who would you like to ban?\n',
                    type: 'string'
                }
            ]
        })
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.hasPermission('BAN_MEMBERS')
    }

    async run(msg, { userId }) {
        if (!userId) {
            return msg.reply('invalid user!')
        }
        if (userId === msg.member.id) {
            return
        }
        var user = await msg.author.client.fetchUser(userId)
        user.unban().then(() => {
            return msg.react('\u2705')
        })
    }
}
