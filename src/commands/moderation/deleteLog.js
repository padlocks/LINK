var { Command } = require('discord.js-commando')
var { RichEmbed } = require('discord.js')
var Moderation = require('../../structures/Moderation')

module.exports = class DeleteLogCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'deletelog',
            aliases: ['delete', 'rm', 'remove'],
            group: 'moderation',
            memberName: 'deletelog',
            description: 'Deletes a log entry.',
            guildOnly: true,

            args: [
                {
                    key: 'logId',
                    prompt: 'LogID of log to be deleted.\n',
                    type: 'integer'
                }
            ]
        })
    }

    hasPermission(msg) {
        return msg.member.roles.find(role => role.name === "Human Resources")
    }

    async run(msg, { logId }) {
        var config = require('../../structures/Settings').load()

        if (!config.toggles.mDeleteLogs) {
            let embed = new RichEmbed()
            embed.setTitle('Command Disabled!')
            embed.setColor('RANDOM')
            embed.addField('Error', 'Command is disabled. Please contact the developer for support.')

            return msg.channel.send(embed)
        }

        // confirm bot has proper permissions...
        let perms = []
        if (!msg.guild.me.hasPermission('MANAGE_MESSAGES')) perms.push('MANAGE_MESSAGES')

        if (perms.length > 0) return msg.reply(`I require the additional following permissions to use this command: ${perms}`)

        let log = await Moderation.removeLog(logId)
        if (log) {
            let logChannel = msg.guild.channels.get(config.log_channel)
            logChannel.fetchMessage(log)
                .then(message => {
                    message.delete()
                        .then(msg.react('✅'))
                })
        } else {
            msg.reply('there was an error. Is the logId correct?')
            msg.react('❌')
        }
    }
}
