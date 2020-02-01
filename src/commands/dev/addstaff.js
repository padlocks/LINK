var { Command } = require('discord.js-commando')
var Moderation = require('../../structures/Moderation')

module.exports = class AddStaffCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'addstaff',
            aliases: ['addstaff'],
            group: 'dev',
            memberName: 'add_staff',
            description: 'Adds a staff member to the database.',
            guildOnly: false,
            args: [
                {
                    key: 'igid',
                    prompt: 'Staff igid\n',
                    type: 'string'
                },
                {
                    key: 'name',
                    prompt: 'Staff name\n',
                    type: 'string'
                },
                {
                    key: 'ign',
                    prompt: 'Staff ign\n',
                    type: 'string'
                },
                {
                    key: 'chat_id',
                    prompt: 'Staff discord id\n',
                    type: 'string'
                },
                {
                    key: 'username',
                    prompt: 'Staff discord username\n',
                    type: 'string'
                },
                {
                    key: 'role',
                    prompt: 'Staff\'s role in the group\n',
                    type: 'string'
                }
            ]
        })
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author)
    }

    async run(msg, { igid, name, ign, chat_id, username, role }) {
        var config = require('../../structures/Settings').load()

        if (!config.toggles.staffCmds) {
            let embed = new RichEmbed()
            embed.setTitle('Command Disabled!')
            embed.setColor('RANDOM')
            embed.addField('Error', 'Command is disabled. Please contact the developer for support.')
            
            return msg.channel.send(embed)
        } 
        await msg.channel.send(await Moderation.addStaff(igid,name,ign,chat_id,username,role))
    }
}
