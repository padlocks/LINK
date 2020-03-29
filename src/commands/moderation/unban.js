var { Command } = require('discord.js-commando')
var Moderation = require('../../structures/Moderation')

module.exports = class UnbanCommands extends Command {
    constructor(client) {
        super(client, {
            name: 'unban',
            aliases: ['unban', 'revoke'],
            group: 'moderation',
            memberName: 'unban',
            description: 'Revokes a user\'s ban.',
            guildOnly: true,
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['MANAGE_MESSAGES', 'BAN_MEMBERS'],

            args: [
                {
                    key: 'id',
                    prompt: 'What is the userId of the user you wish to unban?\n',
                    type: 'string'
                }
            ]
        })
    }

    async run(msg, { id }) {
        msg.channel.guild.unban(`${id}`)
            .then(user => msg.reply(`${user.tag} has been unbanned.`))
            .catch(console.error)
    }
}
