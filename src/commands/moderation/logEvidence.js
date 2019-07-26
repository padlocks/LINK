var { Command, util } = require('discord.js-commando')
var { stripIndents } = require('common-tags')
var { RichEmbed } = require('discord.js')
var Logger = require('../../utils/Logger.js')
var Moderation = require('../../structures/Moderation')

module.exports = class LogEvidenceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'logevidence',
            aliases: ['logevidence'],
            group: 'moderation',
            memberName: 'logevidence',
            description: 'Displays evidence via logId',
            guildOnly: true,

            args: [
                {
                    key: 'logId',
                    prompt: 'What is the log (id) you want to view evidence for?\n',
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
        // check logId is valid:
        let reason = await Moderation.getReason(logId)
        if (!reason) return msg.reply(`log with ID '${logId}' does not exist.`)

        let evidence = await Moderation.getLogEvidence(logId)
        if (evidence.length == 0) return msg.reply('this user has no evidence uploaded.')

        let userId = await Moderation.getUserId(logId)
        let userLogNum = await Moderation.getUserLogNumber(userId)   
        let paginated = util.paginate(evidence, page, Math.floor(5)) // 5 pieces of evidence per page.

        let embed = new RichEmbed
        embed.setColor('RANDOM')
        embed.setTitle(`Evidence for LogID: ${logId}`)
        embed.setFooter(`Evidence Log Page #${paginated.page} of ${paginated.maxPage}`)
        embed.setDescription(stripIndents`
        **User Log #${userLogNum} (ID: ${logId})**:
        Reason: ${reason}

        ${paginated.items.map(evidence => `
                **${evidence['time']}**: ${evidence['evidence_url']}
            `).join('\n')}
        `)

        return msg.channel.send(embed)
            .catch(err => { Logger.error(err) })
    }
}
