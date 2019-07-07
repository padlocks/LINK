var { Command } = require('discord.js-commando')
var winston = require('winston')
var Moderation = require('../../structures/Moderation')

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
                }
            ]
        })
    }

    hasPermission(msg) {
        return msg.member.hasPermission('MANAGE_MESSAGES')
    }

    async run(msg, { logId }) {
        let evidence
        if (msg.attachments.first()) {
            evidence = msg.attachments.first().url
        } else {
            return msg.channel.send('No evidence supplied.')
        }

        await Moderation.addEvidence(logId, evidence)
            .then(() => { return msg.react('\u2705') })
            .catch(err => { winston.error(err) })
    }
}
