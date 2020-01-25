var { Command } = require('discord.js-commando')
var { RichEmbed } = require('discord.js')
var spacetime = require('spacetime')
var informal = require('../../utils/spacetime-informal')

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
                    prompt: 'What time are you trying to convert? Format: `5:30pm` or `23:30`\n',
                    type: 'string'
                },
                {
                    key: 'convertTo',
                    prompt: 'What time zone are you converting to? Remember, all times are stored in the bot as UTC/GMT.\n',
                    type: 'string'
                }
            ]
        })
    }

    hasPermission(msg) {
        return msg.member.hasPermission('MANAGE_MESSAGES')
    }

    async run(msg, { time, convertTo }) {
        var config = require('../../structures/Settings').load()

        if (!config.toggles.tzConvert) {
            let embed = new RichEmbed()
            embed.setTitle('Command Disabled!')
            embed.setColor('RANDOM')
            embed.addField('Error', 'Command is disabled. Please contact the developer for support.')
            
            return msg.channel.send(embed)
        } 

        convertTo = convertTo.toLowerCase()

        let defaultTime = spacetime.now(informal.find(config.default_tz.toLowerCase()))
        let d = defaultTime.time(time)
        // if a timezone is found, use it.
        if(!informal.find(convertTo) || d.goto(informal.find(convertTo)).time() == defaultTime.time()) {
            return msg.reply('timezone is invalid or the conversion resulted in the same time. Contact atom#0001 if you believe this is a mistake.')
        } else {
            d = d.goto(informal.find(convertTo))
        }

        let embed = new RichEmbed()
        embed.setTitle('Timezone Conversion')
        embed.setColor('RANDOM')
        embed.addField('UTC/GMT Time', time)
        embed.addField(`${convertTo.toUpperCase()} Time`, d.time())

        return msg.channel.send(embed)
    }
}
