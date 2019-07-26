var { Command } = require('discord.js-commando')
var { RichEmbed } = require('discord.js')
var config = require('../../config')
var spacetime = require('spacetime')

module.exports = class ConvertCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'convert',
            aliases: ['convert'],
            group: 'general',
            memberName: 'convert',
            description: 'Converts timezones',
            guildOnly: true,

            args: [
                {
                    key: 'time',
                    prompt: 'What time are you trying to convert? Format: 5:30pm\n',
                    type: 'string'
                },
                {
                    key: 'convertTo',
                    prompt: 'What time zone are you converting to? Remember, all times are stored in the bot as America/Los_Angeles.\n',
                    type: 'string'
                }
            ]
        })
    }

    hasPermission(msg) {
        return msg.member.hasPermission('MANAGE_MESSAGES')
    }

    async run(msg, { time, convertTo }) {
        // TODO: allow informal names such as UTC, GMT, PST, etc.
        let d = spacetime.now(config.default_tz)
        d = d.time(time)
        d = d.goto(convertTo)

        let embed = new RichEmbed()
        embed.setTitle('Timezone Conversion')
        embed.setColor('RANDOM')
        embed.addField('UTC/GMT', time)
        embed.addField(`${convertTo}`, d.time())

        return msg.channel.send(embed)
    }
}
