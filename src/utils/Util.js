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

    static format12Hour (date) {
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var ampm = hours >= 12 ? 'pm' : 'am'
        hours = hours % 12
        hours = hours ? hours : 12 // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes
        var strTime = hours + ':' + minutes + ' ' + ampm
        return strTime
      }
}

module.exports = Util
