var { Command } = require('discord.js-commando')
var { RichEmbed } = require('discord.js')
var Logger = require('../../utils/Logger.js')
var Moderation = require('../../structures/Moderation')

module.exports = class WarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            aliases: ['warn', 'log', 'sting', 'bs'],
            group: 'moderation',
            memberName: 'create_log',
            description: 'Warns a user',
            guildOnly: true,
            clientPermissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
            userPermissions: ['MANAGE_MESSAGES'],

            args: [
                {
                    key: 'member',
                    prompt: 'Who would you like to warn?\n',
                    type: 'member'
                },
                {
                    key: 'points',
                    prompt: 'How many points does this user recieve?\n',
                    type: 'number'
                },
                {
                    key: 'reason',
                    prompt: 'What is your reason for this warning?\n',
                    type: 'string'
                }
            ]
        })
    }

    async run(msg, { member, points, reason }) {
        var config = require('../../structures/Settings').load()

        if (!config.toggles.mCreateLogs) {
            let embed = new RichEmbed()
            embed.setTitle('Command Disabled!')
            embed.setColor('RANDOM')
            embed.addField('Error', 'Command is disabled. Please contact the developer for support.')

            return msg.channel.send(embed)
        } else {
            if (!member) {
                msg.react('❌')
                return msg.reply('invalid user!')
            }
            if (member === msg.member) {
                msg.react('❌')
                return msg.reply('you cannot warn yourself!')
            }
        }

        if (!config.experiments) {
            reason = reason.toLowerCase() // fault tolerance

            let date = new Date()
            let day = date.toDateString()
            let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()
            let hours = (date.getHours() < 10 ? "0" : "") + date.getHours()
            let time = `${hours}:${minutes}`
            let datetime = `${day} @ ${time} (${config.timezone})`

            let logId = await Moderation.generateLogId() + 1
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
                    await Moderation.addLog(sentMessage.id, 'DISCORD', member.user.tag, member.user.id, msg.author.tag, msg.author.id, reason)
                        .then(async (action) => {
                            let points = await Moderation.getPoints(member.user.id)
                            embed.fields.push({ name: 'Resulting Action', value: `${action}` })
                            embed.fields.push({ name: 'Total User Points', value: `${points}` })
                            embed.setFooter(`🗸 ${datetime}`)
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
                        msg.react('✅')
                    })
                })
                .catch(console.error)
        }
        else {
            reason = reason.toLowerCase() // fault tolerance

            let date = new Date()
            let day = date.toDateString()
            let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()
            let hours = (date.getHours() < 10 ? "0" : "") + date.getHours()
            let time = `${hours}:${minutes}`
            let datetime = `${day} @ ${time} (${config.timezone})`

            let logId = await Moderation.generateLogId() + 1
            let logNum = await Moderation.getTotalUserLogAmount(member.user.id) + 1

            let embed = new RichEmbed
            embed.setAuthor(`${member.user.tag} (${member.user.id}) | User Log #${logNum}`)
            embed.setDescription(`See evidence using '!logevidence ${logId}'\nAdd evidence using '!add' with an attachment.`)
            embed.setColor('#FF0000')
            embed.setTitle(`LogID: ${logId}`)
            embed.addField('Staff', `${msg.author.tag}`)
            embed.addField('Reason', `${reason}`)
            embed.addField('Points', `+${points}`)
            embed.setFooter(`${datetime}`)

            member.guild.channels.get(config.log_channel).send(embed)
                .then(async (sentMessage) => {
                    await Moderation.addLog(sentMessage.id, 'DISCORD', member.user.tag, member.user.id, msg.author.tag, msg.author.id, reason, points)
                        .then(async (action) => {
                            embed.setFooter(`🗸 ${datetime}`)
                            if (config.toggles.autoAct) {
                                embed.fields.push({ name: 'Resulting Action', value: `${action}` })
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
                        msg.react('✅')
                    })
                })
                .catch(console.error)
        }
    }
}
