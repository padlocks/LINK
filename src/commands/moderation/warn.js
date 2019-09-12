var { Command } = require('discord.js-commando')
var { RichEmbed } = require('discord.js')
var Logger = require('../../utils/Logger.js')
var config = require('../../config.json')
var Moderation = require('../../structures/Moderation')

module.exports = class WarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            aliases: ['warn', 'log'],
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

        // confirm bot has proper permissions...
        let perms = []
        if (!msg.guild.me.hasPermission('MANAGE_MESSAGES')) perms.push('MANAGE_MESSAGES')
        if (!msg.guild.me.hasPermission('KICK_MEMBERS')) perms.push('KICK_MEMBERS')
        if (!msg.guild.me.hasPermission('BAN_MEMBERS')) perms.push('BAN_MEMBERS')

        if (perms.length > 0) return msg.reply(`I require the additional following permissions to use this command: ${perms}`)
        if (!member) {
            msg.react('\u2612')
            return msg.reply('invalid user!')
        }
        if (member === msg.member) {
            msg.react('\u2612')
            return msg.reply('you cannot warn yourself!')
        }

        reason = reason.toLowerCase() // fault tolerance

        let date = new Date()
        let day = date.toDateString()
        let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()
        let hours = (date.getHours() < 10 ? "0" : "") + date.getHours()
        let time = `${hours}:${minutes}`
        let datetime = `${day} @ ${time} (${config.timezone})`

        let logId = await Moderation.getIncompleteLogId() + 1
        let logNum = await Moderation.getTotalUserLogAmount(member.user.id) + 1

        let embed = new RichEmbed
        embed.setAuthor(`${member.user.tag} (${member.user.id}) | User Log #${logNum}`)
        embed.setDescription(`See evidence using '!logevidence ${logId}'\nAdd evidence using '!add' with an attachment.`)
        embed.setColor('#FF0000')
        embed.setTitle(`LogID: ${logId}`)
        embed.addField('Staff', `${msg.author.tag}`)
        embed.addField('Reason', `${reason}`)
        embed.setFooter(`${datetime}`)

        member.guild.channels.get(config.log_channel).send(embed)
            .then(async (sentMessage) => {
                await Moderation.addLog(sentMessage.id, member.user.tag, member.user.id, msg.author.tag, msg.author.id, reason)
                    .then(async (action) => {
                        let points = await Moderation.getPoints(member.user.id)
                        embed.fields.push({ name: 'Resulting Action', value: `${action}` })
                        embed.fields.push({ name: 'Total User Points', value: `${points}` })
                        embed.setFooter(`\u2713 ${datetime}`)
                        if (action == 'WARNING') { 
                            if (!member.user.bot) {
                                member.send(`You have received a warning for \`${reason}\`. Please be more mindful next time.\nRules can be found here: <#${config.rules_channel}>\n\n- True Colors Administration`)
                            }
                        }
                        if (action == 'WARNING_PERM_NEXT') {
                            if (!member.user.bot) {
                                member.send(`You have received a warning for \`${reason}\`. Please be more mindful next time. **You are due for a permanent ban soon.**\nRules can be found here: <#${config.rules_channel}>\n\n- True Colors Administration`)
                            }
                        }
                        if (action == 'KICK') {
                            if (!member.user.bot) {
                                member.send(`You have been kicked for \`${reason}\`. Please be more mindful next time.\nRules can be found here: <#${config.rules_channel}>\n\n- True Colors Administration`)
                                member.kick(`Automatic kick by ${msg.author.tag} for reason: ${reason}; user has ${logNum} logs and ${points} points`)
                            }
                        }
                        if (action == 'BAN') { 
                            if (!member.user.bot) {
                                member.send(`You have been banned for \`${reason}\`. [appeal info]\n\n- True Colors Administration`)
                                member.ban(`Automatic ban by ${msg.author.tag} for reason: ${reason}; user has ${logNum} logs and ${points} points`)
                            }
                        }
                        if (action == 'PERM_BAN') { 
                            if (!member.user.bot) {
                                member.send(`Due to a severe rule violations or recurring violations, you have been **permenately** banned for \`${reason}\`.\n\n- True Colors Administration`)
                                member.ban(`Automatic perm ban by ${msg.author.tag} for reason: ${reason}; user has ${logNum} logs and ${points} points`)
                            }
                        }
                    })
                    .catch(err => {
                        embed.setFooter(`\u2717 ${datetime}`)
                        Logger.error(err)
                    })
                sentMessage.edit(embed).then(() => {
                    msg.react('\u2705')
                })
            })
            .catch(console.error)
    }
}
