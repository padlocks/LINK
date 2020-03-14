var { Command } = require('discord.js-commando')
var { MessageEmbed } = require('discord.js')
var Logger = require('../../utils/Logger.js')
var Moderation = require('../../structures/Moderation')

module.exports = class EditActionCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'editaction',
            aliases: ['editaction', 'action'],
            group: 'moderation',
            memberName: 'edit_action',
            description: 'Changes action field in a log.',
            guildOnly: true,
            userPermissions: ['MANAGE_MESSAGES'],

            args: [
                {
                    key: 'logId',
                    prompt: 'LogID of log to be edited.\n',
                    type: 'integer'
                },
                {
                    key: 'action',
                    prompt: 'What action are you adding?\n',
                    type: 'string'
                }
            ]
        })
    }

    async run(msg, { logId, action }) {
        var config = require('../../structures/Settings').load()

        if (!config.toggles.mCreateLogs) {
            let embed = new MessageEmbed()
            embed.setTitle('Command Disabled!')
            embed.setColor('RANDOM')
            embed.addField('Error', 'Command is disabled. Please contact the developer for support.')
            
            return msg.channel.send(embed)
        } 

        // confirm bot has proper permissions...
        let perms = []
        if (!msg.guild.me.hasPermission('MANAGE_MESSAGES')) perms.push('MANAGE_MESSAGES')
        if (!msg.guild.me.hasPermission('KICK_MEMBERS')) perms.push('KICK_MEMBERS')
        if (!msg.guild.me.hasPermission('BAN_MEMBERS')) perms.push('BAN_MEMBERS')

        if (perms.length > 0) return msg.reply(`I require the additional following permissions to use this command: ${perms}`)

        action = action.toUpperCase() // fault tolerance

        let log = await Moderation.editLogAction(logId, action)
        log = log[0]
        if (!log.user_id) {
            return msg.reply('that logId does not exist.')
        }
        let points = await Moderation.getPoints(log.user_id)

        let embed = new MessageEmbed
        embed.setAuthor(`${log.username} (${log.user_id}) | User Log #${log.user_log_num}`)
        embed.setDescription(`See evidence using '!logevidence ${logId}'\nAdd evidence using '!add' with an attachment.`)
        embed.setColor('#FF0000')
        embed.setTitle(`LogID: ${logId}`)
        embed.addField('Staff', `${log.staff_username}`)
        embed.addField('Reason', `${log.reason}`)
        embed.addField('Resulting Action', `${action}`)
        embed.addField('Total User Points',`${points}`)
        embed.setFooter(`🗸 ${log.time}`)

        let logChannel = msg.guild.channels.cache.get(config.log_channel)
        logChannel.fetch(log.log_message_id)
        .then(message => {
            message.edit(embed)
            .then(msg.react('✅'))
        })
    }
}
