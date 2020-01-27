var { Command, util } = require('discord.js-commando')
var { stripIndents } = require('common-tags')
var { RichEmbed } = require('discord.js')
var Logger = require('../../utils/Logger.js')
var Moderation = require('../../structures/Moderation')
module.exports = class LogsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'logs',
            aliases: ['logs', 'status'],
            group: 'moderation',
            memberName: 'logs',
            description: 'Returns the moderation logs of a user.',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },

            args: [
                {
                    key: 'member',
                    prompt: 'What member\'s logs would you like to view?\n',
                    type: 'member'
                },
                {
                    key: 'page',
                    prompt: 'What page would you like to view?\n',
                    type: 'integer',
                    default: 1
                }
            ]
        })
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.hasPermission('MANAGE_MESSAGES')
    }

    async run(msg, { member, page }) {
        var config = require('../../structures/Settings').load()

        if (!config.toggles.mViewUserStatus) {
            let embed = new RichEmbed()
            embed.setTitle('Command Disabled!')
            embed.setColor('RANDOM')
            embed.addField('Error', 'Command is disabled. Please contact the developer for support.')
            
            return msg.channel.send(embed)
        }

        if (!member) {
            return msg.reply('invalid user!')
        }

        let warnings = await Moderation.getUserChatWarnings(member.user.id)
        let kicks = await Moderation.getUserChatKicks(member.user.id)
        let bans = await Moderation.getUserChatBans(member.user.id)
        let totalLogs = await Moderation.getTotalUserLogAmount(member.user.id)
        let points = await Moderation.getPoints(member.user.id)
        let logs = await Moderation.getUserLogs(member.user.id)
        let paginated = util.paginate(logs, page, Math.floor(5))
        let embed = new RichEmbed
        embed.setColor('RANDOM')
        embed.setAuthor(`Logs of ${member.user.tag} (${member.user.id})`)
        embed.setFooter(`!evidence <member> | User Logs Page #${paginated.page} of ${paginated.maxPage}`)

        embed.setDescription(stripIndents`
            **User Stats**
            Location: 'DISCORD'
            User: <@${member.user.id}>
            Warns: ${warnings}
            Kicks: ${kicks}
            Bans: ${bans}
            Logs: ${totalLogs}
            Points: ${points}

            ${paginated.items.map(log => `
                **User Log #${log['user_log_num']} (ID: ${log['id']})**:
                Reason: **${log['reason']}**
                Action: **${log['action']}**
                Staff: <@${log['staff_id']}>
                Time: ${log['time']}
            `).join('\n')}
        `)

        return msg.channel.send(embed)
            .catch(err => { Logger.error(err) })
    }
}
