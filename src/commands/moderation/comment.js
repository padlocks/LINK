var { Command } = require('discord.js-commando')
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
        var config = require('../../structures/Settings').load()

        if (!config.toggles.mComment) {
            let embed = new RichEmbed()
            embed.setTitle('Command Disabled!')
            embed.setColor('RANDOM')
            embed.addField('Error', 'Command is disabled. Please contact the developer for support.')
            
            return msg.channel.send(embed)
        } 
        await Moderation.addComment(logId, msg.author.tag, msg.author.id, comment)
            .then(() => { return msg.react('\u2705') })
            .catch(err => { Logger.error(err) })
    }
}
