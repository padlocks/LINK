var { Command, util } = require('discord.js-commando')
var { stripIndents } = require('common-tags')
var { RichEmbed } = require('discord.js')
var Logger = require('../../utils/Logger.js')
var Moderation = require('../../structures/Moderation')

module.exports = class EvidenceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'evidence',
            aliases: ['evidence'],
            group: 'moderation',
            memberName: 'evidence',
            description: 'Displays evidence',
            guildOnly: true,

            args: [
                {
                    key: 'member',
                    prompt: 'What member\'s evidence would you like to view?\n',
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
        return msg.member.hasPermission('MANAGE_MESSAGES')
    }

    async run(msg, { member, page }) {
        let evidence = await Moderation.getAllUserEvidence(member.user.id)
        let paginated = util.paginate(evidence, page, Math.floor(10))
        let embed = new RichEmbed
        embed.setAuthor(`Evidence for ${member.user.tag} (${member.user.id})`)
        embed.setColor('RANDOM')
        embed.setFooter(`User Evidence Page #${paginated.page} of ${paginated.maxPage}`)

        embed.setDescription(stripIndents`
        ${paginated.items.map(evidence => `
                **User Log #${evidence['user_log_num']} (ID: ${evidence['id']})**:
                Reason: ${evidence['reason']}
                Evidence: ${evidence['evidence_url']}
                Time Added: ${evidence['time']}
            `).join('\n')}
        `)

        return msg.channel.send(embed)
            .catch(err => { Logger.error(err) })
    }
}
