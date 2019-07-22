var { Command } = require('discord.js-commando')
var { RichEmbed } = require('discord.js')
var Logger = require('../../utils/Logger.js')
var Moderation = require('../../structures/Moderation')
module.exports = class StatusCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'status',
            aliases: ['status'],
            group: 'moderation',
            memberName: 'status',
            description: 'Returns the moderation status of a user.',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },

            args: [
                {
                    key: 'member',
                    prompt: 'What member\'s status would you like to view?\n',
                    type: 'member'
                }
            ]
        })
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.hasPermission('MANAGE_MESSAGES')
    }

    async run(msg, { member }) {
        if (!member) {
            return msg.reply('invalid user!')
        }

        let warnings = await Moderation.getWarnings(member.user.id)
        let kicks = await Moderation.getKicks(member.user.id)
        let bans = await Moderation.getBans(member.user.id)
        let totalLogs = await Moderation.getTotalUserLogAmount(member.user.id)
        let points = await Moderation.getPoints(member.user.id)
        let logs = await Moderation.getUserLogs(member.user.id)

        let embed = new RichEmbed
        embed.setColor('RANDOM')
        embed.setTitle(`Status of ${member.user.tag} (${member.user.id})`)
        embed.setDescription(`Use !evidence <member> to see all evidence of logs.`)
        embed.addField(`User Stats`, `
        Warns: **${warnings}**
        Kicks: **${kicks}**
        Bans: **${bans}**
        Logs: **${totalLogs}**
        Points: **${points}**
        `)

        // iterate through logs and add fields..
        logs.forEach((log) => {
            embed.addBlankField()
            embed.addField(`User Log #${log['user_log_num']} (ID: ${log['id']})`, `
            Reason: **${log['reason']}**
            Action: **${log['action']}**
            Staff: **${log['staff_username']} ${log['staff_id']}**
            Time: **${log['time']}**
            `)
        })

        return msg.channel.send(embed)
            .catch(err => { Logger.error(err) })
    }
}
