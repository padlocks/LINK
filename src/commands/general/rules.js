var { Command } = require('discord.js-commando')
var { RichEmbed } = require('discord.js')
var experimentsEnabled = require('../../utils/experimentsEnabled.js')

module.exports = class RulesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rules',
            aliases: ['rules', 'guidelines'],
            group: 'general',
            memberName: 'rules',
            description: 'A nice visual for the rules and guidelines',
            guildOnly: false
        })
    }

    hasPermission(msg) {
        return msg.member.hasPermission('MANAGE_MESSAGES')
    }

    async run(msg) {
        var config = require('../../structures/Settings').load()

        if (!config.toggles.rulesCmd) {
            let embed = new RichEmbed()
            embed.setTitle('Command Disabled!')
            embed.setColor('RANDOM')
            embed.addField('Error', 'Command is disabled. Please contact the developer for support.')
            
            return msg.channel.send(embed)
        } 

        let embed = new RichEmbed
        if (experimentsEnabled.check()) {
            embed.setColor('RANDOM')
            embed.setDescription(`${config.rules}`)
            embed.setFooter(`Overview | Guidelines`)
            embed.setTimestamp()
        } else {
            embed.setColor('RANDOM')
            embed.setDescription('Experiments are disabled.')
            embed.setFooter(`Error occured!`)
            embed.setTimestamp()
        }
        return msg.channel.send(embed)
    }
}
