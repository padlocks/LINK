var { Command } = require('discord.js-commando')
var Logger = require('../../utils/Logger.js')
var Moderation = require('../../structures/Moderation')
var urlChecker = require('../../utils/urlChecker')

module.exports = class AddEvidenceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'addevidence',
            aliases: ['add'],
            group: 'moderation',
            memberName: 'addevidence',
            description: 'Adds evidence to logs',
            guildOnly: true,

            args: [
                {
                    key: 'logId',
                    prompt: 'What is the log (id) you want to add evidence to?\n',
                    type: 'integer'
                },
                {
                    key: 'url',
                    prompt: 'What link would you like to upload as evidence?\n',
                    default: 'NONE',
                    type: 'string'
                }
            ]
        })
    }

    hasPermission(msg) {
        return msg.member.hasPermission('MANAGE_MESSAGES')
    }

    async run(msg, { logId, url }) {
        // check if log even exists..
        let reason = await Moderation.getReason(logId)
        if (!reason) return msg.reply(`log with ID '${logId}' does not exist.`)
        // it does, lets continue..
        let evidence

        // check if evidence is a url or an attachment..
        if (url == 'NONE') {
            if (msg.attachments.first()) {
                evidence = msg.attachments.first().url
                await Moderation.addEvidence(logId, evidence)
                    .then(() => { return msg.react('\u2705') })
                    .catch(err => { Logger.error(err) })
            } else {
                return msg.channel.send('No evidence supplied.')
            }
            
        } else {
            urlChecker.verify(url, async () => {
                await Moderation.addEvidence(logId, url)
                    .then(() => { return msg.react('\u2705') })
                    .catch(err => { Logger.error(err) })
            })
        }
    }
}
