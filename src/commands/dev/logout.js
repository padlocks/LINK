var { Command } = require('discord.js-commando')

module.exports = class LogoutCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'logout',
            aliases: ['logout'],
            group: 'dev',
            memberName: 'logout',
            description: 'Logs the client out.',
            guildOnly: false
        })
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author)
    }

    async run() {
        this.client.destroy()
    }
}
