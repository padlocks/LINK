var { Command } = require('discord.js-commando')
var { RichEmbed } = require('discord.js')
var winston = require('winston')
var config = require('../../config.json')
var Moderation = require('../../structures/Moderation')

module.exports = class WarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            aliases: ['warn'],
            group: 'moderation',
            memberName: 'warn',
            description: 'Warns a user',
            guildOnly: true,

            args: [
                {
                    key: 'member',
                    prompt: 'Who would you like to warn?\n',
                    type: 'member'
                },
                {
                    key: 'reason',
                    prompt: 'What is your reason for this warning?\n',
                    type: 'string'
                }
            ]
        })
    }

    hasPermission(msg) {
        return msg.member.hasPermission('MANAGE_MESSAGES')
    }

    async run(msg, { member, reason }) {
        if (!member) {
            return msg.reply('invalid user!')
        }

        if (member === msg.member) {
            return
        }

        let date = new Date()
        let day = date.toDateString()
        let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()
        let hours = (date.getHours() < 10 ? "0" : "") + date.getHours()
        let time = `${hours}:${minutes}`
        let datetime = `${day} @ ${time} (PST)`

        let logId = await Moderation.getIncompleteLogId() + 1

        let embed = new RichEmbed
        embed.setAuthor(`Staff: ${msg.author.tag}`)
        embed.setDescription(`See evidence using '!evidence ${logId}'`)
        embed.setColor('#FF0000')
        embed.setTitle(`LogID: ${logId}`)
        embed.addField('User', `${member.user.tag} (${member.user.id})`)
        embed.addField('Reason', `${reason}`)
        embed.setFooter(`${datetime}`)

        member.guild.channels.get(config.log_channel).send(embed)
            .then(async (sentMessage) => {
                await Moderation.addLog(sentMessage.id, member.user.tag, member.user.id, msg.author.tag, msg.author.id, reason)
                    .then(async () => {
                        let points = await Moderation.getPoints(member.user.id)
                        embed.fields.push({ name: 'Total User Points', value: `${points}` })
                        embed.setFooter(`\u2713 ${datetime}`)
                    })
                    .catch(err => {
                        embed.setFooter(`\u2717 ${datetime}`)
                        winston.error(err)
                    })
                sentMessage.edit(embed).then(() => {
                    return msg.react('\u2705')
                })
            })
            .catch(console.error)
    }
}
