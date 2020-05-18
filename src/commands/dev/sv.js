var { Command } = require('discord.js-commando')
var Settings = require('../../structures/Settings')

module.exports = class SvCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'sv',
            aliases: ['sv'],
            group: 'dev',
            memberName: 'sv',
            description: 'Changes settings table.',
            guildOnly: false,

            args: [
                {
                    key: 'value',
                    prompt: 'What table would you like to switch to?\n',
                    type: 'number'
                }
            ]
        })
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author)
    }

    async run(msg, { value }) {
        return msg.channel.send(await Settings.svModify(value))
    }
}
