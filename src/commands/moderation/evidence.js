var { Command } = require('discord.js-commando')
var { RichEmbed } = require('discord.js')
var winston = require('winston')
var Moderation = require('../../structures/Moderation')

module.exports = class EvidenceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'evidence',
            aliases: ['evidence'],
            group: 'moderation',
            memberName: 'evidence',
            description: 'Displays evidence',
            guildOnly: true,

            args: [
                {
                    key: 'logId',
                    prompt: 'What is the log (id) you want to add evidence to?\n',
                    type: 'integer'
                }
            ]
        })
    }

    hasPermission(msg) {
        return msg.member.hasPermission('MANAGE_MESSAGES')
    }

    async run(msg, { logId }) {
        let date = new Date()
        let day = date.toDateString()
        let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()
        let hours = (date.getHours() < 10 ? "0" : "") + date.getHours()
        let time = `${hours}:${minutes}`
        let datetime = `${day} @ ${time} (PST)`

        let staff = await Moderation.getStaffResponsible(logId)
        let user = await Moderation.getUser(logId)
        let reason = await Moderation.getReason(logId)
        let evidenceString = await Moderation.getEvidenceString(logId)
        let embed = new RichEmbed
        embed.setAuthor(`Staff: ${staff}`)
        embed.setColor('#FF0000')
        embed.setTitle(`Evidence for LogID: ${logId}`)
        embed.addField('User', `${user}`)
        embed.addField('Reason', `${reason}`)
        embed.addField('Evidence', `${evidenceString}`)
        embed.setFooter(`${datetime}`)

        return msg.channel.send(embed)
            .catch(err => { winston.error(err) })
    }
}
