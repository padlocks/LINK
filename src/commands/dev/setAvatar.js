var { Command } = require('discord.js-commando')
var Logger = require('../../utils/Logger.js')
module.exports = class SetAvatarCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'setavatar',
            aliases: ['setavatar'],
            group: 'dev',
            memberName: 'set_avatar',
            description: 'Says something.',
            guildOnly: false,
            throttling: {
                usages: 1,
                duration: 60
            },
            args: [
                {
                    key: 'imgURL',
                    prompt: 'What would you like to use as an avatar? **The image must be a URL.**\n',
                    type: 'string'
                }
            ]
        })
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author)
    }

    async run(msg, { imgURL }) {
        msg.author.client.user.setAvatar(imgURL)
            .then(() => msg.react('✅'))
            .catch(Logger.error)
    }
}
