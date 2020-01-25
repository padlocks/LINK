var { Command, util } = require('discord.js-commando')
var { stripIndents } = require('common-tags')
var { RichEmbed } = require('discord.js')
var Logger = require('../../utils/Logger.js')
var GameAPI = require('../../structures/Game')
module.exports = class GameLogsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'gamelogs',
            aliases: ['glogs', 'gamelogs', 'gamestatus', 'gstatus'],
            group: 'moderation',
            memberName: 'gamelogs',
            description: 'Returns the moderation logs of a user in-game.',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },

            args: [
                {
                    key: 'userId',
                    prompt: 'What user\'s logs would you like to view? (In-game ID)\n',
                    type: 'string'
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

    async run(msg, { userId, page }) {
        var config = require('../../structures/Settings').load()

        if (!config.toggles.mViewGameLogs) {
            let embed = new RichEmbed()
            embed.setTitle('Command Disabled!')
            embed.setColor('RANDOM')
            embed.addField('Error', 'Command is disabled. Please contact the developer for support.')
            
            return msg.channel.send(embed)
        } 
        let warnings = await GameAPI.getUserGameWarnings(userId)
        let kicks = await GameAPI.getUserGameKicks(userId)
        let bans = await GameAPI.getUserGameBans(userId)
        let totalLogs = await GameAPI.getTotalUserLogAmount(userId)
        let points = await GameAPI.getPoints(userId)
        let logs = await GameAPI.getUserLogs(userId)
        let paginated = util.paginate(logs, page, Math.floor(5))
        let embed = new RichEmbed
        embed.setColor('RANDOM')
        embed.setAuthor(`Logs of ${await GameAPI.getIGNFromIGID(userId)} (${userId})`)
        embed.setFooter(`!evidence <member> | User Logs Page #${paginated.page} of ${paginated.maxPage}`)

        embed.setDescription(stripIndents`
            **User Stats**
            Location: 'GAME'
            User: ${await GameAPI.getIGNFromIGID(userId)} (${userId})
            Warns: ${warnings}
            Kicks: ${kicks}
            Bans: ${bans}
            Logs: ${totalLogs}
            Points: ${points}

            ${paginated.items.map(log => `
                **User Log #${log['user_log_num']} (ID: ${log['id']})**:
                Reason: **${log['reason']}**
                Action: **${log['action']}**
                Staff: ${log['staff_username']} (${log['staff_id']})
                Time: ${log['time']}
            `).join('\n')}
        `)

        return msg.channel.send(embed)
            .catch(err => { Logger.error(err) })
    }
}
