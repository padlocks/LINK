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
        // TODO: url from string is stored as undefined in the database
        let evidence

        // check if evidence is a url or an attachment..
        if (url == 'NONE') {
            if (msg.attachments.first()) {
                evidence = msg.attachments.first().url
            } else {
                return msg.channel.send('No evidence supplied.')
            }
            
        } else {
            urlChecker.verify(url, () => {
                console.log(typeof url)
                evidence = url.toString()
            })
        }

        await Moderation.addEvidence(logId, evidence)
            .then(() => { return msg.react('\u2705') })
            .catch(err => { Logger.error(err) })
    }
}
