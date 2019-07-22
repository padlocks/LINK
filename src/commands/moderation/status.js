var { Command, util } = require('discord.js-commando')
var { oneLine, stripIndents } = require('common-tags')
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
        if (!member) {
            return msg.reply('invalid user!')
        }

        let warnings = await Moderation.getWarnings(member.user.id)
        let kicks = await Moderation.getKicks(member.user.id)
        let bans = await Moderation.getBans(member.user.id)
        let totalLogs = await Moderation.getTotalUserLogAmount(member.user.id)
        let points = await Moderation.getPoints(member.user.id)
        let logs = await Moderation.getUserLogs(member.user.id)
        let paginated = util.paginate(logs, page, Math.floor(5))
        let embed = new RichEmbed
        embed.setColor('RANDOM')
        embed.setAuthor(`Status of ${member.user.tag} (${member.user.id})`)
        embed.setFooter(`!evidence <member> | User Status Page #${paginated.page} of ${paginated.maxPage}`)

        embed.setDescription(stripIndents`
            **User Stats**
            Warns: ${warnings}
            Kicks: ${kicks}
            Bans: ${bans}
            Logs: ${totalLogs}
            Points: ${points}

            ${paginated.items.map(log => `
                **User Log #${log['user_log_num']} (ID: ${log['id']})**:
                Reason: ${log['reason']}
                Action: ${log['action']}
                Staff: ${log['staff_username']} ${log['staff_id']}
                Time: ${log['time']}
            `).join('\n')}
        `)

        return msg.channel.send(embed)
            .catch(err => { Logger.error(err) })
    }
}
