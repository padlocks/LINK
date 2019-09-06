var { Command } = require('discord.js-commando')
var { RichEmbed } = require('discord.js')
var config = require('../../config')
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
