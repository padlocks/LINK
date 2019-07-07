var { Command } = require('discord.js-commando')

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            aliases: ['say'],
            group: 'dev',
            memberName: 'say',
            description: 'Says something.',
            guildOnly: false,

            args: [
                {
                    key: 'message',
                    prompt: 'What would you like to say?\n',
                    type: 'string',
                    default: ''
                }
            ]
        })
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author)
    }

    async run(msg, { message }) {
        msg.delete(0)
        return msg.channel.send(message)
    }
}
