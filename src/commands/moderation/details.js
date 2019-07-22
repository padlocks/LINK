var { Command, util } = require('discord.js-commando')
var { stripIndents } = require('common-tags')
var { RichEmbed } = require('discord.js')
var Logger = require('../../utils/Logger.js')
var Moderation = require('../../structures/Moderation')

module.exports = class DetailsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'details',
            aliases: ['details'],
            group: 'moderation',
            memberName: 'details',
            description: 'Displays comments left by staff on a log.',
            guildOnly: true,

            args: [
                {
                    key: 'logId',
                    prompt: 'What is the log (id) you want display?\n',
                    type: 'integer'
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
        return msg.member.hasPermission('MANAGE_MESSAGES')
    }

    async run(msg, { logId, page }) {
        let staff = await Moderation.getStaffResponsibleName(logId)
        let staffId = await Moderation.getStaffResponsibleId(logId)
        let user = await Moderation.getUser(logId)
        let userId = await Moderation.getUserId(logId)
        let logNum = await Moderation.getUserLogNumber(userId)
        let reason = await Moderation.getReason(logId)
        let logTime = await Moderation.getLogTime(logId)
        let comments = await Moderation.getAllComments(logId)
        let paginated = util.paginate(comments, page, Math.floor(5))

        let embed = new RichEmbed
        embed.setAuthor(`Details of ${user} Log #${logNum}`)
        embed.setColor('RANDOM')
        embed.setFooter(`Staff Comments Page #${paginated.page} of ${paginated.maxPage}`)

        embed.setDescription(stripIndents`
        Logged by: ${staff} (${staffId})
        Reason: ${reason} 
        Time of log: ${logTime}
        
        ${paginated.items.map(comment => `
                **${comment['staff']} (${comment['staff_id']}) at ${comment['time']}**:
                *${comment['content']}*
            `).join('\n')}
        `)

        return msg.channel.send(embed)
            .catch(err => { Logger.error(err) })
    }
}
