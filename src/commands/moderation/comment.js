var { Command } = require('discord.js-commando')
var { RichEmbed } = require('discord.js')
var config = require('../../config.json')
var Moderation = require('../../structures/Moderation')

module.exports = class CommentCommands extends Command {
    constructor(client) {
        super(client, {
            name: 'comment',
            aliases: ['comment'],
            group: 'moderation',
            memberName: 'comment',
            description: 'Adds comment to logs',
            guildOnly: true,

            args: [
                {
                    key: 'logId',
                    prompt: 'What is the log (id) you want to add a comment to?\n',
                    type: 'integer'
                },
                {
                    key: 'comment',
                    prompt: 'What would you like to say?\n',
                    type: 'string'
                }
            ]
        })
    }

    hasPermission(msg) {
        return msg.member.hasPermission('MANAGE_MESSAGES')
    }

    async run(msg, { logId, comment }) {
        await Moderation.addComment(logId, msg.author.tag, msg.author.id, comment)
            .then(() => { return msg.react('\u2705') })
            .catch(err => { Logger.error(err) })
    }
}
