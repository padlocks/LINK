var { Command, util } = require('discord.js-commando')
var { stripIndents } = require('common-tags')
var { MessageEmbed } = require('discord.js')
var Logger = require('../../utils/Logger.js')
var Moderation = require('../../structures/Moderation')

module.exports = class LogEvidenceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'logevidence',
            aliases: ['logevidence'],
            group: 'moderation',
            memberName: 'view_log_evidence',
            description: 'Displays evidence via logId',
            guildOnly: true,
            userPermissions: ['MANAGE_MESSAGES'],

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

    async run(msg, { logId, page }) {
        var config = require('../../structures/Settings').load()

        if (!config.toggles.mViewLogAttachments) {
            let embed = new MessageEmbed()
            embed.setTitle('Command Disabled!')
            embed.setColor('RANDOM')
            embed.addField('Error', 'Command is disabled. Please contact the developer for support.')
            
            return msg.channel.send(embed)
        } 
        // check logId is valid:
        let reason = await Moderation.getReason(logId)
        if (!reason) return msg.reply(`log with ID '${logId}' does not exist.`)

        let evidence = await Moderation.getLogEvidence(logId)
        if (evidence.length == 0) return msg.reply('this user has no evidence uploaded.')

        let userId = await Moderation.getUserId(logId)
        let userLogNum = await Moderation.getUserLogNumber(userId)   
        let paginated = util.paginate(evidence, page, Math.floor(5)) // 5 pieces of evidence per page.

        let embed = new MessageEmbed
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
