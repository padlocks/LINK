var { Command } = require('discord.js-commando')

module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            aliases: ['ping'],
            group: 'dev',
            memberName: 'ping',
            description: 'Checks API latency',
            guildOnly: false
        })
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author)
    }

    async run(msg) {
        let m = await msg.channel.send("Pinging..")
        m.edit(`Pong! Latency is ${m.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${Math.round(this.client.ping)}ms`)
    }
}
