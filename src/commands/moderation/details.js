var { Command } = require('discord.js-commando')
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
                }
            ]
        })
    }

    hasPermission(msg) {
        return msg.member.hasPermission('MANAGE_MESSAGES')
    }

    async run(msg, { logId }) {
        let staff = await Moderation.getStaffResponsibleName(logId)
        let staffId = await Moderation.getStaffResponsibleId(logId)
        let user = await Moderation.getUser(logId)
        let userId = await Moderation.getUserId(logId)
        let logNum = await Moderation.getUserLogNumber(userId)
        let reason = await Moderation.getReason(logId)
        let logTime = await Moderation.getLogTime(logId)
        let comments = await Moderation.getAllComments(logId)
        let embed = new RichEmbed
        embed.setColor('RANDOM')
        embed.setTitle(`Details of ${user} Log #${logNum}`)
        embed.setDescription(`Logged by: ${staff}\nStaff ID: ${staffId}\nReason: ${reason}`)
        embed.setFooter(`Time of log: ${logTime}`)

        // iterate through comments and add fields..
        comments.forEach((comment) => {
            embed.addField(`${comment['staff']} (${comment['staff_id']}):`, `**${comment['content']}**\nat ${comment['time']}`)
        })

        return msg.channel.send(embed)
            .catch(err => { Logger.error(err) })
    }
}
