var { Command } = require('discord.js-commando')
var config = require('../../config.json')

module.exports = class RestartCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'restart',
            aliases: ['restart', 'reboot'],
            group: 'dev',
            memberName: 'restart',
            description: 'Restarts the client.',
            guildOnly: false
        })
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author)
    }

    async run(msg) {
        msg.channel.send('Restarting..')
            .then(() => this.client.destroy())
            .then(() => this.client.login(config.token))
    }
}
