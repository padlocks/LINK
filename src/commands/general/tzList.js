var { Command } = require('discord.js-commando')

module.exports = class TZListCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tzlist',
            aliases: ['tzlist', 'timezones'],
            group: 'general',
            memberName: 'tzlist',
            description: 'List of timezones',
            guildOnly: true
        })
    }

    hasPermission(msg) {
        return msg.member.hasPermission('MANAGE_MESSAGES')
    }

    async run(msg, { time, convertTo }) {
        return msg.channel.send('Most timezones available in the list on this wikipedia link will work:\n<https://en.wikipedia.org/wiki/List_of_tz_database_time_zones>\n\nBe sure to use "TZ database name" as the timezone you are converting to. ')
    }
}
