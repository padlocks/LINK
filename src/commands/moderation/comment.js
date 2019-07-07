var { Command } = require('discord.js-commando')
var { RichEmbed } = require('discord.js')
var config = require('../../config.json')
var Moderation = require('../../structures/Moderation')

module.exports = class CommentCommands extends Command {
    constructor(client) {
        super(client, {
            name: 'comment',
            aliases: ['comment'],
            group: 'moderation',
            memberName: 'comment',
            description: 'Adds comment to logs',
            guildOnly: true,

            args: [
                {
                    key: 'logId',
                    prompt: 'What is the log (id) you want to add evidence to?\n',
                    type: 'member'
                },
                {
                    key: 'comment',
                    prompt: 'What would you like to say?\n',
                    type: 'string'
                }
            ]
        })
    }

    hasPermission(msg) {
        return msg.member.hasPermission('MANAGE_MESSAGES')
    }

    async run(msg, { logId, comment }) {
        let channel = msg.guild.channels.get(config.log_channel)
        let messageId = await Moderation.getMessageId(logId)
        let logTime = await Moderation.getLogTime(logId)
        let log = channel.fetchMessage(messageId)


        log.embeds[0]
            .addField('Comments', `<${evidence}>`)
            .setFooter(`${logTime}`)
        log.edit(log)
            .then(async () => {
                await Moderation.addEvidence(logId, evidence)
                log.embeds[0].setFooter(`✓ ${logTime}`)
                return log.edit(embed)
            })
    }
}
