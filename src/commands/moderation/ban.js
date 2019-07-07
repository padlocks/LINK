var { Command } = require('discord.js-commando')
var config = require('../../config.json')

module.exports = class BanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            aliases: ['ban'],
            group: 'moderation',
            memberName: 'ban',
            description: 'Bans a user',
            guildOnly: true,

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
        member.ban().then(member => {

        })
    }
}
