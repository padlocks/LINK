var { Command } = require('discord.js-commando')
var { RichEmbed } = require('discord.js')
var Moderation = require('../../structures/Moderation')

module.exports = class DeleteLogCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'deletelog',
            aliases: ['delete', 'rm', 'remove'],
            group: 'moderation',
            memberName: 'delete_log',
            description: 'Deletes a log entry.',
            guildOnly: true,
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],

            args: [
                {
                    key: 'logId',
                    prompt: 'LogID of log to be deleted.\n',
                    type: 'integer'
                }
            ]
        })
    }

    async run(msg, { logId }) {
        if (!msg.member.roles.find(role => role.name === "Human Resources")) {
            msg.reply('you are not a Human Resources Department member!')
            msg.react('❌')
            return
        }
        var config = require('../../structures/Settings').load()

        if (!config.toggles.mDeleteLogs) {
            let embed = new RichEmbed()
            embed.setTitle('Command Disabled!')
            embed.setColor('RANDOM')
            embed.addField('Error', 'Command is disabled. Please contact the developer for support.')

            return msg.channel.send(embed)
        }

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
