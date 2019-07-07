class Util {
    constructor () {
        throw new Error(`The ${this.constructor.name} class may not be instantiated.`)
    }

    static cleanContent (msg, content) {
        return content.replace(/@everyone/g, '@\u200Beveryone')
            .replace(/@here/g, '@\u200Bhere')
            .replace(/<@&[0-9]+>/g, roles => {
                var replaceID = roles.replace(/<|&|>|@/g, '')
                var role = msg.channel.guild.roles.get(replaceID)

                return `@${role.name}`
            })
            .replace(/<@!?[0-9]+>/g, user => {
                var replaceID = user.replace(/<|!|>|@/g, '')
                var member = msg.channel.guild.members.get(replaceID)

                return `@${member.user.username}`
            })
    }
}

module.exports = Util
