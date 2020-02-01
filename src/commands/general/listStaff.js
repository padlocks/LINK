var { Command, util } = require('discord.js-commando')
var { stripIndents } = require('common-tags')
var { RichEmbed } = require('discord.js')
var Logger = require('../../utils/Logger.js')
var Moderation = require('../../structures/Moderation')

module.exports = class ListStaffCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'liststaff',
            aliases: ['liststaff', 'lstaff'],
            group: 'general',
            memberName: 'list_staff',
            description: 'Displays all staff in the database.',
            guildOnly: true,

            args: [
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

    async run(msg, { page }) {
        var config = require('../../structures/Settings').load()

        if (!config.toggles.staffCmds) {
            let embed = new RichEmbed()
            embed.setTitle('Command Disabled!')
            embed.setColor('RANDOM')
            embed.addField('Error', 'Command is disabled. Please contact the developer for support.')
            
            return msg.channel.send(embed)
        } 

        let staffList = await Moderation.getAllStaff()
        let paginated = util.paginate(staffList, page, Math.floor(30))

        let embed = new RichEmbed
        embed.setAuthor(`Staff List`)
        embed.setColor('RANDOM')
        embed.setFooter(`Staff List, Page #${paginated.page} of ${paginated.maxPage}`)

        embed.setDescription(stripIndents`
        ${paginated.items.map(staff => `
                **${staff['name']}** (<@${staff['chat_id']}> | ${staff['ign']}): ${staff['role']}
            `).join('\n')}
        `)

        return msg.channel.send(embed)
            .catch(err => { Logger.error(err) })
    }
}
